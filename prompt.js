var inquirer    = require('inquirer');
var questions   = require ('./prompt_schema');
var app         = require('./ticket_app');
var chalk       = require('chalk');

exports.getZendeskCredentials = function(){
    inquirer.prompt(questions.credentials).then(function(answers){
        var credentials = answers;
        var subdomain = answers['subdomain']
        var client = app.initClient(credentials);
        exports.menu(client, subdomain);    
    });
}

exports.menu = function(client, subdomain){
    inquirer.prompt(questions.menu).then(function(answers){
    var choice = answers['menu'];
    switch(choice){
        case 'View all tickets':
            var url = 'https://'+subdomain+'.zendesk.com/api/v2/tickets.json?&per_page=25';
            app.getTickets(client, url, function(data){
                app.parseTickets(data);
                app.checkMoreTickets(client, data, subdomain)
            });
            break;
        case 'View a ticket':
            exports.viewTicketMenu(function(answers){
                var id = answers['ticket_number'];
                app.getIndividualTicket(client, subdomain, id);
            });
            break;
        case 'Exit':
            console.log(chalk.cyan.bold.inverse('Goodbye!'));
            process.exit();
            break;
    }
})
}

exports.viewTicketMenu = function(callback){
    inquirer.prompt(questions.ticket_number).then(callback);
}

exports.viewMoreTicketsMenu = function(callback){
    inquirer.prompt(questions.view_more).then(callback);
}

if (require.main === module){   
    console.log('Please run `node main.js`!')
}  else {
}