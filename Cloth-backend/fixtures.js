import mongoose from 'mongoose';
import Card from './models/Card.js';
import User from './models/User.js';
import bcrypt from 'bcrypt';

// Фикстурные данные
const fixtureCards = [
    {
        title: 'Nike Air Max 90',
        price: 12000,
        description: 'Кроссовки Nike Air Max 90 – это стиль и комфорт для ежедневного ношения.',
        imgUrl: '/uploads/nike-air-max-90.jpg',
    },
    {
        title: 'Adidas Ultraboost',
        price: 15000,
        description: 'Кроссовки Adidas Ultraboost с революционной технологией амортизации.',
        imgUrl: '/uploads/adidas-ultraboost.jpg',
    },
    {
        title: 'Puma RS-X',
        price: 13000,
        description: 'Кроссовки Puma RS-X – это свежий взгляд на ретро стиль.',
        imgUrl: '/uploads/puma-rsx.jpg',
    },
    {
        title: 'Reebok Classic Leather',
        price: 10000,
        description: 'Reebok Classic Leather – это сочетание элегантного стиля и непревзойденного комфорта.',
        imgUrl: '/uploads/reebok-classic-leather.jpg',
    },
    {
        title: 'New Balance 574',
        price: 11000,
        description: 'New Balance 574 – это универсальные кроссовки для повседневного использования.',
        imgUrl: '/uploads/new-balance-574.jpg',
    },
    {
        title: 'Asics Gel-Kayano',
        price: 14000,
        description: 'Asics Gel-Kayano – это высококлассные беговые кроссовки с передовыми технологиями.',
        imgUrl: '/uploads/asics-gel-kayano.jpg',
    },
    {
        title: 'Jordan 1 High OG',
        price: 17000,
        description: 'Jordan 1 High OG – культовая модель для любителей баскетбола и уличного стиля.',
        imgUrl: '/uploads/jordan-1-high-og.jpg',
    },
    {
        title: 'Vans Old Skool',
        price: 9000,
        description: 'Vans Old Skool – классика скейтборда с иконой полоски Vans.',
        imgUrl: '/uploads/vans-old-skool.jpg',
    },
];

const fixtureUsers = [
    {
        name: 'Иван',
        surname: 'Иванов',
        login: 'ivanov',
        password: 'password123',
        cart: [],
        bookmarks: [],
        purchases: [],
    },
    {
        name: 'Анна',
        surname: 'Смирнова',
        login: 'anna123',
        password: 'mypassword',
        cart: [],
        bookmarks: [],
        purchases: [],
    },
];

async function resetDatabase() {
    try {
        // Подключение к MongoDB
        await mongoose.connect('mongodb://127.0.0.1:27017/magazin', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Подключение к базе данных успешно установлено.');

        // Очистка коллекций
        await Card.deleteMany({});
        console.log('Коллекция Cards очищена.');

        await User.deleteMany({});
        console.log('Коллекция Users очищена.');

        // Добавление товаров
        await Card.insertMany(fixtureCards);
        // Добавление пользователей
        const hashedUsers = await Promise.all(
            fixtureUsers.map(async (user) => ({
                ...user,
                passwordHash: await bcrypt.hash(user.password, 10),
                password: undefined, // Удаляем оригинальный пароль
            }))
        );

        await User.insertMany(hashedUsers);

        console.log('База данных успешно сброшена и заполнена фикстурными данными.');
    } catch (error) {
        console.error('Ошибка сброса базы данных:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Подключение к базе данных закрыто.');
    }
}

// Запуск сброса базы данных
resetDatabase().then(() => console.log('Процесс завершён.'));
