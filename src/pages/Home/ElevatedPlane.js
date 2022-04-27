import './ElevatedPlane.css';

import { useEffect, useRef } from 'react';
import { Transition } from 'react-transition-group';
import { useReducedMotion } from 'framer-motion';
import { useTheme } from '../../components/ThemeProvider';
import { useInViewport } from '../../hooks/useInViewport';
import { useWindowSize } from '../../hooks/useWindowSize';
import { media, rgbToThreeColor } from '../../utils/style';
import { reflow } from '../../utils/transition';
import {
  Scene,
  PlaneGeometry,
  ShaderMaterial,
  Mesh,
  PerspectiveCamera,
  WebGLRenderer,
  Clock,
  Color,
  Vector2,
  sRGBEncoding,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { cleanScene, cleanRenderer } from '../../utils/three';
import fragShader from './planeFragmentShader';
import vertShader from './planeVertexShader';

// const springConfig = {
//   stiffness: 30,
//   damping: 20,
//   mass: 2,
// };

const colorObject = {
  depthColor: '#3b6497',
  surfaceColor: '#2a414c',
};

const ElevatedPlane = props => {
  const theme = useTheme();
  const { rgbBackground, themeId } = theme;
  const start = useRef(new Clock());
  const canvasRef = useRef();
  // const mouse = useRef();
  const renderer = useRef();
  const camera = useRef();
  const scene = useRef();
  const material = useRef();
  const geometry = useRef();
  const plane = useRef();
  const controls = useRef();
  const isInViewport = useInViewport(canvasRef);
  const prefersReducedMotion = useReducedMotion();
  const windowSize = useWindowSize();

  useEffect(() => {
    const { innerWidth, innerHeight } = window;
    // mouse.current = new Vector2(0.0, 0.0);

    renderer.current = new WebGLRenderer({
      canvas: canvasRef.current,
      antialias: false,
      powerPreference: 'high-performance',
    });
    renderer.current.setSize(innerWidth, innerHeight);
    renderer.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.current.outputEncoding = sRGBEncoding;

    //   Setting up camera
    camera.current = new PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 100);
    camera.current.position.set(0, -5.5, 0);

    // New Scene
    scene.current = new Scene();

    scene.current.add(camera.current);
    // Setting up plane geometry
    geometry.current = new PlaneGeometry(2, 2, 512, 128);

    // Setting up Shader material
    material.current = new ShaderMaterial({
      vertexShader: vertShader,
      fragmentShader: fragShader,
      uniforms: {
        uTime: { value: 0 },
        // Big Waves
        uBigWavesElevation: { value: 0.2 },
        uBigWavesFrequency: { value: new Vector2(4, 1.5) },
        uBigWavesSpeed: { value: 0.75 },
        // Small Waves
        // uSmallWavesElevation: { value: 0.15 },
        uSmallWavesElevation: { value: 4 },
        uSmallWavesFrequency: { value: 3 },
        uSmallWavesSpeed: { value: 0.1 }, //previous value  - 0.2
        uSmallWavesIteration: { value: 4 },

        uDepthColor: { value: new Color(colorObject.depthColor) },
        uSurfaceColor: { value: new Color(colorObject.surfaceColor) },
        uColorOffset: { value: 0.25 },
        uColorMultiplier: { value: 2 },
      },
    });

    //   Setting up plane
    plane.current = new Mesh(geometry.current, material.current);
    plane.current.rotation.x = -Math.PI * 0.5;
    plane.current.rotation.y = 0.15;
    scene.current.add(plane.current);

    // //   Setting up controls
    controls.current = new OrbitControls(camera.current, canvasRef.current);
    controls.current.enableDamping = true;
    controls.current.enableZoom = false;
    controls.current.enableRotate = false;
    controls.current.enabled = false;

    return () => {
      cleanScene(scene.current);
      cleanRenderer(renderer.current);
    };
  }, []);

  useEffect(() => {
    scene.current.background = new Color(...rgbToThreeColor(rgbBackground));
  }, [rgbBackground, themeId]);

  useEffect(() => {
    const { width, height } = windowSize;
    // const adjustedWidth = width + width * 0.3;
    renderer.current.setSize(width, height);
    camera.current.aspect = width / height;
    camera.current.updateProjectionMatrix();
    controls.current.update();
    // Render a single frame on resize when not animating
    if (prefersReducedMotion) {
      renderer.current.render(scene.current, camera.current);
    }

    if (width <= media.mobile) {
      plane.current.position.x = 0;
      plane.current.position.y = 1;
    } else if (width <= media.tablet) {
      plane.current.position.x = 0;
      plane.current.position.y = 0.75;
    } else {
      plane.current.position.x = 0;
      plane.current.position.y = 0.25;
    }
  }, [prefersReducedMotion, windowSize]);

  useEffect(() => {
    let animation;

    const animate = () => {
      animation = window.requestAnimationFrame(animate);

      const elapsedTime = start.current.getElapsedTime();

      //   Animation for water shader
      material.current.uniforms.uTime.value = elapsedTime;

      plane.current.rotation.z = elapsedTime * 0.25;

      // Update controls
      controls.current.update();

      renderer.current.render(scene.current, camera.current);

      // animation = window.requestAnimationFrame(animate);
    };

    if (!prefersReducedMotion && isInViewport) {
      animate();
    } else {
      renderer.current.render(scene.current, camera.current);
    }

    return () => {
      window.cancelAnimationFrame(animation);
    };
  }, [isInViewport, prefersReducedMotion]);

  return (
    <Transition appear in onEnter={reflow} timeout={3000}>
      {status => (
        <canvas
          aria-hidden
          className="elevated-plane"
          data-status={status}
          ref={canvasRef}
          {...props}
        />
      )}
    </Transition>
  );
};

export default ElevatedPlane;
