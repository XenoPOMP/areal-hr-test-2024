const multer = require('multer');
const path = require('path');

// Настройка хранилища для multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Указываем папку для сохранения сканов
    cb(null, path.join(__dirname, '../../../files'));
  },
  filename: (req, file, cb) => {
    // Генерация уникального имени файла
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Валидация типов файлов (например, только PDF, JPEG, PNG)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Недопустимый тип файла. Допустимы только PDF, JPEG и PNG.'));
  }
};

// Экспорт функции загрузки
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // Ограничение на размер файла: 50MB
});

module.exports = upload;
