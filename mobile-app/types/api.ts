export interface UserFormData {
  email: string;
  name: string;
  birthDate: Date;
  height: string;
  gender: string;
  cityId: string;
  bodyType: string;
}

export interface City {
  value: number;
  label: string;
}


export interface UserFormErrors {
  email?: string;
  name?: string;
  birthDate?: string;
  height?: string;
  gender?: string;
  cityId?: string;
  bodyType?: string;
}

export interface MyProfile {
  id: number;
  email: string;
  name: string;
  age: number;
  status: string;
  height: number;
  bodyType: string;
  gender: string;
  city: string;
  avatar: string;
  photos: string[];
}
