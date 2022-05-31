export interface Element {
  label: string;
  type: string;
  required: boolean;
  cid: string;
  id?: string;
  options: {
    description: string;
  };
}

export interface Option {
  label: string;
  checked: boolean;
}
