import mongoose from 'mongoose'

const cardShema = new mongoose.Schema({
    title: { type: String, require: true },
    price: { type: Number, require: true },
    description: { type: String, require: true },
    imgUrl: { type: String, require: true },
})

export default mongoose.model('Card', cardShema)