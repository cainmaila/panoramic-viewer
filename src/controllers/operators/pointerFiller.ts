import { filter, Observable } from 'rxjs';
import { I_PointerState, POINTER } from '../observables/pointerEventObservable';

export const filterHover = () => filter(_filterType);
function _filterType(_pointerState: I_PointerState) {
  return _pointerState.type === POINTER.HOVER;
}
