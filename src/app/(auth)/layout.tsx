import Footer from "@/components/home/footer";
import Header from "@/components/home/header";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex items-center justify-center h-screen p-4">
        {children}
      </div>
      <Footer />
    </>
  );
}
