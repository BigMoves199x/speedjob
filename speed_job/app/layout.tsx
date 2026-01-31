import "@/app/ui/global.css";
import { inter } from "@/app/ui/fonts";

import Navbar from "@/app/ui/navbar";
import Script from "next/script"; 

export const metadata = {
  title: "Vaco",
  description: "Vaco job application platform",
  icons: {
    icon: "/logom.png",
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
