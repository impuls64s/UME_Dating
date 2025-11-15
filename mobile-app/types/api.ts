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


export interface UserProfile {
  id: number;
  email: string;
  name: string;
  age: number;
  status: string;
  height: number;
  bodyType: string;
  gender: string;
  city: string;
  cityId: number;
  avatar: string;
  photos: string[];
  bio: string;
  desires: string;
}


export const adaptUserProfile = (data: any): UserProfile => ({
  id: data.id,
  email: data.email,
  name: data.name,
  age: data.age,
  status: data.status,
  height: data.height,
  bodyType: data.body_type,  // преобразуем
  gender: data.gender,
  city: data.city,
  cityId: data.city_id,      // преобразуем
  avatar: data.avatar,
  photos: data.photos,
  bio: data.bio,
  desires: data.desires,
});


export interface EditProfile {
  name: string;
  cityId: string;
  height: number;
  bodyType: string;
  bio: string;
  desires: string;
}