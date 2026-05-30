import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isJwtExpired, verifyAccessToken } from "@/lib/auth";

async function tryRefresh(request: NextRequest) {
  const refreshResponse = await fetch(
    new URL("/api/auth/refresh", request.url),
    {
      method: "POST",
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    }
  );

  if (!refreshResponse.ok) {
    return null;
  }

  const setCookie = refreshResponse.headers.get("set-cookie");
  if (!setCookie) {
    return null;
  }

  const response = NextResponse.next();
  response.headers.append("set-cookie", setCookie);
  return response;
}

export async function middleware(request: NextRequest) {
  const accessToken =
    request.cookies.get("accessToken")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  if (accessToken) {
    try {
      await verifyAccessToken(accessToken);
      return NextResponse.next();
    } catch (error) {
      if (!isJwtExpired(error)) {
        return NextResponse.redirect(new URL("/signup", request.url));
      }
    }
  }

  const refreshedResponse = await tryRefresh(request);
  if (refreshedResponse) {
    return refreshedResponse;
  }

  return NextResponse.redirect(new URL("/signup", request.url));
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/dashboard/:path*",
    "/saved-colleges/:path*",
    "/saved-comparisons/:path*",
  ],
};
