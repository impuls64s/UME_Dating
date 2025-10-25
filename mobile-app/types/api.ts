// types/api.ts
export interface ApiResponse<T = any> {
    data: T;
    status: number;
    message?: string;
  }
  
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    access_token: string;
    token_type: string;
    user: {
      id: number;
      email: string;
      name: string;
    };
  }
  
  export interface ErrorResponse {
    message: string;
    code: number;
    details?: any;
  }