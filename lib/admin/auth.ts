import { auth } from "../auth";
import { getUserById, isUserAdmin } from "../users/db";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return { authorized: false as const, session: null, user: null };
  }

  const user = await getUserById(session.user.id);
  const authorized = isUserAdmin(user, session.user.email);

  return { authorized, session, user };
}
