var socket = io.connect('http://localhost:3000', { 'forceNew': true });

socket.on('messages', function(data) {
    console.log(data);
    render(data);
});

function render(data) {
    var html = data.map((message, index) => {
        return (`
        <div class="message">
            <strong>${message.nickname}</strong>
            <p>${message.text}</p>
        </div>
        `)
    }).join(' ');

    document.getElementById('mensajes').innerHTML = html;
}


function addMessage(e) {
    var message = {
        nickname: document.getElementById('nickname').value,
        text: document.getElementById('text').value
    };

    document.getElementById('nickname').style.display = 'none';
    socket.emit('add-message', message);
    return false;
}