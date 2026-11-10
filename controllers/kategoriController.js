const Kategori = require('../models/kategoriModel');
const { errorHttp } = require('../middlewares/errorHandler');

// [POST] Menambahkan kategori RentalMobil
exports.create = async (req, res, next) => {
  try {
    const kategori = await Kategori.create(req.body);

    res.status(201).json({
      status: 'success',
      message: 'Kategori RentalMobil berhasil ditambahkan',
      data: kategori
    });
  } catch (err) {
    next(err);
  }
};

// [GET] Menampilkan semua kategori RentalMobil
exports.getAll = async (req, res, next) => {
  try {
    const data = await Kategori.find();

    res.json({
      status: 'success',
      total: data.length,
      data
    });
  } catch (err) {
    next(err);
  }
};

// [GET] Menampilkan kategori berdasarkan ID
exports.getById = async (req, res, next) => {
  try {
    const data = await Kategori.findById(req.params.id);

    if (!data) {
      return next(errorHttp(
        404,
        `Kategori RentalMobil dengan id ${req.params.id} tidak ditemukan`
      ));
    }

    res.json({
      status: 'success',
      data
    });
  } catch (err) {
    next(err);
  }
};

// [PUT] Mengubah kategori RentalMobil
exports.update = async (req, res, next) => {
  try {
    const data = await Kategori.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    );

    if (!data) {
      return next(errorHttp(
        404,
        `Kategori RentalMobil dengan id ${req.params.id} tidak ditemukan`
      ));
    }

    res.json({
      status: 'success',
      message: 'Kategori RentalMobil berhasil diubah',
      data
    });
  } catch (err) {
    next(err);
  }
};

// [DELETE] Menghapus kategori RentalMobil
exports.remove = async (req, res, next) => {
  try {
    const data = await Kategori.findByIdAndDelete(req.params.id);

    if (!data) {
      return next(errorHttp(
        404,
        `Kategori RentalMobil dengan id ${req.params.id} tidak ditemukan`
      ));
    }

    res.json({
      status: 'success',
      message: 'Kategori RentalMobil berhasil dihapus',
      data: null
    });
  } catch (err) {
    next(err);
  }
};