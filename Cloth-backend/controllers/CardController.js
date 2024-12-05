import chalk from "chalk";
import { CardModel, UserModel } from "../models/index.js";

export const add = async (req, res) => {
    try {
        const imgUrl = `/uploads/${req.body.imageName}`;
        const doc = new CardModel({
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            imgUrl,
        });

        const card = await doc.save();
        res.json(card);
        console.log(`${chalk.green('POST')} ${chalk.underline.gray('/card/add')} success`);
    } catch (error) {
        res.status(500).json({ message: 'Не удалось создать карточку товара.' });
        console.error(`${chalk.red('POST')} ${chalk.underline.gray('/card/add')} error: ${error.message}`);
    }
};

export const all = async (req, res) => {
    try {
        const cards = await CardModel.find().exec();
        console.log('Данные из базы:', cards); // Отладка
        res.json(cards);
    } catch (error) {
        console.error('Ошибка получения карточек:', error);
        res.status(500).json({
            message: 'Не удалось получить карточки товаров.',
        });
    }
};


export const search = async (req, res) => {
    try {
        await CardModel.createIndexes({ title: 'text' });
        const searchData = await CardModel.find({ $text: { $search: req.params.searchString } });
        res.json(searchData);
        console.log(`${chalk.green('GET')} ${chalk.underline.gray('/card/search')} success`);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка поиска карточек.' });
        console.error(`${chalk.red('GET')} ${chalk.underline.gray('/card/search')} error: ${error.message}`);
    }
};

export const cartAll = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId).exec();
        const cardItems = await Promise.all(
            user.cart.map(cardId => CardModel.findById(cardId))
        );
        res.json(cardItems);
        console.log(`${chalk.green('GET')} ${chalk.underline.gray('/user/allCart')} success`);
    } catch (error) {
        res.status(500).json({ message: 'Не удалось вернуть товары из корзины.' });
        console.error(`${chalk.red('GET')} ${chalk.underline.gray('/user/allCart')} error: ${error.message}`);
    }
};

export const bookmarksAll = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId).exec();
        const bookmarksItems = await Promise.all(
            user.bookmarks.map(cardId => CardModel.findById(cardId))
        );
        res.json(bookmarksItems);
        console.log(`${chalk.green('GET')} ${chalk.underline.gray('/user/allBookmarks')} success`);
    } catch (error) {
        res.status(500).json({ message: 'Не удалось вернуть закладки.' });
        console.error(`${chalk.red('GET')} ${chalk.underline.gray('/user/allBookmarks')} error: ${error.message}`);
    }
};
