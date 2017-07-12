// config me
var client_configuration = {mimetypes: {json: ["application/json", "application/json;charset=utf-8"]}, 
                            user: "hel@love.com",   
                            password: "zendesk"};
var port = 3000;

var express = require('express');  
var app = express();  
app.use(express.static(__dirname + ''));
app.get('/', function(req, res) {  
        res.sendFile(__dirname + '/index.html');
});
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var Client = require('node-rest-client').Client;
var client = new Client(client_configuration);

var get_all_tickets = function(){
    var args = {path: { "subdomain":"acmecorp", "item":"tickets", "per_page": 25 }};
    client.get("https://${subdomain}.zendesk.com/api/v2/${item}.json?per_page=${per_page}", args, function (data, response) {
    io.emit('ticketsReceived', data);
    });
};


io.on('connection', function(client) {
    client.on('join', function(data) {
    console.log('Client connected...');
    get_all_tickets();
    })
});

server.listen(port);  
console.log('Server available at http://localhost:' + port);
