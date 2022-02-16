import { Texture, TextureLoader } from 'three';
const textureLoader = new TextureLoader();
class TextureLib {
  private _map: Map<string, Texture>;
  constructor() {
    this._map = new Map();
  }
  createTexture(name, path) {
    this._map.set(name, textureLoader.load(path));
  }
  getTexture(name) {
    return this._map.get(name);
  }
}

const textureLib = new TextureLib();
textureLib.createTexture('p1', 'img/placeholder.png');
textureLib.createTexture('p2', 'img/icon.jpg');

export default textureLib;
