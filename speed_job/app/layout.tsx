import "@/app/ui/global.css";
import { inter } from "@/app/ui/fonts";
import Script from "next/script";

export const metadata = {
  title: "Speed Job",
  description: "Speed job application platform",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased flex flex-col min-h-screen`}>
        {/* Tawk.to (safe in App Router) */}
        <Script id="tawk-globals" strategy="afterInteractive">
          {`var Tawk_API = Tawk_API || {}; var Tawk_LoadStart = new Date();`}
        </Script>

        <Script
          id="tawk-embed"
          src="https://embed.tawk.to/6990413d0ab4561c379948f3/1jhdntm1q"
          strategy="afterInteractive"
        />

        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
