// app/(main)/layout.js
import Header from "@/components/Header";
import { checkUser } from "@/lib/checkUser";

export default async function MainLayout({ children }) {
  const user = await checkUser();

  return (
    <>
      <Header user={user} />
      {children}
    </>
  );
}
