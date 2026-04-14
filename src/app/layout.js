import { Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Vela Noire Admin",
  description: "Admin dashboard for Vela Noire",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${geistMono.variable} ${outfit.className} h-full antialiased dark`}
    >
      <body className="min-h-full bg-zinc-50">
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
