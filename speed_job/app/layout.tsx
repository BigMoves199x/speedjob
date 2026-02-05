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
      <head />
      <body
        className={`${inter.className} antialiased flex flex-col min-h-screen`}
      >
        {/* ✅ Tawk.to Chat Widget */}
         
        <main className="flex-grow">{children}</main>
     
      </body>
    </html>
  );
}
