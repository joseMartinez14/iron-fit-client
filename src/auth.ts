/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
export const STORAGE_KEY = "client_id";

export function getClientId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setClientId(id: string) {
  localStorage.setItem(STORAGE_KEY, id);
}

export function clearClientId() {
  localStorage.removeItem(STORAGE_KEY);
}

export function isLoggedIn(): boolean {
  return !!getClientId();
}

// Simple placeholder for real auth
export async function loginWithPassword(
  username: string,
  password: string
): Promise<{ client_id: string }> {
  // Read API URL from environment variable
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) throw new Error("API URL not set in .env (VITE_API_URL)");
  try {
    const response = await axios.post(`${apiUrl}/v1/auth`, {
      username,
      password,
    });
    // Expecting backend to return { client_id }
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Login failed");
  }
}
