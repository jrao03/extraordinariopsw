const path = require('path');
const express = require('express');
const app = express();
var aesjs = require('aes-js');
var key = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
    16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
    29, 30, 31];

    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/public/index.html');
      });
//config del puerto

app.set('port', process.env.PORT || 3000);

//iniciar servidor
const server = app.listen(app.get('port'), () => {
    console.log("el servidor esta en el puerto ", app.get('port'));
});

//enviar archivos estaticos (public)
app.use(express.static(path.join(__dirname, 'public')));


//websocket
const SocketIO = require('socket.io');
const io = SocketIO(server);
io.on('connection', (socket) => {
    console.log('new connection', socket.id);

    socket.on('chat:message', (data) => {
        console.log(data)
        // Convert text to bytes
        var text = data;
        var textBytes = aesjs.utils.utf8.toBytes(text);

        var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
        var encryptedBytes = aesCtr.encrypt(textBytes);
        // To print or store the binary data, you may convert it to hex
        var cifrado = aesjs.utils.hex.fromBytes(encryptedBytes);
        console.log(cifrado);
        io.sockets.emit('chat:message', cifrado);
    });

    socket.on('chat:typing', (data) => {
        socket.broadcast.emit('chat:typing', data);
    });

    socket.on('message:decry', (data) => {
        // When ready to decrypt the hex string, convert it back to bytes
        var encryptedBytes = aesjs.utils.hex.toBytes(data);
        // The counter mode of operation maintains internal state, so to
        // decrypt a new instance must be instantiated.
        var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
        var decryptedBytes = aesCtr.decrypt(encryptedBytes);
        // Convert our bytes back into text
        var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
        console.log(decryptedText);
        io.sockets.emit('message:decry', (decryptedText));
    
    });

});