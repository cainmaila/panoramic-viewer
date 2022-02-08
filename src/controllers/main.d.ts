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
