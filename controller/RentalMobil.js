// CONTROLLER: menangani request, validasi, dan response 
const Buku = require('../models/bukuModel'); 
const Kategori = require('../models/kategoriModel');
const { errorHttp } = require('../middlewares/errorHandler'); 

const LIMIT_DEFAULT = 10; 
const LIMIT_MAKS = 50; 
const FIELD_SORT = ['judul', 'penulis', 'tahun', 'createdAt']; 
const FIELD_BOLEH_DIPILIH = ['judul', 'penulis', 'tahun', 'penerbit', 'kategoriId', 'createdAt', 'updatedAt']; 

// Mengubah bilangan dari query string menjadi bilangan bulat yang aman 
function angkaAman(nilai, bawaan, min, maks) {
  const n = parseInt(nilai, 10);
  if (Number.isNaN(n)) return bawaan;
  return Math.min(Math.max(n, min), maks);
}

// [POST] Membuat data Buku baru (Embedding penerbit + Referencing kategoriId)
exports.create = async (req, res, next) => { 
  try { 
    const { kategoriId } = req.body;
    if (kategoriId) {
      const katAda = await Kategori.findById(kategoriId);
      if (!katAda) return next(errorHttp(400, `Kategori dengan id ${kategoriId} tidak ditemukan`));
    }

    const buku = await Buku.create(req.body); 
    const populated = await buku.populate('kategoriId', 'kode namaKategori deskripsi');
    res.status(201).json({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: populated
    }); 
  } catch (err) { 
    next(err); 
  } 
}; 

// [GET] Mendapatkan semua data Buku dengan Filtering, Pagination, Sorting, dan Projection
exports.getAll = async (req, res, next) => { 
  try {
    const filter = {}; 
    
    // 1. FILTERING
    // Filter judul (case-insensitive)
    if (req.query.judul) { 
      filter.judul = new RegExp(String(req.query.judul), 'i'); 
    } 
    // Filter tahun
    if (req.query.tahun) {
      filter.tahun = parseInt(req.query.tahun, 10);
    }
    // Filter berdasarkan kota penerbit (Embedded Subdocument)
    if (req.query.kotaPenerbit) {
      filter['penerbit.kota'] = new RegExp(String(req.query.kotaPenerbit), 'i');
    }
    // Filter berdasarkan nama penerbit (Embedded Subdocument)
    if (req.query.penerbit) {
      filter['penerbit.nama'] = new RegExp(String(req.query.penerbit), 'i');
    }
    // Filter berdasarkan kategori (Referenced)
    if (req.query.kategori) {
      const kat = await Kategori.findOne({ kode: String(req.query.kategori).toUpperCase() });
      filter.kategoriId = kat ? kat._id : { $in: [] };
    }

    // 2. PAGINATION
    const page = angkaAman(req.query.page, 1, 1, Number.MAX_SAFE_INTEGER); 
    const limit = angkaAman(req.query.limit, LIMIT_DEFAULT, 1, LIMIT_MAKS); 

    // 3. SORTING: ?sort=tahun (naik) atau ?sort=-tahun (turun)
    const sortParam = String(req.query.sort || '-createdAt'); 
    const arah = sortParam.startsWith('-') ? -1 : 1; 
    const sortField = sortParam.replace(/^-/, ''); 

    if (!FIELD_SORT.includes(sortField)) { 
      return next(errorHttp(400, `Parameter sort hanya boleh salah satu dari: ${FIELD_SORT.join(', ')}`)); 
    } 

    // 4. PROJECTION: ?fields=judul,penulis,tahun
    let select = ''; 
    if (req.query.fields) { 
      const fields = String(req.query.fields).split(',').map((f) => f.trim()).filter(Boolean); 
      if (!fields.every((f) => FIELD_BOLEH_DIPILIH.includes(f))) { 
        return next(errorHttp(400, `Parameter fields hanya boleh berisi: ${FIELD_BOLEH_DIPILIH.join(', ')}`)); 
      } 
      select = fields.join(' '); 
    } 

    // Eksekusi Query MongoDB
    const query = Buku.find(filter) 
      .select(select) 
      .sort({ [sortField]: arah, _id: 1 }) 
      .skip((page - 1) * limit) 
      .limit(limit); 

    // REFERENCING: Isi data kategoriId jika dipilih atau tanpa batasan projection
    if (!select || select.split(' ').includes('kategoriId')) { 
      query.populate('kategoriId', 'kode namaKategori deskripsi'); 
    } 

    const [data, total] = await Promise.all([
      query, 
      Buku.countDocuments(filter)
    ]); 

    res.json({ 
      status: 'success',
      page, 
      limit, 
      total, 
      totalPages: Math.ceil(total / limit),
      data 
    }); 
  } catch (err) {
    next(err);
  }
}; 

// [GET] Detail Buku berdasarkan ID
exports.getById = async (req, res, next) => { 
  try {
    const data = await Buku.findById(req.params.id).populate('kategoriId', 'kode namaKategori deskripsi'); 
    if (!data) return next(errorHttp(404, `Buku dengan id ${req.params.id} tidak ditemukan`)); 
    res.json({
      status: 'success',
      data
    }); 
  } catch (err) {
    next(err);
  }
}; 

// [PUT] Update data Buku
exports.update = async (req, res, next) => { 
  try {
    const { kategoriId } = req.body;
    if (kategoriId) {
      const katAda = await Kategori.findById(kategoriId);
      if (!katAda) return next(errorHttp(400, `Kategori dengan id ${kategoriId} tidak ditemukan`));
    }

    const data = await Buku.findByIdAndUpdate( 
      req.params.id, 
      req.body, 
      { returnDocument: 'after', runValidators: true } 
    ).populate('kategoriId', 'kode namaKategori deskripsi'); 
    
    if (!data) return next(errorHttp(404, `Buku dengan id ${req.params.id} tidak ditemukan`)); 
    res.json({
      status: 'success',
      message: 'Data buku berhasil diubah',
      data
    }); 
  } catch (err) {
    next(err);
  }
}; 

// [DELETE] Hapus Buku
exports.remove = async (req, res, next) => { 
  try {
    const data = await Buku.findByIdAndDelete(req.params.id); 
    if (!data) return next(errorHttp(404, `Buku dengan id ${req.params.id} tidak ditemukan`)); 
    res.json({
      status: 'success',
      message: `Buku dengan id ${req.params.id} berhasil dihapus`,
      data: null
    }); 
  } catch (err) {
    next(err);
  }
};
