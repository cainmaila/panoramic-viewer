import { PolyhedronGeometry, Vector3 } from 'three';
const indicesOfFaces = [0, 1, 2, 0, 2, 3];
export default class extends PolyhedronGeometry {
  constructor(_points: Vector3[]) {
    const verticesOfCube: number[] = [];
    _points.forEach((_po) => {
      verticesOfCube.push(_po.x);
      verticesOfCube.push(_po.y);
      verticesOfCube.push(_po.z);
    });
    super(verticesOfCube, indicesOfFaces, 400, 0);
  }
}
