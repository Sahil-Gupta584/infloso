import { jwtDecode } from "jwt-decode";

export const sendOtp = async (email: string) => {
  try {
    const res = await fetch("http://localhost:3000/verify-email", {
      method: "post",
      body: JSON.stringify({ email }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await res.json();
    return result.ogOtp;
  } catch (error) {
    return new Error((error as Error).message);
  }
};

export function isValidToken(token: string | undefined) {
  if (!token) return false;
  const { exp } = jwtDecode(token);
  if (!exp) return false;
  return exp * 1000 > Date.now();
}

export async function getUser() {
  try {
    const res = await fetch("http://localhost:3000/me", {
      credentials: "include",
    });
    const result = await res.json();
    return result.user;
  } catch (error) {
    console.log(error);
  }
}
