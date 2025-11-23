import { Suspense } from "react";
import NavBar from "@/src/components/real-estate/NavBar";
import { FolderProvider } from "@/src/contexts/FolderContext";

export default function RealEstateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <FolderProvider>
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <NavBar />
        </Suspense>
        {children}
      </div>
    </FolderProvider>
  );
}