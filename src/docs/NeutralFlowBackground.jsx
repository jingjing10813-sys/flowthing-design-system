import { useEffect, useRef } from 'react';

const VERTEX = `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

// Warped, soft light bands: all channels share one intensity for neutral color.
const FRAGMENT = `
precision mediump float;
uniform vec2 resolution;
uniform float time;
void main() {
  vec2 p = gl_FragCoord.xy / resolution;
  float phase = time * 0.22 + 0.4;
  for (int step = 0; step < 3; step++) {
    float layer = float(step) + 1.0;
    p += vec2(sin(p.y * layer * 3.0 + phase),
              cos(p.x * layer * 3.0 + phase)) * (0.30 / layer);
  }
  float band = 0.5 + 0.5 * sin(p.x * 5.0);
  float core = pow(band, 8.0);
  float halo = pow(band, 3.0);
  float light = 0.012 + core * 0.32 + halo * 0.085;
  gl_FragColor = vec4(vec3(light), 1.0);
}
`;

export default function NeutralFlowBackground({ reduced }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false });
    if (!gl) return;
    const shaders = [];
    let program, buffer, frame, resizeObserver, visibilityObserver;
    const cleanup = () => {
      cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      visibilityObserver?.disconnect();
      document.removeEventListener('visibilitychange', syncPlayback);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
      shaders.forEach(shader => gl.deleteShader(shader));
    };
    const compile = (type, source) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
    };
    let visible = true, lost = false, elapsed = 0, previous = 0;
    const syncPlayback = () => {
      cancelAnimationFrame(frame);
      previous = 0;
      if (!reduced && visible && !document.hidden && !lost) frame = requestAnimationFrame(tick);
    };
    const onContextLost = event => {
      event.preventDefault();
      lost = true;
      canvas.style.opacity = '0';
      cancelAnimationFrame(frame);
    };
    const vertex = compile(gl.VERTEX_SHADER, VERTEX);
    const fragment = compile(gl.FRAGMENT_SHADER, FRAGMENT);
    program = gl.createProgram();
    buffer = gl.createBuffer();
    if (!vertex || !fragment || !program || !buffer) { cleanup(); return; }
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { cleanup(); return; }
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const resolution = gl.getUniformLocation(program, 'resolution');
    const time = gl.getUniformLocation(program, 'time');
    const draw = () => {
      gl.uniform1f(time, elapsed);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    function tick(now) {
      if (!previous || now - previous >= 32) {
        elapsed += previous ? Math.min(now - previous, 100) / 1000 : 0;
        previous = now;
        draw();
      }
      frame = requestAnimationFrame(tick);
    }
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * ratio));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * ratio));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(resolution, canvas.width, canvas.height);
      draw();
    };
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    });
    visibilityObserver.observe(canvas);
    document.addEventListener('visibilitychange', syncPlayback);
    canvas.addEventListener('webglcontextlost', onContextLost);
    resize();
    syncPlayback();
    return cleanup;
  }, [reduced]);
  return <canvas ref={canvasRef} className="landing-neutral-flow" aria-hidden="true"/>;
}
