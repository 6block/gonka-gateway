import { CURL_GLSL, SDF_GLSL } from './field'

export const FULLSCREEN_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

// One step of the position simulation. Reads the previous positions and writes
// the next ones into the other half of a ping-pong pair.
export const SIM_FRAG = /* glsl */ `
precision highp float;
uniform sampler2D uPositions;
uniform sampler2D uOrigin;
uniform sampler2D uVelocity;
uniform sampler2D uDensity;
uniform float uTime;
uniform float uHz;
uniform float uMouseStrength;
uniform mat4 uViewProj;
uniform mat4 uModel;
uniform mat3 uFlowToLocal;
varying vec2 vUv;

${SDF_GLSL}
${CURL_GLSL}

void main() {
  vec3 pos = texture2D(uPositions, vUv).xyz;
  vec3 origin = texture2D(uOrigin, vUv).xyz;

  // Every frame, as in the reference: a slow, coherent curl drift, a swirl
  // along the surface, a pull onto the surface and a faint spring to the
  // particle's origin. Together they keep the cloud sliding over the form.
  if (length(pos) > 0.7) pos /= 2.0;
  pos += curlNoise(pos * 0.1 + uTime * 0.05) * 0.0002 * uHz;
  vec3 gradient = sdfNormal(pos);
  float sdf = sdfShape(pos);
  pos += cross(normalize(pos + 1e-6), normalize(gradient + 1e-6)) * 0.0005;
  pos += -gradient * sdf * 0.5;
  pos += (origin - pos) * 0.0002 * uHz;

  // Cursor fluid: project into screen space, sample the flow there, and carry
  // the particle along it where the cursor has recently been.
  vec4 clip = uViewProj * uModel * vec4(pos, 1.0);
  vec2 screenUv = clip.xy / clip.w * 0.5 + 0.5;
  if (clip.w > 0.0 && all(greaterThan(screenUv, vec2(0.0))) && all(lessThan(screenUv, vec2(1.0)))) {
    vec2 vel = texture2D(uVelocity, screenUv).xy;
    vec3 dye = texture2D(uDensity, screenUv).rgb;
    float mask = min(max(dye.r, max(dye.g, dye.b)), 1.0);
    pos += uFlowToLocal * vec3(vel, 0.0) * 0.0001 * uHz * uMouseStrength * mask;
  }

  gl_FragColor = vec4(pos, 1.0);
}
`

export const POINTS_VERT = /* glsl */ `
uniform sampler2D uPositions;
uniform float uDpr;
uniform float uSizeScale;
uniform float uTime;
attribute vec2 aRef;
attribute vec4 aRandom;
varying vec4 vRandom;
varying float vScale;

void main() {
  vec3 pos = texture2D(uPositions, aRef).xyz;
  pos *= mix(1.0, 1.5, pow(aRandom.y, 150.0));

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  float dist = -mv.z;
  float scale = smoothstep(3.0, 15.0, dist) * mix(0.5, 1.0, aRandom.z);

  vRandom = aRandom;
  vScale = scale;
  gl_PointSize = 0.04 * uDpr * 2.0 * uSizeScale * scale * (1000.0 / dist);
  gl_Position = projectionMatrix * mv;
}
`

export const POINTS_FRAG = /* glsl */ `
precision highp float;
uniform sampler2D uMatcap;
uniform float uTime;
uniform vec3 uAccent;
uniform float uGain;
varying vec4 vRandom;
varying float vScale;

vec3 softLight(vec3 base, vec3 blend) {
  return mix(
    2.0 * base * blend + base * base * (1.0 - 2.0 * blend),
    sqrt(base) * (2.0 * blend - 1.0) + 2.0 * base * (1.0 - blend),
    step(0.5, blend)
  );
}

vec3 overlay(vec3 base, vec3 blend) {
  return mix(
    2.0 * base * blend,
    1.0 - 2.0 * (1.0 - base) * (1.0 - blend),
    step(0.5, base)
  );
}

void main() {
  vec2 c = gl_PointCoord - 0.5;
  if (dot(c, c) > 0.25) discard;
  if (vScale < 0.1) discard;

  // Grey body brightened by uGain: a bigger form spreads the same points over
  // more screen, so without it the shape thins out and loses its read.
  vec3 color = vec3(mix(0.0, 0.2, vRandom.x) * uGain);
  color = mix(color, uAccent, pow(vRandom.z, 100.0));

  float sparkle = 0.5 + (0.4 + sin(uTime * 4.0 + vRandom.y * 20.0)) * pow(vRandom.z, 10.0) * 2.5;
  color *= sparkle;

  float ang = sin(uTime + vRandom.z * 20.0) * 0.5 + 1.0;
  float ca = cos(ang), sa = sin(ang);
  vec2 muv = mat2(ca, -sa, sa, ca) * c + 0.5;
  vec3 mc = texture2D(uMatcap, muv).rgb;
  color = mix(color, softLight(color, mc), 0.8);
  color = mix(color, overlay(color, mc), 0.2);

  gl_FragColor = vec4(color, 1.0);
}
`
