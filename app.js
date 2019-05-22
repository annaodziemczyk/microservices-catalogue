const mongoose = require('mongoose');
const routes = require('./routes');
var mosca = require('mosca');

const fastify = require('fastify')({
    logger: true
});

fastify.register(require('fastify-multipart'), {
    limits: {
        fieldNameSize: 100, // Max field name size in bytes
        fieldSize: 1000000, // Max field value size in bytes
        fields: 10,         // Max number of non-file fields
        fileSize: 100,      // For multipart forms, the max file size
        files: 1,           // Max number of file fields
        headerPairs: 2000   // Max number of header key=>value pairs
    }
});

routes.forEach((route, index) => {
    fastify.route(route)
});

// Import Swagger Options
const swagger = require('./config/swagger');
// Register Swagger
fastify.register(require('fastify-swagger'), swagger.options);

// Run the server!
const start = async () => {
    try {
        await fastify.listen(3002);
        fastify.swagger();
        fastify.log.info(`server listening on ${fastify.server.address().port}`)
    } catch (err) {
        fastify.log.error(err);
        process.exit(1)
    }
};
start();

if(process.env.MONGO_PASS==undefined){
    throw Error("MongoDB password not set");
}else {
// Connect to DB
    mongoose.connect('mongodb+srv://admin:'+ (process.env.MONGO_PASS).trim() + '@catalogue-lldf2.gcp.mongodb.net/test?retryWrites=true')
        .then(() => console.log('MongoDB connected…'))
        .catch(err => console.log(err));
}


// var mqtt = require('mqtt');
// var client  = mqtt.connect('mqtt://localhost:1883');

// client.on('connect', function () {
//     client.subscribe('myTopic');
// });
// client.on('message', function (topic, message) {
//     context = message.toString();
//     console.log(context);
// });

// client.publish('myTopic', 'Hello mqtt');

// var http = require('http'),
//     fs = require('fs'),
//     url = require('url');
// var p = require('path');
// var qs = require('querystring');
// var mysql = require('mysql');
//
// var multiparty = require('multiparty');
// var static = require('node-static');
// const productImgDir = './catalogue/images';
// var root = __dirname;
//
// var headers = [
//     "Product Name", "Price", "Picture", "Buy Button"
// ];


// var db = mysql.createConnection({
//     host:     'localhost',
//     user:     'root',
//     password: 'dangerous',
//     database: 'shop'
// });
// var cart = [];
// var theuser=null;
// var theuserid =null;
// var file = new static.Server(productImgDir, { cache: 3600 });
//
// var server = http.createServer(function (request, response) {
//
//     request.addListener('end', function () {
//         if(request.url.indexOf(".jpeg")>0 || request.url.indexOf(".png")>0){
//             file.serve(request, response, function (err, result) {
//                 if (err) { // There was an error serving the file
//                     console.error("Error serving " + request.url + " - " + err.message);
//
//                     // Respond to the client
//                     response.writeHead(err.status, err.headers);
//                     response.end();
//                 }
//             });
//         }
//
//     }).resume();
//
//     var path = url.parse(request.url).pathname;
//     var url1 = url.parse(request.url);
//     if (request.method == 'POST') {
//         switch (path) {
//
//             /* TODO */
//             case "/newProduct":
//
//                 var form = new multiparty.Form(
//                     {   autoFields:true,
//                         autoFiles:true,
//                         uploadDir:productImgDir}
//                     );
//
//                 form.parse(request, function(err, fields, files) {
//                     response.writeHead(200, {'content-type': 'text/plain'});
//                     response.write('received upload:\n\n');
//                     var filename =  fields["name"][0].toLowerCase().replace(/\s/g, '') + ".png";
//                     fs.rename(files.file[0].path, files.file[0].path.substring(0,files.file[0].path.lastIndexOf("\\") + 1) + filename, function (err) {
//                         if (err) throw err;
//                     });
//
//                     var query = "INSERT INTO products (name, quantity, price, image) VALUES ("
//                         + [
//                             "'" + fields["name"][0] + "'",
//                             fields["productQuantity"][0],
//                             fields["productPrice"][0],
//                             "'" + filename  + "'"
//                         ].join(", ") + ")";
//                     db.query(
//                         query,
//                         [],
//                         function(err, result) {
//                             if (err) throw err;
//                             response.end(JSON.stringify(result));
//                             console.log("Product added");
//                         }
//                     );
//
//                 });
//
//                 break;
//         } //switch
//     }
//     else {
//         switch (path) {
//             case "/getProducts"    :
//                 console.log("getProducts");
//                 response.writeHead(200, {
//                     'Content-Type': 'text/html',
//                     'Access-Control-Allow-Origin': '*'
//                 });
//                 var query = "SELECT * FROM products ";
//
//
//                 db.query(
//                     query,
//                     [],
//                     function(err, rows) {
//                         if (err) throw err;
//                         console.log(JSON.stringify(rows, null, 2));
//                         response.end(JSON.stringify(rows));
//                         console.log("Products sent");
//                     }
//                 );
//
//                 break;
//             case "/getProduct"    :
//                 console.log("getProduct");
//                 var body="";
//                 request.on('data', function (data) {
//                     body += data;
//                 });
//
//                 request.on('end', function () {
//                     var product = JSON.parse(body);
//                     response.writeHead(200, {
//                         'Content-Type': 'text/html',
//                         'Access-Control-Allow-Origin': '*'
//                     });
//                     console.log(JSON.stringify(product, null, 2));
//                     var query = "SELECT * FROM products where productID="+
//                         product.id;
//
//
//                     db.query(
//                         query,
//                         [],
//                         function(err, rows) {
//                             if (err) throw err;
//                             console.log(JSON.stringify(rows, null, 2));
//                             response.end(JSON.stringify(rows[0]));
//                             console.log("Products sent");
//                         }
//                     );
//
//                 });
//
//
//
//                 break;
//
//
//
//
//         }
//     }
//
//
//
// });
//
// server.listen(3002);
