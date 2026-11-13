import { ekskul, pendaftar, JAM_SESI } from "../../../data/ekskul";
import Link from "next/link";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// Simulasi ambil data anggota dengan delay 1,5 detik
async function ambilAnggota(ekskulId: number) {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return pendaftar.filter((p) => p.ekskulId === ekskulId);
}

// Server Action untuk memproses pendaftaran dengan penanganan error yang rapi
async function daftarEkskulAction(formData: FormData) {
  "use server";

  const ekskulId = Number(formData.get("ekskulId"));
  const nama = String(formData.get("nama") || "").trim();
  const kelas = String(formData.get("kelas") || "").trim();

  const cookieStore = await cookies();
  cookieStore.set("namaUser", nama);
  cookieStore.set("kelasUser", kelas);

  const targetEkskul = ekskul.find((e) => e.id === ekskulId);
  if (!targetEkskul) {
    redirect(`/ekskul/${ekskulId}?error=ID ekskul tidak valid`);
  }

  // Validasi kolom minimal 3 karakter
  let errorMsg = "";
  if (nama.length < 3) errorMsg = "Nama minimal 3 huruf.";
  else if (kelas.length < 3) errorMsg = "Kelas minimal 3 karakter.";

  if (errorMsg) {
    redirect(`/ekskul/${ekskulId}?error=${encodeURIComponent(errorMsg)}`);
  }

  // Validasi Kuota Penuh
  const anggotaEkskul = pendaftar.filter((p) => p.ekskulId === ekskulId);
  if (anggotaEkskul.length >= targetEkskul.kuota) {
    redirect(
      `/ekskul/${ekskulId}?error=${encodeURIComponent(`Kuota ${targetEkskul.nama} sudah penuh (${targetEkskul.kuota} orang).`)}`,
    );
  }

  // Validasi Sudah Terdaftar
  const sudahAda = anggotaEkskul.some(
    (p) =>
      p.nama.toLowerCase() === nama.toLowerCase() &&
      p.kelas.toLowerCase() === kelas.toLowerCase(),
  );
  if (sudahAda) {
    redirect(
      `/ekskul/${ekskulId}?error=${encodeURIComponent(`${nama} (${kelas}) sudah terdaftar di ekskul ini.`)}`,
    );
  }

  // Validasi Bentrok Jadwal
  const ekskulDiikutiUser = pendaftar.filter(
    (p) => p.nama.toLowerCase() === nama.toLowerCase(),
  );
  for (const p of ekskulDiikutiUser) {
    const itemEkskulLain = ekskul.find((e) => e.id === p.ekskulId);
    if (
      itemEkskulLain &&
      itemEkskulLain.hari === targetEkskul.hari &&
      itemEkskulLain.sesi === targetEkskul.sesi
    ) {
      redirect(
        `/ekskul/${ekskulId}?error=${encodeURIComponent(`Jadwal bentrok dengan ${itemEkskulLain.nama} (${targetEkskul.hari}, sesi ${targetEkskul.sesi}).`)}`,
      );
    }
  }

  // Berhasil Mendaftar
  const nomorBaru = pendaftar.length + 1;
  pendaftar.push({
    nomor: nomorBaru,
    ekskulId,
    nama,
    kelas,
  });

  revalidatePath(`/ekskul/${ekskulId}`);
  revalidatePath(`/ekskul`);
  redirect(
    `/ekskul/${ekskulId}?success=${encodeURIComponent(`Pendaftaran #${nomorBaru} berhasil: ${targetEkskul.nama}, ${targetEkskul.hari}, sesi ${targetEkskul.sesi} (${JAM_SESI[targetEkskul.sesi] || ""}).`)}`,
  );
}

