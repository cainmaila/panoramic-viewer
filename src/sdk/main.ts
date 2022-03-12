import { fromEvent, map, take } from 'rxjs';
import THREE from 'three';

export default class {
  private _name: string;
  private _sc: THREE.Scene;
  constructor() {
    this._name = 'Cain SDK';
    this._sc = new THREE.Scene();
    fromEvent(window, 'resize')
      .pipe(
        map((e) => {
          return e.target;
        }),
        take(4),
      )
      .subscribe(console.log);
  }
  log() {
    console.log(this._name, this._sc);
  }
}
