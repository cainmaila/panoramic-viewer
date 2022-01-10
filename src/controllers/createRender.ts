import { animationFrames } from 'rxjs';
import * as THREE from 'three';
import { rendererResize } from './renderResizeController';

/**
 * THREE renderer init
 * @param view 
 * @returns 
 */
export function sceneInit(view:Element|null):SceneInit {
    if (!view) throw new Error('view can not null!');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      view.clientWidth / view.clientHeight,
      0.1,
      1000,
    );
    camera.position.z = 5
    const light = new THREE.AmbientLight(0xffffff, 1) // soft white light
    scene.add(light)
    const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    view.appendChild(renderer.domElement);
    //resize
    const onResizeOb = rendererResize(view, renderer,camera);
    //animationFrames
    // const clock = new THREE.Clock()
    const animationFramesSubscribe= animationFrames().subscribe(()=>{
      // console.log(clock.getDelta())
      renderer.render(scene, camera)
    })
    return {
        scene,
        camera,
        renderer,
        unsubscribe:()=>{
          onResizeOb.unsubscribe()
          animationFramesSubscribe.unsubscribe()
        }
    }
  }


  interface SceneInit {
    scene:  THREE.Scene,
    camera:  THREE.PerspectiveCamera,
    renderer:  THREE.WebGLRenderer,
    unsubscribe:Uload
  }

  interface Uload {
      ():void;
  }