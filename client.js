$( document ).ready(function() {
    var socket = io.connect();

    socket.on('connect', function(data) {
        socket.emit('join');
    });

    socket.on('errorFromProvider', function(data){
        $('#status').html(data)
    })

    var populate_tickets_list = function(data){
        $('#status').html(data.count +' tickets in total.')
        var tickets = data['tickets']   // new variable here just to shorten the JSON object query
        for (var i in tickets){ 
            $('#tickets_list').append('<li>'+'<a href="'+tickets[i].url+'">'+tickets[i].subject+'</a>'+'</li>')
        }
    };

    socket.on('ticketsReceived', function(data){
        populate_tickets_list(data)
        $('#next_page').click(function(){
            socket.emit('hasNextPage', page_link)
            })
    });


});