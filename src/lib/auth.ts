import { SignJWT, jwtVerify, errors } from "jose";

const accessTokenTtl = "15m";
const refreshTokenTtl = "7d";
const otpTokenTtl = "10m";

export type AccessTokenPayload = {
  userId: string;
  email: string;
};

export type OtpTokenPayload = {
  email: string;
  purpose: "otp";
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

export function isJwtExpired(error: unknown) {
  return error instanceof errors.JWTExpired;
}

export async function signAccessToken(payload: AccessTokenPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(accessTokenTtl)
    .sign(getJwtSecret());
}

export async function signRefreshToken(payload: AccessTokenPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(refreshTokenTtl)
    .sign(getJwtSecret());
}

export async function signOtpToken(email: string) {
  const payload: OtpTokenPayload = {
    email,
    purpose: "otp",
  };

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(otpTokenTtl)
    .sign(getJwtSecret());
}

export async function verifyAccessToken(token: string) {
  return jwtVerify<AccessTokenPayload>(token, getJwtSecret());
}

export async function verifyRefreshToken(token: string) {
  return jwtVerify<AccessTokenPayload>(token, getJwtSecret());
}

export async function verifyOtpToken(token: string) {
  return jwtVerify<OtpTokenPayload>(token, getJwtSecret());
}
