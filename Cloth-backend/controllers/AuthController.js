import bcrypt from 'bcrypt';
import jsonWebToken from 'jsonwebtoken';
import chalk from 'chalk';
import User from '../models/User.js';

// Секретный ключ для JWT
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

// Регистрация
export const register = async (req, res) => {
    try {
        const { name, surname, login, password } = req.body;

        // Проверяем, занят ли логин
        const existingUser = await User.findOne({ login });
        if (existingUser) {
            return res.status(403).json({ message: 'Логин занят' });
        }

        // Хэшируем пароль
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Создаём пользователя
        const user = new User({ name, surname, login, passwordHash });
        await user.save();

        // Генерируем токен
        const token = jsonWebToken.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '30d' });

        // Убираем пароль из ответа
        const { passwordHash: _, ...userData } = user._doc;
        res.json({ ...userData, token });

        console.log(`${chalk.green('POST')} /auth/register success`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Не удалось зарегистрироваться' });
    }
};

// Логин
export const login = async (req, res) => {
    try {
        const { login, password } = req.body;

        // Проверяем существование пользователя
        const user = await User.findOne({ login });
        if (!user) {
            return res.status(403).json({ message: 'Неверный логин или пароль' });
        }

        // Проверяем пароль
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) {
            return res.status(403).json({ message: 'Неверный логин или пароль' });
        }

        // Генерируем токен
        const token = jsonWebToken.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '30d' });

        const { passwordHash: _, ...userData } = user._doc;
        res.json({ ...userData, token });

        console.log(`${chalk.green('POST')} /auth/login success`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Не удалось авторизоваться' });
    }
};

// Получение текущего пользователя
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        const { passwordHash: _, ...userData } = user._doc;
        res.json({ ...userData });

        console.log(`${chalk.green('GET')} /auth/me success`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Проверка логина
export const checkLogin = async (req, res) => {
    try {
        const user = await User.findOne({ login: req.body.login });
        if (user) {
            return res.status(403).json({ message: 'Логин занят' });
        }
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка проверки логина' });
    }
};
