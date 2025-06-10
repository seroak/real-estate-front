import NavBar from "./_components/NavBar";
export default function RealEstateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative max-w-9xl mx-auto px-4 min-h-screen overflow-visible">
      <NavBar />

      {children}
    </div>
  );
}
