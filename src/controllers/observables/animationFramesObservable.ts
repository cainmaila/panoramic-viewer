import { animationFrames, connectable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Clock } from 'three';
const clock = new Clock();
/**
 * animationFrames Observable
 */
export const animationFramesObservable = animationFrames().pipe(
  map(() => clock.getDelta()),
);

/**
 * animationFrames Subject
 */
export const animationFrames$ = connectable(animationFramesObservable, {
  connector: () => new Subject(),
});
