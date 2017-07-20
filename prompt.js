/*
    prompt.js

    Prompt for zendesk-tix-viewer, uses `inquirer.js` 
    to draw the prompt for navigating around the program.
*/
var inquirer    = require('inquirer');
var questions   = require ('./prompt_schema');
var app         = require('./ticket_app');
var chalk       = require('chalk');


/* 
    getZendeskCredentials function.
    Prompts user for subdomain, username & password.
    Calls main menu when credentials are entered.
*/

exports.getZendeskCredentials = function(){
    inquirer.prompt(questions.credentials).then(function(answers){
        var credentials = answers;
        var subdomain = answers['subdomain']
        var client = app.initClient(credentials);
        exports.menu(client, subdomain);    
    });
}

/* 
    menu function.
    Main menu.
*/

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
            exports.viewTicketMenu(client, subdomain);
            break;
        case 'Exit':
            console.log(chalk.cyan.bold.inverse('Goodbye!'));
            process.exit();
            break;
    }
})
}

/* 
    viewTicketMenu function.
    Prompts user for ticket ID.
    Calls getIndividualTicket function to get the ticket.
*/

exports.viewTicketMenu = function(client, subdomain){
    inquirer.prompt(questions.ticket_number).then(function(answers){
        var id = answers['ticket_number'];
        app.getIndividualTicket(client, subdomain, id);
    });
}

/* 
    viewMoreTicketsMenu function.
    Is called when there are more tickets in the query,
    prompts user to view more or return to main menu.
*/

exports.viewMoreTicketsMenu = function(client, data, subdomain){
    inquirer.prompt(questions.view_more).then(function(answers){
        switch(answers['view_more']){
            case true:
                app.getTickets(client, data['next_page'], function(data){
                    app.parseTickets(data);
                    app.checkMoreTickets(client, data, subdomain)
                });
                break;
            case false:
                exports.menu(client, subdomain);
                break;
        }
    });
}

if (require.main === module){   
    console.log('Please run `node main.js`!')
}  else {
}