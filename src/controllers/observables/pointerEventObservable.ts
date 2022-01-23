import {
  animationFrameScheduler,
  fromEvent,
  map,
  merge,
  Observable,
  scan,
  subscribeOn,
} from 'rxjs';

export enum POINTER {
  HOVER,
  DOWN,
}

const pointerDown$ = fromEvent(window, 'pointerdown').pipe(
  map(pointerEventToClientPo),
  map((_po) => <I_PointerState>{ start: _po }),
);
const pointerMove$ = fromEvent(window, 'pointermove').pipe(
  subscribeOn(animationFrameScheduler),
  map(pointerEventToClientPo),
  map((_po) => <I_PointerState>{ move: _po }),
);
const pointerUp$ = fromEvent(window, 'pointerup').pipe(
  map(pointerEventToClientPo),
  map((_po) => <I_PointerState>{ end: _po }),
);

/**
 * pointer 事件觀察，打出 I_PointerState 規格
 */
export const pointerEventObservable: Observable<I_PointerState> = merge(
  pointerDown$,
  pointerMove$,
  pointerUp$,
).pipe(
  scan(
    (store, meta) => {
      if (meta.start) {
        return {
          ...store,
          ...meta,
          type: POINTER.DOWN,
        };
      } else if (meta.end) {
        return {
          ...store,
          ...meta,
          type: POINTER.HOVER,
        };
      } else {
        return {
          ...store,
          ...meta,
          start: store.type === POINTER.DOWN ? store.start : null,
          end: null,
        };
      }
    },
    <I_PointerState>{
      start: null,
      move: null,
      end: null,
      type: POINTER.HOVER,
    },
  ),
);

interface I_Po {
  x: number;
  y: number;
}
export interface I_PointerState {
  start?: I_Po | null;
  move?: I_Po | null;
  end?: I_Po | null;
  type: number;
}

function pointerEventToClientPo(e: Event): I_Po {
  const _e = <PointerEvent>e;
  return {
    x: _e.clientX,
    y: _e.clientY,
  };
}
