import Link from "next/link";
import { ekskul, pendaftar, JAM_SESI } from "../data/ekskul";

export const metadata = {
  title: "Beranda · EkskulKu",
};

export default function HomePage() {
  const ekskulPilihan = ekskul.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Navbar Atas */}
      <header className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-bold text-xl text-blue-600">EkskulKu</span>
          <nav className="flex gap-6 text-sm font-semibold">
            <Link href="/" className="text-blue-600">
              Beranda
            </Link>
            <Link
              href="/ekskul"
              className="text-gray-600 hover:text-blue-600 transition"
            >
              Daftar Ekskul
            </Link>
            <Link
              href="/saya"
              className="text-gray-600 hover:text-blue-600 transition"
            >
              Ekskul Saya
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-16 px-4 max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-gray-900">
          Temukan Ekskul Seru di Sekolahmu
        </h1>
        <p className="text-gray-600 text-base mb-8">
          Pilih jadwal, cek ketersediaan kuota, dan kembangkan bakatmu bersama
          ekstrakurikuler pilihan.
        </p>
        <Link
          href="/ekskul"
          className="bg-blue-600 text-white font-medium px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition inline-block"
        >
          Lihat Semua Daftar Ekskul &rarr;
        </Link>
      </section>

      {/* Bagian Ekskul Pilihan */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Ekskul Pilihan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ekskulPilihan.map((item) => {
            const jumlahPendaftar = pendaftar.filter(
              (p) => p.ekskulId === item.id,
            ).length;
            const sisaTempat = item.kuota - jumlahPendaftar;
            const isPenuh = sisaTempat <= 0;
            const jamSesiText = JAM_SESI[item.sesi] || "";

            return (
              <Link
                key={item.id}
                href={`/ekskul/${item.id}`}
                className="border p-5 rounded-xl shadow-sm hover:shadow-md transition block bg-white flex flex-col justify-between group"
              >
                <div>
                  <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full inline-block mb-3">
                    {item.kategori}
                  </span>
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition">
                    {item.nama}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    📅 {item.hari} {jamSesiText && `(${jamSesiText})`}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t flex justify-between items-center text-sm">
                  <span className="text-gray-500 text-xs">
                    Pembina: {item.pembina}
                  </span>
                  {isPenuh ? (
                    <span className="text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded text-xs">
                      Penuh
                    </span>
                  ) : (
                    <span className="text-blue-600 font-semibold text-xs">
                      Sisa {sisaTempat} dari {item.kuota}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
