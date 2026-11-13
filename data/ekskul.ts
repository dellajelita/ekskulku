export type Kategori = "0Olahraga" | "Seni" | "Akademik" | "Teknologi";

export type Ekskul = {
  id: number;
  nama: string;
  kategori: Kategori;
  hari: string;
  sesi: number; // 1 atau 2
  kuota: number;
  pembina: string;
};

export type Pendaftar = {
  nomor: number;
  ekskulId: number;
  nama: string;
  kelas: string;
};

export const DAFTAR_KATEGORI: Kategori[] = ["0Olahraga", "Seni", "Akademik", "Teknologi"];
export const DAFTAR_HARI = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

export const JAM_SESI: Record<number, string> = {
  1: "15.00-16.30",
  2: "16.30-18.00",
};

export const ekskul: Ekskul[] = [
  { id: 1, nama: "Basket", kategori: "0Olahraga", hari: "Senin", sesi: 1, kuota: 3, pembina: "Pak Andi" },
  { id: 2, nama: "Futsal", kategori: "0Olahraga", hari: "Rabu", sesi: 1, kuota: 20, pembina: "Pak Reza" },
  { id: 3, nama: "Paduan Suara", kategori: "Seni", hari: "Senin", sesi: 1, kuota: 15, pembina: "Bu Wulan" },
  { id: 4, nama: "Robotik", kategori: "Teknologi", hari: "Selasa", sesi: 2, kuota: 12, pembina: "Pak Dodi" },
  { id: 5, nama: "English Club", kategori: "Akademik", hari: "Kamis", sesi: 1, kuota: 20, pembina: "Bu Rina" },
  { id: 6, nama: "Desain Grafis", kategori: "Teknologi", hari: "Jumat", sesi: 1, kuota: 18, pembina: "Bu Sari" },
];

// Disimpan di memori server: hilang setiap kali server dimatikan.[cite: 6]
export const pendaftar: Pendaftar[] = [
  { nomor: 1, ekskulId: 1, nama: "Rudi", kelas: "XI TKJ 1" },
  { nomor: 2, ekskulId: 1, nama: "Dina", kelas: "XI RPL 2" },
  { nomor: 3, ekskulId: 4, nama: "Bayu", kelas: "XII RPL 1" },
  { nomor: 4, ekskulId: 6, nama: "Sari", kelas: "X DKV 1" },
];

let nomorTerakhir = pendaftar.length;

export function tambahPendaftar(data: Omit<Pendaftar, "nomor">) {
  nomorTerakhir += 1;
  pendaftar.push({ nomor: nomorTerakhir, ...data });
  return nomorTerakhir;
}