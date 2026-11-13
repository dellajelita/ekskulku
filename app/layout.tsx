import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EkskulKu - Pendaftaran Ekstrakurikuler Sekolah",
  description: "Aplikasi pendaftaran ekstrakurikuler sekolah",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        {/* Menggunakan Tailwind CDN agar langsung jalan tanpa perlu proses build CSS */}
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="antialiased bg-gray-50 text-gray-800">{children}</body>
    </html>
  );
}
