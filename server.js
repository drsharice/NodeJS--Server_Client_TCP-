// Load the TCP Library
net = require('net');

// Load the crypto Module
var fs = require('fs');
var HOST = '127.0.0.1';
var PORT = 7010;
var algo = 'aes256'
var crypto = require('crypto'),
    key = fs.readFileSync("client_cert.pem").toString();

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
//keep track of the chat clients
var clients = [];
var server = net.createServer(onClientConnected);
var getTime = function () {
    var date = new Date();
    return date.getHours() + ':' + date.getMinutes() + ':' + date.getMilliseconds();
}

server.listen(PORT, HOST, function () {
    console.log('server listening 7011  ' + getTime());

});

function onClientConnected(sock) {
    var remoteAddress = sock.remoteAddress + ':' + sock.remotePort;
    console.log('new client connected:  %s', remoteAddress + ':' + getTime());

    // socket.setEncoding('hex');DEBUG

    //put this new client in this list
    //clients.push(socket);

    //send a nice welcome message and announce
    sock.write("Welcome client ");

    console.log("\r\n");

    //Handle incoming messages from clients
    sock.on('data', function (data) {

        var decryptedText = decrypt(key, data.toString('utf-8'));
        var date = (new Date).toString();
        sock.write(decryptedText);
        sock.write(getTime());
        console.log(decryptedText, ':' + getTime());
        console.log(getTime());
        //broadcast(socket.name + ">" + decryptedText, socket);
    });
    // Send a message to all clients
    //function broadcast(message, sender){
    //clients.forEach(function (client) {
    // Don't want to send it to sender
    //if (client === sender) return;
    //client.write(message);
    //});

    sock.on('close', function () {
        console.log('connection from %s closed', remoteAddress);
    });
};