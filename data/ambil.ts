import { ekskul, pendaftar, type Pendaftar } from "./ekskul";

// Pura-pura mengambil data dari database yang agak lambat.
function jeda(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function ambilSemuaEkskul() {
  await jeda(1000);
  return ekskul;
}

export async function ambilEkskul(id: number) {
  await jeda(500);
  return ekskul.find((e) => e.id === id);
}

// Daftar anggota satu ekskul, urut nomor pendaftaran
export async function ambilAnggota(ekskulId: number) {
  await jeda(1500);
  return pendaftar.filter((p) => p.ekskulId === ekskulId).sort((a, b) => a.nomor - b.nomor);
}

let nomorTerakhir = pendaftar.length;

export function tambahPendaftar(data: Omit<Pendaftar, "nomor">) {
  nomorTerakhir += 1;
  pendaftar.push({ nomor: nomorTerakhir, ...data });
  return nomorTerakhir;
}