var chalk       = require('chalk');
var clear       = require('clear');
var inquirer    = require('inquirer');

function getZendeskCredentials(callback) {
  var questions = [
    {
      name: 'subdomain',
      type: 'input',
      message: 'Subdomain:',
      validate: function( value ) {
        if (value.length) {
          return true;
        } else {
          return 'Please enter your subdomain';
        }
      }
    },{
      name: 'username',
      type: 'input',
      message: 'Username:',
      validate: function( value ) {
        if (value.length) {
          return true;
        } else {
          return 'Please enter your username or e-mail address';
        }
      }
    },
    {
      name: 'password',
      type: 'password',
      message: 'Password:',
      validate: function(value) {
        if (value.length) {
          return true;
        } else {
          return 'Please enter your password';
        }
      }
    }
  ];

  inquirer.prompt(questions).then(callback);
}

function menu(client, url){
    var questions = [
        {
        type: 'list',
        name: 'menu',
        message: 'Menu:\n',
        choices: [ 'View all tickets', 'View a ticket', 'Exit' ],
        default: 'View all tickets'
        }
    ]
    inquirer.prompt(questions).then(function(answers){
        var choice = answers['menu'];
        switch(choice){
            case 'View all tickets':
                getAllTickets(client, url);
                break;
            case 'View a ticket':
                console.log('More!');
                break;
            case 'Exit':
                console.log(chalk.cyan.bold.inverse('Goodbye!'));
                break;
        }
    })
}

function viewTicketMenu(callback){
    var questions = [
        {
        type: 'list',
        name: 'view_ticket',
        message: 'Menu:\n',
        choices: ['Enter ticket number', 'Back'],
        default: 'Enter ticket number'
        }
    ]
    inquirer.prompt(questions).then(callback);
}

function viewMoreTicketsMenu(callback){
    var questions = [
        {
        type: 'confirm',
        name: 'view_more',
        message: 'More tickets available! View more?',
        }
    ]
    inquirer.prompt(questions).then(callback);
}

function initClient(credentials){
    var Client = require('node-rest-client').Client;
    var client_configuration = {mimetypes: {json: ["application/json", "application/json;charset=utf-8"]}, 
        user: credentials['username'],   
        password: credentials['password']};
    var rest_client = new Client(client_configuration);
    return rest_client;
}

function getAllTickets(client, url){
    client.get(url, function(data, response){
        try {
            if('error' in data) {
                var error = JSON.stringify(data['error'])
                throw new SyntaxError(error);
            } else {
                var tickets = data['tickets'];
                for (var i in tickets){
                    console.log(tickets[i].id+ ': ' + tickets[i].subject)
                }
                if (data['next_page'] != null){
                    viewMoreTicketsMenu(function(answers){
                        switch(answers['view_more']){
                            case true:
                                getAllTickets(client, data['next_page'])
                                break;
                            case false:
                                menu(client, url);
                                break;
                        }
                        })
                    }
                }
        } catch(e) {
            console.log(JSON.stringify(e.message));
            process.exit()
        }
    })
}

console.log(chalk.cyan.bold.inverse('Welcome to Zendesk Tix Viewer!'));
getZendeskCredentials(function(){
    var credentials = arguments['0'];
    var url = 'https://'+credentials['subdomain']+'.zendesk.com/api/v2/tickets.json?&per_page=25';
    client = initClient(credentials);
    menu(client, url);
})
