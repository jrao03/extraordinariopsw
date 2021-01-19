//const { Socket } = require('socket.io');
const socket = io()

//elementos del dom (html)
let message = document.getElementById('message');
let username = document.getElementById('username');
let btn = document.getElementById('send');
let btn2 = document.getElementById('damelCrypto');
let output = document.getElementById('output');
let actions = document.getElementById('actions');
let output2 = document.getElementById('output2');
let cryp = document.getElementById('cryp');


//boton para enviar datos como obj
btn.addEventListener('click', function() {
    socket.emit('chat:message',
        message.value
    )
    console.log(message.value);
});

//para saber cuando estan escribiendo
message.addEventListener('keypress', function() {
    socket.emit('chat:typing', username.value);
});

//pasar el mensaje
btn2.addEventListener('click', function() {
    socket.emit('message:decry', message.value);
    console.log(cryp);
});

//pedir los datos del servidor
socket.on('chat:message', function(data) {
    output.innerHTML += `<p>
        ${data}
    </p>`
});
//pedir quien esta ecribiendo
socket.on('chat:typing', function(data) {
    actions.innerHTML = '';
    actions.innerHTML = `<p><em>${data} esta escribiendo</em></p>`
});

//pedir el crypt
socket.on('message:decry', function(data) {
    output.innerHTML += `<p>
        ${data.message}
    </p>`
    console.log('El descifrado es: ', data);
});
