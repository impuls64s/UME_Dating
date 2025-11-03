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


// export interface ApiResponse<T = any> {
//     data: T;
//     status: number;
//     message?: string;
//   }
  
//   export interface LoginRequest {
//     email: string;
//     password: string;
//   }
  
//   export interface LoginResponse {
//     access_token: string;
//     token_type: string;
//     user: {
//       id: number;
//       email: string;
//       name: string;
//     };
//   }
  
//   export interface ErrorResponse {
//     message: string;
//     code: number;
//     details?: any;
//   }