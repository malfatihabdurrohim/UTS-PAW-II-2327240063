const Kategori = require('../models/kategoriModel');
const { errorHttp } = require('../middlewares/errorHandler');

exports.create = async (req, res, next) => {
  try {
    const kategori = await Kategori.create(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Kategori berhasil ditambahkan',
      data: kategori
    });
  } catch (err) {
    next(err);
  }
};

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

exports.getById = async (req, res, next) => {
  try {
    const data = await Kategori.findById(req.params.id);
    if (!data) return next(errorHttp(404, `Kategori dengan id ${req.params.id} tidak ditemukan`));
    res.json({
      status: 'success',
      data
    });
  } catch (err) {
    next(err);
  }
};
