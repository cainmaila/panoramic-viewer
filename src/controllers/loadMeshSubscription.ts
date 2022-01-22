import { Observable } from 'rxjs';
import { Scene } from 'three';
import AreaMesh from './customize/AreaMesh';
import { I_AddAreaMeshMessage } from './observers/creareAreaObserver';

export const loadMeshSubscription = (scene: Scene) =>
  new Observable((subscriber) => {
    const _meshJson: string | null = localStorage.getItem('mesh');
    if (_meshJson) {
      subscriber.next(JSON.parse(_meshJson));
    } else {
      subscriber.next([]);
    }
    subscriber.complete();
  }).subscribe((data) => {
    const _arr = <I_AddAreaMeshMessage[]>data;
    _arr.forEach((_meta) => {
      scene.add(new AreaMesh(_meta.points, _meta.name));
    });
  });
