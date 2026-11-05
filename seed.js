require('dotenv').config();
const mongoose = require('mongoose');
const Kategori = require('./models/kategoriModel');
const Buku = require('./models/bukuModel');

const dataKategori = [
  { kode: 'KOM', namaKategori: 'Komputer dan Teknologi', deskripsi: 'Buku-buku seputar pemrograman dan IT' },
  { kode: 'NOV', namaKategori: 'Novel dan Sastra', deskripsi: 'Karya fiksi, novel, dan cerpen' },
  { kode: 'SEJ', namaKategori: 'Sejarah dan Budaya', deskripsi: 'Catatan sejarah dunia dan nusantara' },
  { kode: 'SAI', namaKategori: 'Sains dan Matematika', deskripsi: 'Buku ilmu pengetahuan alam dan eksakta' }
];

const daftarBuku = [
  { judul: 'Belajar Express.js dan MongoDB', penulis: 'Alfatih', tahun: 2024, kota: 'Palembang', penerbit: 'Informatika Press' },
  { judul: 'Mastering JavaScript Modern', penulis: 'Budi Santoso', tahun: 2023, kota: 'Jakarta', penerbit: 'Elex Media' },
  { judul: 'Laskar Pelangi', penulis: 'Andrea Hirata', tahun: 2005, kota: 'Yogyakarta', penerbit: 'Bentang Pustaka' },
  { judul: 'Bumi Manusia', penulis: 'Pramoedya Ananta Toer', tahun: 1980, kota: 'Jakarta', penerbit: 'Hasta Mitra' },
  { judul: 'Sejarah Kemerdekaan 1945', penulis: 'Mohammad Hatta', tahun: 1970, kota: 'Jakarta', penerbit: 'Balai Pustaka' },
  { judul: 'Kalkulus Dasar untuk Sains', penulis: 'Prof. Hendra', tahun: 2021, kota: 'Bandung', penerbit: 'ITB Press' },
  { judul: 'Fisika Kuantum Populer', penulis: 'Dr. Surya', tahun: 2022, kota: 'Surabaya', penerbit: 'Airlangga Press' },
  { judul: 'Arsitektur RESTful API', penulis: 'Nur Rachmat', tahun: 2024, kota: 'Palembang', penerbit: 'MDP Press' },
  { judul: 'Hujan di Bulan Juni', penulis: 'Sapardi Djoko Damono', tahun: 1994, kota: 'Jakarta', penerbit: 'Gramedia' },
  { judul: 'Algoritma Pemrograman C++', penulis: 'Rinaldi Munir', tahun: 2018, kota: 'Bandung', penerbit: 'Informatika' }
];

async function main() {
  const dbUri = process.env.DB_URI;
  if (!dbUri) {
    console.error('DB_URI tidak ditemukan di .env! Silakan isi DB_URI terlebih dahulu.');
    process.exit(1);
  }

  await mongoose.connect(dbUri);
  console.log('Terhubung ke MongoDB untuk proses seeding...');

  // Hapus data lama
  await Buku.deleteMany({});
  await Kategori.deleteMany({});

  // Masukkan Kategori
  const kategoriSaved = await Kategori.insertMany(dataKategori);
  console.log(`Berhasil menambahkan ${kategoriSaved.length} kategori.`);

  // Generate data buku dengan Embedding (penerbit) dan Referencing (kategoriId)
  const listBukuSiap = daftarBuku.map((b, i) => ({
    judul: b.judul,
    penulis: b.penulis,
    tahun: b.tahun,
    penerbit: {
      nama: b.penerbit,
      kota: b.kota
    },
    kategoriId: kategoriSaved[i % kategoriSaved.length]._id
  }));

  await Buku.insertMany(listBukuSiap);
  console.log(`Berhasil menambahkan ${listBukuSiap.length} data buku.`);

  console.log('Seeding selesai!');
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Terjadi error saat seed:', err.message);
  process.exit(1);
});
