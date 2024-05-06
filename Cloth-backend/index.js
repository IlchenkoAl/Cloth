import express from 'express'
import cors from "cors"
import chalk from 'chalk'
import multer from 'multer'
import mongoose from 'mongoose'

import { ActionsOnCardContoller, AuthController, CardController } from './controllers/index.js'
import { checkAuth } from './utils/index.js'

mongoose
    .connect('mongodb+srv://admin:StartOff0492@cluster0.y1zox4x.mongodb.net/Sneakers?retryWrites=true&w=majority')
    .then(() => console.log('Подключение к БД:', chalk.green('ОК')))
    .catch(error => console.log('Подключения к БД:', chalk.red('ERR::'), error))

const app = express()

const storage = multer.diskStorage({
    destination: (_, __, callback) => {
        callback(null, 'uploads')
    },
    filename: (_, file, callBack) => {
        callBack(null, file.originalname)
    }
})
const upload = multer({ storage })

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

const PORT = process.env.PORT || 5556

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
    console.log(`${chalk.green('POST')} ${chalk.underline.italic.gray('/upload')} success: ${chalk.green('true')}`)
})

app.post('/card/add', checkAuth, CardController.add)
app.get('/card/all', CardController.all)
app.get('/card/search/:searchString', CardController.search)

app.post('/user/addCart', checkAuth, ActionsOnCardContoller.addCart)
app.post('/user/removeCart', checkAuth, ActionsOnCardContoller.removeCart)
app.post('/user/addBookmarks', checkAuth, ActionsOnCardContoller.addBookmarks)
app.post('/user/removeBookmarks', checkAuth, ActionsOnCardContoller.removeBookmarks)
app.get('/user/allCart', checkAuth, CardController.cartAll)
app.get('/user/allBookmarks', checkAuth, CardController.bookmarksAll)

app.post('/auth/register', AuthController.register)
app.post('/auth/login', AuthController.login)
app.post('/auth/checkLogin', AuthController.checkLogin)
app.get('/auth/me', checkAuth, AuthController.getMe)

app.listen(PORT, err => {
    if (err) throw console.log('Ошибка при запуске сервера: ', err)
    console.log('Сервер запущен на проту:', chalk.green(PORT))
})