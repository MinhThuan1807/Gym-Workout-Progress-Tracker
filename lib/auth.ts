// lib/auth.ts
import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Lưu token
export function setToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function setRefreshToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }
}

// Lấy token
export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

export function getRefreshToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }
  return null;
}

// Xóa token (logout)
export function removeTokens() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

// Decode JWT để lấy payload
export function decodeToken(token: string): AuthUser | null {
  try {
    return jwtDecode<AuthUser>(token);
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
}

// Kiểm tra token hết hạn chưa
export function isTokenExpired(token: string): boolean {
  try {
    const decoded: any = jwtDecode(token);
    if (!decoded.exp) return true;
    
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
}

// Lấy current user từ token
export function getCurrentUser(): AuthUser | null {
  const token = getToken();
  if (!token) return null;
  
  if (isTokenExpired(token)) {
    removeTokens();
    return null;
  }
  
  return decodeToken(token);
}