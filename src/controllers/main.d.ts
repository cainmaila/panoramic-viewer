interface I_Po {
  x: number;
  y: number;
}

interface I_PointerState {
  start?: I_Po | null;
  move?: I_Po | null;
  end?: I_Po | null;
  type: number;
}
