import Link from "next/link";
import {
  ekskul,
  pendaftar,
  DAFTAR_KATEGORI,
  DAFTAR_HARI,
  JAM_SESI,
} from "../../data/ekskul";

type SearchParams = {
  kategori?: string;
  hari?: string;
};

export const metadata = {
  title: "Daftar Ekskul",
};

export default async function DaftarEkskulPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedParams = await searchParams;
  const selectedKategori = resolvedParams.kategori || "Semua";
  const selectedHari = resolvedParams.hari || "Semua";

  // Filter data berdasarkan kategori dan hari secara bersamaan di server
  const filteredEkskul = ekskul.filter((item) => {
    const matchKategori =
      selectedKategori === "Semua" || item.kategori === selectedKategori;
    const matchHari = selectedHari === "Semua" || item.hari === selectedHari;
    return matchKategori && matchHari;
  });

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 font-sans text-gray-800">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-sm border">
        {/* Navigasi Menu Atas */}
        <nav className="mb-6 flex gap-6 border-b pb-4 text-sm font-semibold">
          <Link
            href="/"
            className="text-gray-500 hover:text-blue-600 transition"
          >
            Beranda
          </Link>
          <Link
            href="/ekskul"
            className="text-blue-600 border-b-2 border-blue-600 pb-4 -mb-4"
          >
            Daftar Ekskul
          </Link>
          <Link
            href="/saya"
            className="text-gray-500 hover:text-blue-600 transition"
          >
            Ekskul Saya
          </Link>
        </nav>

        <h1 className="text-2xl font-bold mb-6 text-gray-900">Daftar Ekskul</h1>

        {/* Form Filter / Saringan lewat URL (GET) */}
        <form
          method="GET"
          className="flex flex-wrap gap-4 mb-6 bg-gray-50 p-4 rounded-lg border items-end"
        >
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
              Kategori:
            </label>
            <select
              name="kategori"
              defaultValue={selectedKategori}
              className="border p-2 rounded bg-white text-sm w-44"
            >
              <option value="Semua">Semua kategori</option>
              {DAFTAR_KATEGORI.map((kat) => (
                <option key={kat} value={kat}>
                  {kat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
              Hari:
            </label>
            <select
              name="hari"
              defaultValue={selectedHari}
              className="border p-2 rounded bg-white text-sm w-44"
            >
              <option value="Semua">Semua hari</option>
              {DAFTAR_HARI.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition"
            >
              Saring
            </button>
          </div>
        </form>

        <p className="mb-4 text-sm text-gray-600 font-medium">
          {filteredEkskul.length} ekskul ditemukan.
        </p>

        {/* Daftar Kartu Ekskul */}
        {filteredEkskul.length === 0 ? (
          <p className="text-gray-500 italic py-8 text-center">
            Tidak ada ekskul yang cocok.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEkskul.map((item) => {
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
                    <h2 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition">
                      {item.nama}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Hari: {item.hari} {jamSesiText && `(${jamSesiText})`}
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
                        Sisa {sisaTempat} dari {item.kuota} tempat
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
