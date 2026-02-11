declare module "*.module.css" {
    const classes: { [key: string]: string };
    export default classes;
  }
  declare module "*.png" {
    const content: string;
    export default content;
  }
  // Minimal fallback declarations for 'three' to avoid missing module errors
  declare module 'three' {
    export class Scene {
      background: unknown
      add: (...objects: unknown[]) => void
      clear: () => void
      children: unknown[]
    }
    export class Color {
      constructor(hex: number)
    }
    export class PerspectiveCamera {
      constructor(fov: number, aspect: number, near: number, far: number)
      position: { z: number; x: number; y: number }
    }
    export class WebGLRenderer {
      constructor(params?: { antialias?: boolean })
      domElement: HTMLCanvasElement
      setSize: (w: number, h: number) => void
      render: (scene: Scene, camera: PerspectiveCamera) => void
      dispose: () => void
    }
    export class AmbientLight {
      constructor(color?: number, intensity?: number)
    }
    export class DirectionalLight {
      constructor(color?: number, intensity?: number)
      position: { set: (x: number, y: number, z: number) => void }
    }
    export class BoxGeometry {
      constructor(w: number, h: number, d: number)
    }
    export class MeshPhongMaterial {
      constructor(params?: { color?: number; shininess?: number })
    }
    export class Mesh {
      constructor(geo?: unknown, mat?: unknown)
      position: { x: number; y: number; z: number; set: (x: number, y: number, z: number) => void }
      rotation: { x: number; y: number; z: number }
    }
  }