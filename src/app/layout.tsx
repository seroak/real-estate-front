import "./globals.css";
import RQProviders from "@/src/components/common/RQProvider";
import { Analytics } from "@vercel/analytics/next";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body suppressHydrationWarning>
        <RQProviders>
          <main className="mx-auto px-4 pt-4 pb-10">{children}</main>
          <Analytics />
        </RQProviders>
      </body>
    </html>
  );
}
