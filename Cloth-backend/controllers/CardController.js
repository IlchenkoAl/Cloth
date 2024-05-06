import chalk from "chalk"

import { CardModel, UserModel } from "../models/index.js"

export const add = async (req, res) => {
    try {
        const imgUrl = `/uploads/${req.body.imageName}`

        const doc = new CardModel({
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            imgUrl,
        })

        const card = await doc.save()

        res.json(card)
        console.log(`${chalk.green('POST')} ${chalk.underline.italic.gray('/card/add')} success: ${chalk.green('true')}`)
    } catch (error) {
        res.status(500).json({
            message: 'Не удалось создать карточку товара'
        })
        console.log(`${chalk.green('POST')} ${chalk.underline.italic.gray('/card/add')} success: ${chalk.red('false')}`)
    }
}

export const all = async (req, res) => {
    try {
        const card = await CardModel.find().exec()
        res.json(card)
        console.log(`${chalk.green('POST')} ${chalk.underline.italic.gray('/card/all')} success: ${chalk.green('true')}`)
    } catch (error) {
        res.status(500).json({
            message: 'Не удалось вернуть карточки товаров'
        })
        console.log(`${chalk.green('POST')} ${chalk.underline.italic.gray('/card/all')} success: ${chalk.red('false')}`)
    }
}

export const search = async (req, res) => {
    console.log(req.params.searchString)
    try {
        await CardModel.createIndexes({ title: 'text' })
        const searchData = await CardModel.find({ $text: { $search: req.params.searchString } })
        res.json(searchData)
    } catch (error) {
        res.send()
        console.log(error)
    }
}

export const cartAll = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId).exec()
        const cardItems = await Promise.all(
            user.cart.map(async cardId =>
                await CardModel.findById(cardId)
            )
        )
        res.json(cardItems)
    } catch (error) {
        res.status(500).json({
            message: 'Не удалось вернуть товары'
        })
        console.log(`${chalk.green('POST')} ${chalk.underline.italic.gray('/user/remvoeCard')} success: ${chalk.red('false')}`)
    }
}

export const bookmarksAll = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId).exec()
        const bookmarksItems = await Promise.all(
            user.bookmarks.map(async cardId =>
                await CardModel.findById(cardId)
            )
        )
        res.json(bookmarksItems)
    } catch (error) {
        res.status(500).json({
            message: 'Не удалось вернуть товары'
        })
        console.log(`${chalk.green('POST')} ${chalk.underline.italic.gray('/user/allBookmarks')} success: ${chalk.red('false')}`)
    }
}