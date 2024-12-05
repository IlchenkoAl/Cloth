import express from 'express';
import cors from 'cors';
import chalk from 'chalk';
import multer from 'multer';
import mongoose from 'mongoose';

import { ActionsOnCardController, AuthController, CardController } from './controllers/index.js';
import { checkAuth } from './utils/index.js';

// Подключение к локальной базе данных MongoDB
mongoose
    .connect('mongodb://127.0.0.1:27017/magazin', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Подключение к БД:', chalk.green('ОК'));
    })
    .catch(error => console.log('Подключение к БД:', chalk.red('ERR::'), error));

const app = express();

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
    destination: (_, __, callback) => {
        callback(null, 'uploads');
    },
    filename: (_, file, callBack) => {
        callBack(null, file.originalname);
    },
});
const upload = multer({ storage });

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// Порт для сервера
const PORT = process.env.PORT || 5556;

// Роуты для загрузки файлов
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
    console.log(`${chalk.green('POST')} ${chalk.underline.italic.gray('/upload')} success: ${chalk.green('true')}`);
});

// Роуты для карточек
app.post('/card/add', checkAuth, CardController.add);
app.get('/card/all', CardController.all);
app.get('/card/search/:searchString', CardController.search);

// Роуты для действий с карточками
app.post('/user/addCart', checkAuth, ActionsOnCardController.addCart);
app.post('/user/removeCart', checkAuth, ActionsOnCardController.removeCart);
app.post('/user/addBookmarks', checkAuth, ActionsOnCardController.addBookmarks);
app.post('/user/removeBookmarks', checkAuth, ActionsOnCardController.removeBookmarks);
app.get('/user/allCart', checkAuth, CardController.cartAll);
app.get('/user/allBookmarks', checkAuth, CardController.bookmarksAll);

// Роуты для аутентификации
app.post('/auth/register', AuthController.register);
app.post('/auth/login', AuthController.login);
app.get('/auth/me', checkAuth, AuthController.getMe);
app.post('/auth/checkLogin', AuthController.checkLogin);

// Запуск сервера
app.listen(PORT, err => {
    if (err) {
        console.log('Ошибка при запуске сервера:', err);
        return;
    }
    console.log('Сервер запущен на порту:', chalk.green(PORT));
});
