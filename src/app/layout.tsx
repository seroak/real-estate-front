import "./globals.css";
import RQProviders from "./_components/RQProvider";
import { dehydrate, QueryClient } from "@tanstack/react-query";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  return (
    <html lang="ko">
      <body suppressHydrationWarning>
        <RQProviders>
          <main className="max-w-6xl mx-auto px-4 pt-4 pb-10">{children}</main>
        </RQProviders>
      </body>
    </html>
  );
}
