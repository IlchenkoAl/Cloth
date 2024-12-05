import mongoose from 'mongoose';
import Card from './models/Card.js';
import User from './models/User.js';
import bcrypt from 'bcrypt';

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
        // Подключение к базе данных
        await mongoose.connect('mongodb://localhost:27017/your_database_name', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('База данных подключена.');

        // Очистка коллекций
        await Card.deleteMany({});
        await User.deleteMany({});
        console.log('Все данные удалены.');

        // Добавление фикстурных данных
        await Card.insertMany(fixtureCards);
        console.log('Фикстурные данные для Cards добавлены.');

        const hashedUsers = await Promise.all(
            fixtureUsers.map(async (user) => ({
                ...user,
                passwordHash: await bcrypt.hash(user.password, 10),
                password: undefined, // Удаляем оригинальный пароль
            }))
        );

        await User.insertMany(hashedUsers);
        console.log('Фикстурные данные для Users добавлены.');

        console.log('База данных успешно сброшена и заполнена фикстурными данными.');
    } catch (error) {
        console.error('Ошибка при сбросе базы данных:', error);
    } finally {
        await mongoose.connection.close();
    }
}

resetDatabase().then();
