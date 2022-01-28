import { filter } from 'rxjs';
import { POINTER } from '../observables/pointerEventObservable';

export const filterHover = () => filter(_filterType);
function _filterType(_pointerState: I_PointerState) {
  return _pointerState.type === POINTER.HOVER;
}
