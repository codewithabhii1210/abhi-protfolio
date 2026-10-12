import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Single place where GSAP plugins are registered.
 *
 * The original project called `gsap.registerPlugin()` in five separate files.
 * Registering once here means every module that imports gsap gets a working
 * ScrollTrigger without repeating the call (and without risking duplicate
 * registration during hot module replacement).
 */
gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Capability detection                                                */
/* ------------------------------------------------------------------ */

/** True when the user has asked the OS to reduce animation. */
export const prefersReducedMotion = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/** True on devices with a real hover-capable pointer (excludes touch). */
export const hasFinePointer = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(hover: hover) and (pointer: fine)').matches;

export { gsap, ScrollTrigger };
