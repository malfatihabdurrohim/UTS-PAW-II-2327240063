const RentalMobil = require('../models/RentalMobilModel');
const Kategori = require('../models/kategoriModel');
const { errorHttp } = require('../middlewares/errorHandler');

const LIMIT_DEFAULT = 10;
const LIMIT_MAKS = 50;

const FIELD_SORT = [
  'rentalmobil',
  'alamat',
  'waktusewa',
  'createdAt'
];

const FIELD_BOLEH_DIPILIH = [
  'rentalmobil',
  'alamat',
  'waktusewa',
  'rental',
  'kategoriId',
  'createdAt',
  'updatedAt'
];

function angkaAman(nilai, bawaan, min, maks) {
  const n = parseInt(nilai, 10);
  if (Number.isNaN(n)) return bawaan;
  return Math.min(Math.max(n, min), maks);
}

// [POST] Tambah RentalMobil
exports.create = async (req, res, next) => {
  try {
    const { kategoriId } = req.body;

    if (kategoriId) {
      const katAda = await Kategori.findById(kategoriId);
      if (!katAda) {
        return next(errorHttp(400, 'Kategori tidak ditemukan'));
      }
    }

    const data = await RentalMobil.create(req.body);
    await data.populate('kategoriId');

    res.status(201).json({
      status: 'success',
      message: 'RentalMobil berhasil ditambahkan',
      data
    });
  } catch (err) {
    next(err);
  }
};

// [GET] Semua RentalMobil
exports.getAll = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.nama) {
      filter.rentalmobil = new RegExp(String(req.query.nama), 'i');
    }

    if (req.query.alamat) {
      filter.alamat = new RegExp(String(req.query.alamat), 'i');
    }

    if (req.query.waktusewa) {
      filter.waktusewa = Number(req.query.waktusewa);
    }

    if (req.query.kota) {
      filter['rental.kota'] = new RegExp(String(req.query.kota), 'i');
    }

    if (req.query.kategori) {
      const kat = await Kategori.findOne({
        kode: String(req.query.kategori).toUpperCase()
      });

      filter.kategoriId = kat ? kat._id : { $in: [] };
    }

    const page = angkaAman(req.query.page, 1, 1, Number.MAX_SAFE_INTEGER);
    const limit = angkaAman(req.query.limit, LIMIT_DEFAULT, 1, LIMIT_MAKS);

    const sortParam = String(req.query.sort || '-createdAt');
    const arah = sortParam.startsWith('-') ? -1 : 1;
    const sortField = sortParam.replace(/^-/, '');

    if (!FIELD_SORT.includes(sortField)) {
      return next(errorHttp(400, 'Field sorting tidak valid'));
    }

    let select = '';

    if (req.query.fields) {
      const fields = String(req.query.fields)
        .split(',')
        .map(f => f.trim())
        .filter(Boolean);

      if (!fields.every(f => FIELD_BOLEH_DIPILIH.includes(f))) {
        return next(errorHttp(400, 'Field projection tidak valid'));
      }

      select = fields.join(' ');
    }

    const query = RentalMobil.find(filter)
      .select(select)
      .sort({ [sortField]: arah, _id: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    if (!select || select.split(' ').includes('kategoriId')) {
      query.populate('kategoriId');
    }

    const [data, total] = await Promise.all([
      query,
      RentalMobil.countDocuments(filter)
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

// [GET] Detail RentalMobil
exports.getById = async (req, res, next) => {
  try {
    const data = await RentalMobil.findById(req.params.id)
      .populate('kategoriId');

    if (!data) {
      return next(errorHttp(404, 'RentalMobil tidak ditemukan'));
    }

    res.json({
      status: 'success',
      data
    });
  } catch (err) {
    next(err);
  }
};

// [PUT] Update RentalMobil
exports.update = async (req, res, next) => {
  try {
    const { kategoriId } = req.body;

    if (kategoriId) {
      const katAda = await Kategori.findById(kategoriId);
      if (!katAda) {
        return next(errorHttp(400, 'Kategori tidak ditemukan'));
      }
    }

    const data = await RentalMobil.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    ).populate('kategoriId');

    if (!data) {
      return next(errorHttp(404, 'RentalMobil tidak ditemukan'));
    }

    res.json({
      status: 'success',
      message: 'RentalMobil berhasil diubah',
      data
    });
  } catch (err) {
    next(err);
  }
};

// [DELETE] Hapus RentalMobil
exports.remove = async (req, res, next) => {
  try {
    const data = await RentalMobil.findByIdAndDelete(req.params.id);

    if (!data) {
      return next(errorHttp(404, 'RentalMobil tidak ditemukan'));
    }

    res.json({
      status: 'success',
      message: 'RentalMobil berhasil dihapus',
      data: null
    });
  } catch (err) {
    next(err);
  }
};