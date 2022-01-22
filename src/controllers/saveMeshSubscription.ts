import { fromEvent, map, scan } from 'rxjs';
import { I_AddAreaMeshMessage } from './observers/creareAreaObserver';

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
