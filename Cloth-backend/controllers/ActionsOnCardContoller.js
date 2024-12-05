import chalk from "chalk";
import { UserModel } from "../models/index.js";

export const addCart = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId).exec();

        user.cart.push(req.body.cardId);
        await user.save();
        res.json(user);
        console.log(`${chalk.green('POST')} ${chalk.underline.gray('/user/addCart')} success`);
    } catch (error) {
        res.status(500).json({ message: 'Не удалось добавить товар в корзину.' });
        console.error(`${chalk.red('POST')} ${chalk.underline.gray('/user/addCart')} error: ${error.message}`);
    }
};

export const removeCart = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId).exec();

        const index = user.cart.indexOf(req.body.cardId);
        if (index > -1) {
            user.cart.splice(index, 1);
        }

        await user.save();
        res.json(user);
        console.log(`${chalk.green('POST')} ${chalk.underline.gray('/user/removeCart')} success`);
    } catch (error) {
        res.status(500).json({ message: 'Не удалось удалить товар из корзины.' });
        console.error(`${chalk.red('POST')} ${chalk.underline.gray('/user/removeCart')} error: ${error.message}`);
    }
};

export const addBookmarks = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId).exec();

        user.bookmarks.push(req.body.cardId);
        await user.save();
        res.json(user);
        console.log(`${chalk.green('POST')} ${chalk.underline.gray('/user/addBookmarks')} success`);
    } catch (error) {
        res.status(500).json({ message: 'Не удалось добавить товар в закладки.' });
        console.error(`${chalk.red('POST')} ${chalk.underline.gray('/user/addBookmarks')} error: ${error.message}`);
    }
};

export const removeBookmarks = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId).exec();

        const index = user.bookmarks.indexOf(req.body.cardId);
        if (index > -1) {
            user.bookmarks.splice(index, 1);
        }

        await user.save();
        res.json(user);
        console.log(`${chalk.green('POST')} ${chalk.underline.gray('/user/removeBookmarks')} success`);
    } catch (error) {
        res.status(500).json({ message: 'Не удалось удалить товар из закладок.' });
        console.error(`${chalk.red('POST')} ${chalk.underline.gray('/user/removeBookmarks')} error: ${error.message}`);
    }
};
