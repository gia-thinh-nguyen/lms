import { redirect } from "next/navigation";
import { checkTeacher } from "@/utils/checkTeacher";
import TeacherDashboard from "./TeacherDashboard";

export default async function Page() {
  const isTeacher = await checkTeacher();
  if (!isTeacher) redirect("/");

  return <TeacherDashboard />;
}
