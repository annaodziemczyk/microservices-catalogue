const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    quantity: Number,
    price: Number,
    image: { data: Buffer, name: String, mimeType:String}
});

module.exports = mongoose.model('Product', productSchema);