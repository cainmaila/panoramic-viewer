declare interface I_Po {
  x: number;
  y: number;
}

declare interface I_PointerState {
  start?: I_Po | null;
  move?: I_Po | null;
  end?: I_Po | null;
  type: number;
}

declare interface I_Panoramic_Handle {
  loadImage?: (string) => void;
  addArea?: () => void;
  clearStore?: () => void;
}

declare interface I_IconTexture {
  type: string;
  path: string;
}

declare interface I_PanoramicMode {
  state: string | undefined;
  params: any | undefined;
}

declare interface I_InfoNodeMeta {
  id: string;
  iconType: string;
  iconSize: number;
  position: { x: number; y: number; z: number };
}
