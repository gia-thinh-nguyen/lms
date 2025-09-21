import TeacherSidebar from "../../../components/teacher/TeacherSidebar"

export default function TeacherLayout({ children }) {
  return <section>
    <TeacherSidebar />
    {children}
    </section>
}