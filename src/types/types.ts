export interface user {
  birthday: string;
  client_id: string;
  default_email: string;
  default_phone: { id: number; number: string };
  display_name: string;
  emails: string[];
  first_name: string;
  id: string;
  is_avatar_empty: boolean;
  last_name: string;
  login: string;
  psuid: string;
  real_name: string;
  sex: string;
}

export interface files {
  items: items[];
  limit:number;
}

export interface items {
  name: string;
  file: string;
  preview: string;
  media_type: string;
  resource_id:string;
}
