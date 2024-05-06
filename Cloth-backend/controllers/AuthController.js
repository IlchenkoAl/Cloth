import jsonWebToken from "jsonwebtoken"
import bcrypt from 'bcrypt'
import chalk from "chalk"

import { UserModel } from '../models/index.js'

export const register = async (req, res) => {
    try {
        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const doc = new UserModel({
            name: req.body.name,
            surname: req.body.surname,
            login: req.body.login,
            passwordHash: hash,
        })

        await doc.validate()

        const user = await doc.save()
        const token = jsonWebToken.sign({
            _id: user._id
        }, 'secret123', { expiresIn: '30d' })

        const { passwordHash, ...userData } = user._doc

        res.json({
            ...userData,
            token
        })
        console.log(`${chalk.green('POST')} ${chalk.underline.italic.gray('/auth/register')} success: ${chalk.green('true')}`)
    } catch (error) {
        error.code ? error.code === 11000 && (
            res.status(403).json({
                message: 'Логин занят'
            })
        ) : (
            res.status(403).json({
                message: 'Не удалось зарегестрироваться'
            })
        )
        console.log(`${chalk.green('POST')} ${chalk.underline.italic.gray('/auth/register')} success: ${chalk.red('false')}`)
    }
}

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ login: req.body.login })
        if (!user) {
            console.log(`${chalk.green('POST')} ${chalk.underline.italic.gray('/auth/login')} success: ${chalk.red('false')}`)
            return res.status(403).json({
                message: 'Неверный логин или пароль'
            })
        }

        const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash)
        if (!isValidPassword) {
            console.log(`${chalk.green('POST')} ${chalk.underline.italic.gray('/auth/login')} success: ${chalk.red('false')}`)
            return res.status(403).json({
                message: 'Неверный логин или пароль'
            })
        }

        const token = jsonWebToken.sign({
            _id: user._id
        }, 'secret123', { expiresIn: '30d' })
        const { passwordHash, ...userData } = user._doc

        res.json({
            ...userData,
            token
        })
        console.log(`${chalk.green('POST')} ${chalk.underline.italic.gray('/auth/login')} success: ${chalk.green('true')}`)
    } catch (error) {
        res.status(403).json({
            message: 'Не удалось авторизоваться'
        })
        console.log(`${chalk.green('POST')} ${chalk.underline.italic.gray('/auth/login')} success: ${chalk.red('false')}`)
    }
}

export const getMe = async (req, res) => {
    const user = await UserModel.findById(req.userId)
    if (!user) {
        return res.status(404).json({
            message: 'Пользователь не найден'
        })
    }

    const { passwordHash, ...userData } = user._doc
    res.json({
        ...userData
    })
    console.log(`${chalk.magenta('GET')} ${chalk.underline.italic.gray('/auth/me')} success: ${chalk.green('true')}`)
}

export const checkLogin = async (req, res) => {
    try {
        const user = await UserModel.findOne({ login: req.body.login }).exec()

        if (user) {
            return res.status(403).json({
                message: 'Логин занят'
            })
        }

        res.json({
            sucsess: true
        })
    } catch (error) {
        
    }
}