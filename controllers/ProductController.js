const boom = require('boom');
const pump = require('pump');
const fs = require('fs');
var streamToBuffer = require('stream-to-buffer');
// const serveStatic = require('serve-static');
const Joi = require('joi');
const mqttController = require('./MqttController');

const productSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    quantity: Joi.number().required(),
    image: Joi.object().required()
});


// Get Data Models
const Product = require('../models/Product');
const productImgDir = './catalogue/images';

// Get all products
exports.getProducts = async (req, reply) => {
    try {
        const products = await Product.find();
        return products
    } catch (err) {
        throw boom.boomify(err);
    }
};

// Get single product by ID
exports.getSingleProduct = async (req, reply) => {
    try {
        const id = req.params.id;
        const car = await Product.findById(id);
        return car;
    } catch (err) {
        throw boom.boomify(err);
    }
};

// Add a new product
exports.addProduct = async (req, reply) => {
    try {

        var mp = req.multipart(addNewProductHandler, productFileUploadCompleted);

        var product = new Product();
        // var pathToProductFile=productImgDir + "/" ;

        function addNewProductHandler(field, file, filename, encoding, mimetype) {
            streamToBuffer(file, function (err, buffer) {
                // let base64 = buffer.toString('base64');
                // let image = new Buffer(base64, 'base64');

                product.image={
                    mimeType:mimetype,
                    data:buffer,
                    name:filename
                };
                reply.code(200).send(product);
            });

            // pump(file, fs.createWriteStream(pathToProductFile));
        }

        function productFileUploadCompleted (err) {
            if(err){
                throw boom.boomify(err);
            }

            reply.send();
        }

        mp.on('field', function (key, value) {
            product[key]=value;
        });


    } catch (err) {
        throw boom.boomify(err);
    }
};

// Update an existing product
exports.updateProduct = async (req, reply) => {
    try {
        const id = req.params.id;
        const product = req.body;
        const { ...updateData } = product;
        const update = await Product.findByIdAndUpdate(id, updateData, { new: true });
        return update;
    } catch (err) {
        throw boom.boomify(err);
    }
};

// Delete a product
exports.deleteProduct = async (req, reply) => {
    try {
        const id = req.params.id;
        const product = await Product.findByIdAndRemove(id);
        if(product){
            return product;
        }else{
            throw boom.boomify(new Error("Product does not exist"));
        }

    } catch (err) {
        throw boom.boomify(err);
    }
};