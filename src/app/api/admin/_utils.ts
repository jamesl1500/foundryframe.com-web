import { NextResponse } from "next/server";
import { getCmsConfigOrNull, isCmsEntity } from "@/lib/cms/config";
import { getCurrentAdminUser } from "@/lib/admin-auth";

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function requireAdmin(): Promise<NextResponse | undefined> {
  const adminUser = await getCurrentAdminUser();

  if (!adminUser) {
    return unauthorizedResponse();
  }

  return undefined;
}

export function parseEntityOrFail(entity: string) {
  if (!isCmsEntity(entity)) {
    return {
      response: NextResponse.json({ error: "Unsupported CMS entity." }, { status: 404 }),
      config: null,
    };
  }

  return {
    response: undefined,
    config: getCmsConfigOrNull(entity),
  };
}
