import { fromEvent, map, Observable, switchMap, takeUntil } from 'rxjs';

interface Po {
  x: number;
  y: number;
}

export interface I_Select {
  x: number;
  y: number;
  x1: number;
  y1: number;
}

const mapPo = map((_e) => {
  const e = <PointerEvent>_e;
  return {
    x: e.clientX,
    y: e.clientY,
  };
});

const pointerdown$: Observable<Po> = fromEvent(window, 'pointerdown').pipe(
  mapPo,
);
const pointermove$: Observable<Po> = fromEvent(window, 'pointermove').pipe(
  mapPo,
);
const pointerupTake$: Observable<Event> = fromEvent(window, 'pointerup');

export const pointerSelect$: Observable<I_Select> = pointerdown$.pipe(
  switchMap((_po: Po) =>
    pointermove$.pipe(map((_movePo: Po) => mapingPoToSelect(_po, _movePo))),
  ),
  takeUntil(pointerupTake$),
);

function mapingPoToSelect(_p1: Po, _p2: Po): I_Select {
  return { ..._p1, x1: _p2.x, y1: _p2.y };
}
