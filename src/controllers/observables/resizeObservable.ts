import { fromEvent } from 'rxjs';
/**
 * onResize Observable
 * @returns
 */
export const onResizeObservable = fromEvent(window, 'resize');
