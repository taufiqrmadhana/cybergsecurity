// utils/auth.ts
import { jwtDecode }from "jwt-decode";

interface DecodedToken {
  sub: string; 
  exp: number;
  role?: string;
}

export function decodeToken(token: string): DecodedToken | null {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
}
