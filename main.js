var chalk       = require('chalk');
var inquirer    = require('inquirer');
var questions   = require ('./prompt_schema.js');
var styling     = require ('./cli.js');

function getZendeskCredentials() {
    inquirer.prompt(questions.credentials).then(function(answers){
        credentials = answers;
        var subdomain = answers['subdomain']
        client = initClient(credentials);
        menu(client, subdomain);    
        });
}

function menu(client, subdomain){
    inquirer.prompt(questions.menu).then(function(answers){
        var choice = answers['menu'];
        switch(choice){
            case 'View all tickets':
                url = 'https://'+subdomain+'.zendesk.com/api/v2/tickets.json?&per_page=25';
                getAllTickets(client, url, subdomain);
                break;
            case 'View a ticket':
                viewTicketMenu(function(answers){
                    var id = answers['ticket_number'];
                    getIndividualTicket(client, subdomain, id);
                });
                break;
            case 'Exit':
                console.log(chalk.cyan.bold.inverse('Goodbye!'));
                break;
        }
    })
}

function viewTicketMenu(callback){
    inquirer.prompt(questions.ticket_number).then(callback);
}

function viewMoreTicketsMenu(callback){
    inquirer.prompt(questions.view_more).then(callback);
}

function initClient(credentials){
    var Client = require('node-rest-client').Client;
    var client_configuration = {mimetypes: {json: ["application/json", "application/json;charset=utf-8"]}, 
        user: credentials['username'],   
        password: credentials['password']};
    var rest_client = new Client(client_configuration);
    return rest_client;
}

function getIndividualTicket(client, subdomain, id){
    var url = 'https://'+subdomain+'.zendesk.com/api/v2/tickets/'+id+'.json';
    client.get(url, function(data, response){
        styling.format_individual_tickets_view(data);
    })
    menu(client, subdomain)
}

function getAllTickets(client, url, subdomain){
    client.get(url, function(data, response){
        try {
            if('error' in data) {
                var error = JSON.stringify(data['error'])
                throw new SyntaxError(error);
            } else {
                styling.format_all_tickets_view(data);
                if (data['next_page'] != null){
                    viewMoreTicketsMenu(function(answers){
                        switch(answers['view_more']){
                            case true:
                                getAllTickets(client, data['next_page'], subdomain)
                                break;
                            case false:
                                menu(client, subdomain);
                                break;
                        }
                        })
                    }
                }
        } catch(e) {
            console.log(JSON.stringify(e.message));
            getZendeskCredentials();
        }
    })
}

console.log(chalk.cyan.bold.inverse('Welcome to Zendesk Tix Viewer!'));
getZendeskCredentials();
