export interface Dent {
  code: string;
  order: number;
  type?: string;
}

export interface GroupeDents {
  label: string;
  teeth: Dent[];
  order: number;
}

export interface OrientationDentaire {
  orientation: 'top' | 'bottom';
  data: GroupeDents[];
}

export type DentType = {
  key: string;
  value: string;
};