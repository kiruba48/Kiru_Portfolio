import './Image.css';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Transition } from 'react-transition-group';
import { useReducedMotion } from 'framer-motion';
import { classes } from '../../utils/style';
import { cssProps, numToMs } from '../../utils/style';
import { useTheme } from '../ThemeProvider';
import { useInViewport } from '../../hooks/useInViewport';
import { prerender } from '../../utils/prerender';
import {
  PlaneGeometry,
  ShaderMaterial,
  Scene,
  Vector2,
  Mesh,
  TextureLoader,
  PerspectiveCamera,
  AmbientLight,
  WebGLRenderer,
  sRGBEncoding,
  Clock,
} from 'three';
import { fragment, vertex } from './ImageShaders';
import { useWindowSize } from '../../hooks/useWindowSize';

export const Image = ({
  className,
  style,
  reveal,
  delay = 0,
  raised,
  src: baseSrc,
  srcSet,
  hoverImage,
  ...rest
}) => {
  const [loaded, setLoaded] = useState(false);
  const { themeId } = useTheme();
  const containerRef = useRef();
  const src = baseSrc || srcSet?.[0];
  const inViewport = useInViewport(containerRef, !src?.endsWith('.mp4'));
  const onLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <div
      className={classes('image', className)}
      data-visible={inViewport}
      data-reveal={reveal}
      data-raised={raised}
      data-theme={themeId}
      style={cssProps({ delay: numToMs(delay) }, style)}
      ref={containerRef}
    >
      <ImageElements
        delay={delay}
        onLoad={onLoad}
        loaded={loaded}
        inViewport={inViewport}
        reveal={reveal}
        src={src}
        srcSet={srcSet}
        hoverImage={hoverImage}
        {...rest}
      />
    </div>
  );
};

const ImageElements = ({
  onLoad,
  loaded,
  inViewport,
  srcSet,
  placeholder,
  delay,
  src,
  hoverImage,
  alt,
  play = true,
  reveal,
  ...rest
}) => {
  const imgSrc = src || srcSet?.split(' ')[0];
  const showFullRes = !prerender && inViewport;

  const theme = useTheme();
  const start = useRef(new Clock());
  const canvasRef = useRef();
  const mouse = useRef();
  const renderer = useRef();
  const camera = useRef();
  const scene = useRef();
  const material = useRef();
  const geometry = useRef();
  const wrapperRef = useRef();
  const mesh = useRef();
  const prefersReducedMotion = useReducedMotion();
  let imageSizes = new Vector2(0, 0);
  let imageOffset = new Vector2(0, 0);
  const isInViewport = useInViewport(canvasRef);
  const windowSize = useWindowSize();

  //   useEffect(() => {
  //     const { width, height } = wrapperRef.current.getBoundingClientRect();
  //     // Mouse
  //     mouse.current = new Vector2(0, 0);

  //     // Renderer
  //     renderer.current = new WebGLRenderer({
  //       canvas: canvasRef.current,
  //       antialias: false,
  //       alpha: true,
  //       powerPreference: 'high-performance',
  //       failIfMajorPerformanceCaveat: true,
  //     });

  //     renderer.current.setSize(width, height);
  //     renderer.current.setPixelRatio(1);
  //     renderer.current.outputEncoding = sRGBEncoding;

  //     // Camera
  //     const perspective = 800;
  //     const fov = (180 * (2 * Math.atan(window.innerHeight / 2 / perspective))) / Math.PI;
  //     camera.current = new PerspectiveCamera(fov, width / height, 1, 1000);
  //     camera.current.position.set(0, 0, perspective);

  //     // Scene
  //     scene.current = new Scene();
  //   });

  //   useEffect(() => {
  //     let mounted = true;

  //     const textureLoader = new TextureLoader();

  //     const imageTexture = textureLoader.load(src);
  //     const hoverImageTexture = textureLoader.load(hoverImage);

  //     const { width, height, top, left } = wrapperRef.current.getBoundingClientRect();
  //     imageSizes.set(width, height);
  //     imageOffset.set(
  //       left - window.innerWidth / 2 + width / 2,
  //       -top + window.innerHeight / 2 - height / 2
  //     );

  //     geometry.current = new PlaneGeometry(1, 1, 1, 1);

  //     material.current = new ShaderMaterial({
  //       uniforms: {
  //         u_image: { type: 't', value: imageTexture },
  //         u_imagehover: { type: 't', value: hoverImageTexture },
  //         u_mouse: { value: mouse.current },
  //         u_time: { value: 0 },
  //         u_res: {
  //           value: new Vector2(window.innerWidth, window.innerHeight),
  //         },
  //       },
  //       vertexShader: vertex,
  //       fragmentShader: fragment,
  //       defines: {
  //         PR: window.devicePixelRatio.toFixed(1),
  //       },
  //     });

  //     mesh.current = new Mesh(geometry.current, material.current);
  //     mesh.current.scale.set(imageSizes.x, imageSizes.y, 1);
  //     scene.current.add(mesh.current);
  //   });

  //   useEffect(() => {
  //     const { width, height } = windowSize;

  //     camera.current.aspect = width / height;
  //     camera.current.updateProjectionMatrix();

  //     // Update renderer
  //     renderer.current.setSize(width, height);
  //     renderer.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  //   }, [windowSize]);

  //   useEffect(() => {
  //     let animation;

  //     const animate = () => {
  //       const elapsedTime = start.current.getElapsedTime();

  //       //   Animation for water shader
  //       //   material.current.uniforms.uTime.value = elapsedTime;

  //       renderer.current.render(scene.current, camera.current);

  //       animation = window.requestAnimationFrame(animate);
  //     };

  //     if (!prefersReducedMotion && isInViewport) {
  //       animate();
  //     } else {
  //       renderer.current.render(scene.current, camera.current);
  //     }

  //     return () => {
  //       window.cancelAnimationFrame(animation);
  //     };
  //   }, [isInViewport, prefersReducedMotion]);
  return (
    <div
      className="image__element-wrapper"
      data-reveal={reveal}
      data-visible={inViewport}
      ref={wrapperRef}
      style={cssProps({ delay: numToMs(delay + 1000) })}
    >
      <img
        className="image__element"
        data-loaded={loaded}
        onLoad={onLoad}
        decoding="async"
        src={showFullRes ? imgSrc : undefined}
        srcSet={showFullRes ? srcSet : undefined}
        data-hover={hoverImage}
        alt={alt}
        {...rest}
      />

      {/* <canvas aria-hidden className="gooey__image" ref={canvasRef}></canvas> */}
    </div>
  );
};
