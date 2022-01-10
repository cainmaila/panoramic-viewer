import { fromEvent ,animationFrames,Observable } from 'rxjs';
import {audit   } from 'rxjs/operators';
import { createGlobalStyle } from 'styled-components';
/**
 * onResize Observable
 * @returns 
 */
export const onResizeObservable = fromEvent(window, 'resize').pipe(audit(()=>animationFrames())); 