// Komponen Bagian Anggota
async function DaftarAnggotaSection({
  ekskulId,
  kuota,
}: {
  ekskulId: number;
  kuota: number;
}) {
  const cookieStore = await cookies();
  const namaUserCookie = cookieStore.get("namaUser")?.value || "";

  const anggotaEkskul = await ambilAnggota(ekskulId);
  const jumlahPendaftar = anggotaEkskul.length;

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-gray-800">Anggota Terdaftar</h2>
        <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          {jumlahPendaftar} dari {kuota} tempat terisi
        </span>
      </div>

      {anggotaEkskul.length === 0 ? (
        <p className="text-sm text-gray-500 italic bg-gray-50 p-4 rounded-lg border text-center">
          Belum ada anggota.
        </p>
      ) : (
        <ul className="divide-y border rounded-xl overflow-hidden bg-white text-sm shadow-sm">
          {anggotaEkskul.map((p, idx) => {
            const isUserKamu =
              p.nama.toLowerCase() === namaUserCookie.toLowerCase();
            return (
              <li
                key={idx}
                className="p-3.5 flex justify-between items-center hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-800">{p.nama}</span>
                  {isUserKamu && (
                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      Kamu
                    </span>
                  )}
                </div>
                <span className="text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md text-xs font-medium">
                  {p.kelas}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default async function DetailEkskulPage({
  params,
  searchParams,
}: Props) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  const item = ekskul.find((e) => e.id === Number(resolvedParams.id));

  if (!item) {
    notFound();
  }

  const cookieStore = await cookies();
  const defaultNama = cookieStore.get("namaUser")?.value || "";
  const defaultKelas = cookieStore.get("kelasUser")?.value || "";
  const jamSesiText = JAM_SESI[item.sesi] || "";

  const errorMessage =
    typeof resolvedSearch.error === "string" ? resolvedSearch.error : null;
  const successMessage =
    typeof resolvedSearch.success === "string" ? resolvedSearch.success : null;

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 font-sans text-gray-800">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-sm border space-y-6">
        <nav className="text-sm">
          <Link
            href="/ekskul"
            className="text-blue-600 hover:underline font-semibold"
          >
            &larr; Kembali ke Daftar Ekskul
          </Link>
        </nav>

        <div>
          <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-600 rounded-full inline-block mb-2">
            {item.kategori}
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900">{item.nama}</h1>
        </div>

        <div className="bg-gray-50 p-5 rounded-xl border space-y-2">
          <p className="text-sm flex justify-between">
            <strong className="text-gray-600">Hari & Sesi:</strong>{" "}
            <span>
              {item.hari} {jamSesiText && `(${jamSesiText})`}
            </span>
          </p>
          <p className="text-sm flex justify-between">
            <strong className="text-gray-600">Pembina:</strong>{" "}
            <span>{item.pembina}</span>
          </p>
        </div>

        {/* Notifikasi Pesan Sukses / Error */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
            ⚠️ {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">
            ✅ {successMessage}
          </div>
        )}

        {/* Formulir Pendaftaran */}
        <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
          <h2 className="text-md font-bold text-gray-800 mb-3">
            Daftar Ekskul Ini
          </h2>
          <form action={daftarEkskulAction} className="space-y-4">
            <input type="hidden" name="ekskulId" value={item.id} />
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                Nama:
              </label>
              <input
                type="text"
                name="nama"
                defaultValue={defaultNama}
                required
                className="w-full border p-2.5 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Masukkan nama lengkap"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                Kelas:
              </label>
              <input
                type="text"
                name="kelas"
                defaultValue={defaultKelas}
                required
                className="w-full border p-2.5 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Contoh: XI RPL"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition text-sm shadow"
            >
              Daftar Sekarang
            </button>
          </form>
        </div>

        {/* Bagian Anggota dengan Suspense */}
        <Suspense
          fallback={
            <div className="py-8 text-center bg-gray-50 rounded-xl border border-dashed">
              <p className="text-sm font-medium text-blue-600 animate-pulse">
                Memuat anggota...
              </p>
            </div>
          }
        >
          <DaftarAnggotaSection ekskulId={item.id} kuota={item.kuota} />
        </Suspense>
      </div>
    </main>
  );
}
