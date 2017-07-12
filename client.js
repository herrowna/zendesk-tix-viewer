$( document ).ready(function() {
    var socket = io.connect();

    socket.on('connect', function(data) {
    socket.emit('join');
    })

    socket.on('ticketsReceived', function(data){
        $('#status').html(data.count +' tickets in total.')


    var parse_tickets = function(data){
        var tickets = data['tickets']
        for(var i in tickets){
            console.log(tickets[i].url)
        }
    };
    
    })
});