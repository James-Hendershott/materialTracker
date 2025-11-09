export type ColorRGB = { r: number; g: number; b: number; hex: string; name?: string; percent?: number };

export type Material = {
  id: string;
  name: string;
  location: string;
  imageUri: string;
  colors: ColorRGB[];
  createdAt: number;
  updatedAt: number;
  notes: string;
};
