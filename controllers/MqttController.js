var mqtt = require('mqtt');
var client;
exports.connect = ()=>{
    client = mqtt.connect('mqtt://35.238.218.12', {port:1883});
    client.on('connect', function () {
        client.subscribe('presence', function (err) {
            if (!err) {
                client.publish('presence', 'Hello mqtt')
            }
        })
    });

    client.on('message', function (topic, message) {
        // message is Buffer
        console.log(topic + " " + message.toString());
    })
};


exports.publishMessage = (topic, message)=>{
    client.publish(topic, message);
};

exports.subscribe = (topic, callback)=>{
    client.subscribe(topic, callback);
};
