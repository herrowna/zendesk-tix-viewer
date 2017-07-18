var chalk = require('chalk');

exports.format_all_tickets_view = function(data){
    var tickets = data['tickets'];
    for (var i in tickets){
        console.log(tickets[i].id+ ': ' + chalk.green(tickets[i].subject) + 
        ' by ' + chalk.magenta(tickets[i].requester_id) + ' on ' + chalk.dim(tickets[i].created_at))
    }
}

exports.format_individual_tickets_view = function(data){
    var ticket = data ['ticket'];
    console.log(chalk.italic('Ticket #' + ticket['id'] + ' created on ' + ticket['created_at'] + 
    ' by ' + ticket['submitter_id'] + '\n'));
    console.log(chalk.bold.underline(ticket['subject']) + '\n')
    console.log(ticket['description'] + '\n')
    console.log('Tags: ' + ticket['tags'] + '\n')
}
