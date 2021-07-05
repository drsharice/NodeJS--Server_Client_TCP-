//Client sending 380 bytes of cyphertext using AES128 to the server:
var net = require('net');
var crypto = require("crypto");
var fs = require('fs');
var algo = 'aes256'
var HOST = '127.0.0.1'
var PORT = 7010;
var key = fs.readFileSync("client_cert.pem").toString();
function encrypt(key, data) {
    var cipher = crypto.createCipher(algo, key);
    var crypted = cipher.update(data, 'utf-8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}
function decrypt(key, data) {
    var decipher = crypto.createDecipher(algo, key);
    var decrypted = decipher.update(data, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');

    return decrypted;
}
var getTime = function () {
    var date = new Date();
    return date.getHours() + ':' + date.getMinutes() + ':' + date.getMilliseconds();
}
var client = new net.Socket();
client.connect(PORT, HOST, function () {

    console.log('CONNECTED TO: ' + HOST + ':' + PORT + getTime());
    //WRite a message to the socket as soon as the client is connected, the server will receive it as message from the client
    console.log("#################################################################");
    function repeat() {
        var msg = fs.readFileSync("380B.txt").toString();
        // Attempt to encryt text with the above key

        var encryptedText = encrypt(key, msg);

        //console.log(encryptedText); DEBUG


        var date = (new Date).toString();
        console.log("msg: " + msg);
        console.log(date);
        console.log("sent encrypted msg: " + encryptedText);
        console.log("\r\n");
        console.log(date);
        client.write(encryptedText);
        console.log("#################################################################");
        console.log("check decrypted msg: " + decrypt(key, encryptedText));
    }
    setInterval(repeat, 3000);
});

// Add a 'data'  event handler for the client socket
// data is what the server sent to this socket

client.on('data', function (data) {
    console.log("r\n");
    console.log('server Response: ' + data);

});
