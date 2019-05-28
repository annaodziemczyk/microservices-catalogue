const mongoose = require('mongoose');
const routes = require('./routes');
var mosca = require('mosca');
// Import Swagger Options
const swagger = require('./config/swagger');

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

if(process.env.MONGO_PASS==undefined){
    throw Error("MongoDB password not set");
}else {
    const db = 'mongodb+srv://admin:'+ (process.env.MONGO_PASS).trim() + '@catalogue-lldf2.gcp.mongodb.net/test?retryWrites=true';
    const local_db = 'mongodb://localhost/catalogue';

// Connect to DB
    mongoose.connect(db)
        .then(() => {
            console.log('MongoDB connected…');
            // Run the server!
            const start = async () => {
                try {
                    // Register Swagger
                    fastify.register(require('fastify-swagger'), swagger.options);

                    routes.forEach((route, index) => {
                        fastify.route(route)
                    });

                    await fastify.listen(3002, '0.0.0.0', function (err, address) {
                        if (err) {
                            fastify.log.error(err);
                            process.exit(1)
                        }
                        fastify.swagger();
                        fastify.log.info(`server listening on ${fastify.server.address().port}`);
                    });

                } catch (err) {
                    fastify.log.error(err);
                    process.exit(1)
                }
            };
            start();
        }


        )
        .catch(err => console.log(err));
}


