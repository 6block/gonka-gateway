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
uniform float uSpring;
uniform float uSettled;
uniform sampler2D uHome;
uniform mat4 uViewProj;
uniform mat4 uModel;
uniform mat3 uFlowToLocal;
varying vec2 vUv;

${SDF_GLSL}
${CURL_GLSL}

void main() {
  vec3 pos = texture2D(uPositions, vUv).xyz;

  if (uSettled < 0.5) {
    // Formation: curl drift, swirl and surface pull bring the random cloud
    // onto the shape. Only runs during the off-screen prewarm.
    vec3 origin = texture2D(uOrigin, vUv).xyz;
    if (length(pos) > 0.7) pos /= 2.0;
    pos += curlNoise(pos * 2.0 + uTime * 0.05) * 0.0002 * uHz;
    vec3 gradient = normalize(sdfNormal(pos) + 1e-6);
    float sdf = sdfShape(pos);
    pos += cross(normalize(pos + 1e-6), gradient) * 0.0005 * uHz;
    pos += -gradient * sdf * 0.5;
    pos += (origin - pos) * 0.012 * uHz;
  } else {
    // Settled: every particle springs to the home it formed at. Nothing else
    // acts on it, so at rest the cloud is still; the idle float is applied in
    // the vertex shader, where it cannot accumulate into jitter.
    vec3 home = texture2D(uHome, vUv).xyz;
    pos += (home - pos) * uSpring * uHz;
  }

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

// Idle float: each point traces its own slow loop (periods of roughly 8–20 s),
// offset from its simulated position. Pure function of time, so it never
// accumulates and reads as drifting rather than shaking.
const float FLOAT_AMP = 0.006;

void main() {
  vec3 pos = texture2D(uPositions, aRef).xyz;
  vec3 phase = aRandom.xyz * 6.2831;
  vec3 speed = 0.3 + aRandom.wzy * 0.45;
  pos += FLOAT_AMP * vec3(
    sin(uTime * speed.x + phase.x),
    sin(uTime * speed.y + phase.y),
    sin(uTime * speed.z + phase.z)
  );
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

  vec3 color = vec3(mix(0.0, 0.2, vRandom.x));
  color = mix(color, uAccent, pow(vRandom.z, 220.0));

  // Twinkle slowed from the brief's 4 rad/s, which read as flicker at rest.
  float sparkle = 0.5 + (0.4 + sin(uTime * 1.2 + vRandom.y * 20.0)) * pow(vRandom.z, 10.0) * 2.5;
  color *= sparkle;

  float ang = sin(uTime * 0.35 + vRandom.z * 20.0) * 0.5 + 1.0;
  float ca = cos(ang), sa = sin(ang);
  vec2 muv = mat2(ca, -sa, sa, ca) * c + 0.5;
  vec3 mc = texture2D(uMatcap, muv).rgb;
  color = mix(color, softLight(color, mc), 0.8);
  color = mix(color, overlay(color, mc), 0.2);

  gl_FragColor = vec4(color, 1.0);
}
`
