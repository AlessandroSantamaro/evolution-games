export interface GameResult {
  id?: number;
  name?: string;
  game_reporting_name?: string;
  game_family?: string;
  branded?: boolean;
  jackpot?: boolean;
  uk_enabled?: boolean;
  invalid?: boolean;
  updated_at?: string;
  updated_by_username?: string;
}

export interface GamesDtoResponse {
  count: number;
  next?: any;
  previous?: any;
  results: GameResult[];
}

export interface FormOptions {
  key: number;
  value: string;
  label: string;
}

export interface GameFormItem {
  id: string;
  label: string;
  type: string;
  required: boolean;
  readOnly: boolean;
  options?: FormOptions[];
}

export interface TableHeaders {
  [key: string]: boolean;
}

export interface TableHeadersKeys {
  id: string;
  label: string;
}
