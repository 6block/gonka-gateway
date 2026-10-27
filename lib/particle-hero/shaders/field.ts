// GLSL shared by the particle simulation: the target shape (a signed distance
// field) and the curl-noise drift that keeps the cloud alive.

// A bent, lobed, twisted ring about 0.7 units across, with one large opening.
// Not an exact SDF after the deformations, but the simulation only needs its
// zero set and a usable gradient, both of which it provides.
export const SDF_GLSL = /* glsl */ `
// The ring is modelled at unit size and shrunk so it sits well inside the frame.
const float SHAPE_SCALE = 2.6;

float ringShape(vec3 p) {
  float a = atan(p.z, p.x);
  // Saddle bend: two opposite sides of the ring lift, two dip.
  p.y -= 0.11 * cos(2.0 * a);

  float major = 0.42 + 0.035 * sin(3.0 * a + 0.6);
  vec2 q = vec2(length(p.xz) - major, p.y);

  // Cross-section is an ellipse that twists one and a half turns round the ring.
  float tw = 1.5 * a;
  float c = cos(tw), s = sin(tw);
  q = mat2(c, -s, s, c) * q;

  float minor = 0.16 + 0.05 * sin(2.0 * a + 1.3) + 0.02 * sin(5.0 * a);
  return length(q / vec2(1.0, 0.62)) * 0.8 - minor;
}

float sdfShape(vec3 p) {
  float r = length(p);
  if (r > 0.8) return r - 0.7;
  return ringShape(p * SHAPE_SCALE) / SHAPE_SCALE;
}

vec3 sdfNormal(vec3 p) {
  const float e = 0.001;
  return vec3(
    sdfShape(p + vec3(e, 0.0, 0.0)) - sdfShape(p - vec3(e, 0.0, 0.0)),
    sdfShape(p + vec3(0.0, e, 0.0)) - sdfShape(p - vec3(0.0, e, 0.0)),
    sdfShape(p + vec3(0.0, 0.0, e)) - sdfShape(p - vec3(0.0, 0.0, e))
  ) / (2.0 * e);
}
`

// Curl of three sine-sum potentials (Bridson-style), by central differences.
// Divergence-free, so the drift swirls instead of collapsing or exploding.
export const CURL_GLSL = /* glsl */ `
vec3 potential(vec3 p) {
  return vec3(
    sin(p.y * 1.7 + p.z * 0.6) + sin(p.z * 2.3 - p.x * 0.9) * 0.5,
    sin(p.z * 1.9 + p.x * 0.7) + sin(p.x * 2.1 + p.y * 1.1) * 0.5,
    sin(p.x * 1.5 + p.y * 0.8) + sin(p.y * 2.7 - p.z * 1.3) * 0.5
  );
}

vec3 curlNoise(vec3 p) {
  const float e = 0.01;
  vec3 dx = vec3(e, 0.0, 0.0);
  vec3 dy = vec3(0.0, e, 0.0);
  vec3 dz = vec3(0.0, 0.0, e);
  vec3 px0 = potential(p - dx), px1 = potential(p + dx);
  vec3 py0 = potential(p - dy), py1 = potential(p + dy);
  vec3 pz0 = potential(p - dz), pz1 = potential(p + dz);
  vec3 c = vec3(
    (py1.z - py0.z) - (pz1.y - pz0.y),
    (pz1.x - pz0.x) - (px1.z - px0.z),
    (px1.y - px0.y) - (py1.x - py0.x)
  ) / (2.0 * e);
  return normalize(c + 1e-5);
}
`
