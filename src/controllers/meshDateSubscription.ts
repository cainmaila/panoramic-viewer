import { fromEvent, map, Observable, scan } from 'rxjs';
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

export const saveMeshSubscription = (_initStore: I_AddAreaMeshMessage[] = []) =>
  fromEvent(window, 'addAreaComplete')
    .pipe(
      map((_e) => {
        const e = <CustomEvent>_e;
        return e.detail;
      }),
      scan(
        (
          _storeArr: I_AddAreaMeshMessage[],
          _meshMeta: I_AddAreaMeshMessage,
        ) => {
          const _arr = [..._storeArr, _meshMeta];
          return _arr;
        },
        _initStore,
      ),
    )
    .subscribe((_meshMeta: I_AddAreaMeshMessage[]) => {
      const _json = JSON.stringify(_meshMeta);
      localStorage.setItem('mesh', _json);
    });
