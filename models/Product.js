const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    quantity: Number,
    price: Number,
    image: { data: Buffer, contentType: String }
});

module.exports = mongoose.model('Product', productSchema);