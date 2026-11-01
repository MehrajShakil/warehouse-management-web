/** Mirrors WarehouseManagement.Application.Dtos.LoginDto */
export interface LoginRequest {
  userNameOrEmail: string;
  password: string;
}

/** Mirrors WarehouseManagement.Application.Dtos.CreateUserDto */
export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
}

/** Mirrors WarehouseManagement.Application.Dtos.AuthResponseDto */
export interface AuthResponse {
  userId: string;
  userName: string;
  email: string;
  accessToken: string;
  accessTokenExpires: string;
  refreshToken: string;
  refreshTokenExpires: string;
}
