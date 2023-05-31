interface IMinMax {
  [key: string]: {
    min: number;
    max: number;
    ic: string;
  };
}

export const minMax: IMinMax = {
  zoom: {
    min: -90,
    max: 100,
    ic: "%",
  },
  rotate: {
    min: 0,
    max: 360,
    ic: "deg",
  },
  blur: {
    min: 0,
    max: 30,
    ic: "px",
  },
  contr: {
    min: 1,
    max: 10,
    ic: "%",
  },
  brightness: {
    min: 0,
    max: 100,
    ic: "%",
  },
  saturate: {
    min: 0,
    max: 100,
    ic: "%",
  },
};
