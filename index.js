'use strict'
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
})
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var Client = require('node-rest-client').Client;
var rest_client = new Client(client_configuration);

var check_next_page = function(data){
    var next_page_link = data['next_page'];
    try {
        if('next_page' in data == null) {
            throw new IndexError('Reached end of query')
        }
        console.log('More tickets found');
        io.emit('hasNextPage', next_page_link)
        
    } catch (e) {
        console.log(e.message);
    }
}

var get_tickets = function(url){
    rest_client.get(url, function(data, response){
        try {
            if('error' in data) {
                var error = JSON.stringify(data['error'])
                io.emit('errorFromProvider', error);
                throw new SyntaxError(error);
            } else {
                io.emit('ticketsReceived', data);
                check_next_page(data)
            }
        } catch(e) {
            console.log(JSON.stringify(e.message));
        } 

    }).on('error', function(err){
        console.log('Something went wrong on the request', err.request.options);
    })
}

io.on('connection', function(client) {
    get_tickets('https://acmecorp.zendesk.com/api/v2/tickets.json?&per_page=25');
    client.on('join', function(data) {
        console.log('Client connected...');
    })

    client.on('getMoreTickets', function(data){
        get_tickets(data['next_page'])
    })
})

server.listen(port);  
console.log('Server available at http://localhost:' + port);
