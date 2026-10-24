import { NextResponse, type NextRequest } from "next/server";
import { ACCOUNT_HREF } from "@/components/account/links";
import { currentMember } from "@/lib/account";

/**
 * MEMBERS-ONLY ROOMS. Masterclass and Design open only with a Construct
 * account (Free is enough); anyone else is sent to sign in and comes back
 * here after. Checked on the server for every request, so a fresh or
 * private window never sees them. An expired session is refreshed here and
 * the new cookies ride on the response.
 */
export async function proxy(request: NextRequest) {
  const { member, cookies } = await currentMember(request);
  const back = request.nextUrl.pathname + request.nextUrl.search;
  const res = member
    ? NextResponse.next()
    : NextResponse.redirect(new URL(`${ACCOUNT_HREF}?next=${encodeURIComponent(back)}`, request.url));
  for (const c of cookies) res.headers.append("set-cookie", c);
  return res;
}

export const config = {
  matcher: ["/projects/construct/masterclass", "/projects/construct/design"],
};
