
import { auth, currentUser } from "@clerk/nextjs/server";

export async function checkTeacher(): Promise<boolean> {
  const { userId } = auth();
  if (!userId) return false;

  const user = await currentUser();
  const role =
    (user?.publicMetadata?.role as string | undefined) ??
    (user?.privateMetadata?.role as string | undefined);

  return role === "teacher" || role === "assistant";
}
