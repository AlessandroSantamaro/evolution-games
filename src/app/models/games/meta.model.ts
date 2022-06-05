export interface FieldMeta {
  key: string;
  type: string;
  required: boolean;
  allow_empty: boolean;
  allow_null: boolean;
  read_only: boolean;
  label: string;
  max_length?: number;
}

export interface OptionMetaItem {
  [key: string]: string | number;
  id: number;
  descriptive_name: string;
}

export interface OptionItem {
  options: OptionMetaItem[];
  multiple: boolean;
  value_field: string;
  display_field: string;
}

export interface OptionsMeta {
  [key: string]: OptionItem;
}

export interface MetaDtoResponse {
  name: string;
  fields: FieldMeta[];
  options: OptionsMeta;
}
