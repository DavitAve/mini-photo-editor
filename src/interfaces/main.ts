export interface IChanges {
  zoom: number;
  rotate: number;
  blur: number;
  contr: number;
  brightness: number;
  saturate: number;
  grayscale: number;
  invert: number;
  sepia: number;
  images: FileT;
}

export type FileT = string | ArrayBuffer | null;
