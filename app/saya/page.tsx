import Link from "next/link";
import { cookies } from "next/headers";
import { ekskul, pendaftar, JAM_SESI } from "../../data/ekskul";
import { revalidatePath } from "next/cache";

export const metadata = {
  title: "Ekskul Saya",
};

// Server Action untuk membatalkan pendaftaran ekskul
async function batalkanEkskulAction(formData: FormData) {
  "use server";

  const ekskulId = Number(formData.get("ekskulId"));
  const cookieStore = await cookies();
  const namaUser = cookieStore.get("namaUser")?.value || "";
  const kelasUser = cookieStore.get("kelasUser")?.value || "";

  if (!namaUser || !kelasUser) return;

  // Cari dan hapus pendaftaran yang cocok berdasarkan ekskulId, nama, dan kelas dari cookie
  const index = pendaftar.findIndex(
    (p) =>
      p.ekskulId === ekskulId &&
      p.nama.toLowerCase() === namaUser.toLowerCase() &&
      p.kelas.toLowerCase() === kelasUser.toLowerCase(),
  );

  if (index !== -1) {
    pendaftar.splice(index, 1);
  }

  // Revalidate path agar halaman /saya, detail ekskul, dan daftar ekskul langsung terupdate
  revalidatePath("/saya");
  revalidatePath(`/ekskul/${ekskulId}`);
  revalidatePath("/ekskul");
}

export default async function EkskulSayaPage() {
  const cookieStore = await cookies();
  const namaUser = cookieStore.get("namaUser")?.value || "";
  const kelasUser = cookieStore.get("kelasUser")?.value || "";

  // 1. Kondisi Tanpa Cookie
  if (!namaUser) {
    return (
      <main className="min-h-screen bg-gray-50 py-8 px-4 font-sans text-gray-800">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-sm border">
          <nav className="mb-6 flex gap-6 border-b pb-4 text-sm font-semibold">
            <Link
              href="/"
              className="text-gray-500 hover:text-blue-600 transition"
            >
              Beranda
            </Link>
            <Link
              href="/ekskul"
              className="text-gray-500 hover:text-blue-600 transition"
            >
              Daftar Ekskul
            </Link>
            <Link
              href="/saya"
              className="text-blue-600 border-b-2 border-blue-600 pb-4 -mb-4"
            >
              Ekskul Saya
            </Link>
          </nav>
          <h1 className="text-2xl font-bold mb-4 text-gray-900">Ekskul saya</h1>
          <p className="text-sm text-gray-600">
            Kamu belum mendaftar apa pun.{" "}
            <Link
              href="/ekskul"
              className="text-blue-600 underline font-semibold"
            >
              Daftar ekskul di sini
            </Link>
          </p>
        </div>
      </main>
    );
  }

  // Cari daftar ekskul yang diikuti oleh user di cookie
  const daftarIkut = pendaftar.filter(
    (p) =>
      p.nama.toLowerCase() === namaUser.toLowerCase() &&
      (!kelasUser || p.kelas.toLowerCase() === kelasUser.toLowerCase()),
  );

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 font-sans text-gray-800">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-sm border">
        {/* Navigasi */}
        <nav className="mb-6 flex gap-6 border-b pb-4 text-sm font-semibold">
          <Link
            href="/"
            className="text-gray-500 hover:text-blue-600 transition"
          >
            Beranda
          </Link>
          <Link
            href="/ekskul"
            className="text-gray-500 hover:text-blue-600 transition"
          >
            Daftar Ekskul
          </Link>
          <Link
            href="/saya"
            className="text-blue-600 border-b-2 border-blue-600 pb-4 -mb-4"
          >
            Ekskul Saya
          </Link>
        </nav>

        <h1 className="text-2xl font-bold mb-2 text-gray-900">Ekskul saya</h1>

        {/* Ringkasan Informasi Pengguna */}
        <p className="text-sm text-gray-600 mb-6 font-medium">
          {namaUser} · {kelasUser} · {daftarIkut.length} ekskul diikuti
        </p>

        {/* 2. Kondisi Cookie Ada tetapi Belum Ada Pendaftaran */}
        {daftarIkut.length === 0 ? (
          <p className="text-sm text-gray-500 italic bg-gray-50 p-4 rounded-lg border text-center">
            Belum ada ekskul yang diikuti.
          </p>
        ) : (
          <div className="space-y-4">
            {daftarIkut.map((p, idx) => {
              const item = ekskul.find((e) => e.id === p.ekskulId);
              if (!item) return null;
              const jamSesiText = JAM_SESI[item.sesi] || "";

              return (
                <div
                  key={idx}
                  className="border p-4 rounded-xl shadow-sm bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div>
                    <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full inline-block mb-2">
                      {item.kategori}
                    </span>
                    <h2 className="text-lg font-bold text-gray-800">
                      <Link
                        href={`/ekskul/${item.id}`}
                        className="hover:text-blue-600 transition underline"
                      >
                        {item.nama}
                      </Link>
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Hari: {item.hari}, Sesi {item.sesi}{" "}
                      {jamSesiText && `(${jamSesiText})`}
                    </p>
                  </div>

                  {/* Tombol Batalkan */}
                  <form action={batalkanEkskulAction}>
                    <input type="hidden" name="ekskulId" value={item.id} />
                    <button
                      type="submit"
                      className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-100 transition shadow-sm"
                    >
                      Batalkan
                    </button>
                  </form>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
