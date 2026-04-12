export function checkAuth(request: Request): boolean {
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${process.env.ADMIN_PASSWORD}`;
}

export function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
