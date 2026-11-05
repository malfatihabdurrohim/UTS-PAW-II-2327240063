// MIDDLEWARE: melindungi rute POST, PUT, DELETE dengan header x-api-key
const cekApiKey = (req, res, next) => {
  const apiKey = req.header('x-api-key');
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({
      sukses: false,
      pesan: 'Akses ditolak: API key tidak ada atau salah',
    });
  }
  next();
};

module.exports = cekApiKey;
