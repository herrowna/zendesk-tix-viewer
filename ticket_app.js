/*
    ticket_app.js
    
    Core functionality for zendesk-tix-viewer is found here.
    1. Connect to the Zendesk API
    2. Request all the tickets for your account
    3. Display them in a list
    4. Display individual ticket details
    5. Page through tickets when more than 25 are returned
*/

var styling = require ('./cli');
var prompt  = require('./prompt');
/*
    initClient function.
    Initialize node-rest-client with credentils picked up via prompt,
    returns a client object.
*/
exports.initClient = function(credentials){
    var Client = require('node-rest-client').Client;
    var client_configuration = {
        mimetypes: {json: ["application/json", "application/json;charset=utf-8"]}, 
        user: credentials['username'],   
        password: credentials['password']
    };
    var rest_client = new Client(client_configuration);
    return rest_client;
}

/*
    getTickets function.
    Generic wrapper function for REST client to fetch data from Zendesk service,
    payload is generated in callback for further parsing.
    Can be used for either tickets.json or tickets/{id}.json
*/
exports.getTickets = function(client, url, callback){
    client.get(url, function(data, response){
        callback(data);
    })
}

/*
    parseTickets function.
    Parse payload and call for further formatting if tickets are found.
    If an error occurs, user is prompted for credentials again.
*/

exports.parseTickets = function(data){
    try {
        if('error' in data) {
            var err = JSON.stringify(data['error'])
            throw new Error(err);
        } else {
            styling.format_all_tickets_view(data);  
            }
    } catch(e) {
        console.log('Error: ' + JSON.stringify(e.message));
        prompt.getZendeskCredentials();
    }
}

/*
    checkMoreTickets function.
    Checks for more tickets in the payload using the ['next_page'] key.
    Prompts user to continue viewing if more tickets are found.
*/

exports.checkMoreTickets = function(client, data, subdomain){
    if ('error' in data){
        return false;
    } else if (data['next_page'] != null){
        prompt.viewMoreTicketsMenu(client, data, subdomain);
    } else {
        console.log("Reached end of query.")
        prompt.menu(client, subdomain);
    }
}

/*
    getIndividualTicket function.
    Uses the generic getTickets function to get tickets from service.
    Payload is sent to parseIndividualTicket function for parsing.
*/

exports.getIndividualTicket = function(client, subdomain, id){
    var url = 'https://'+subdomain+'.zendesk.com/api/v2/tickets/'+id+'.json';
    exports.getTickets(client, url, function(data){
        exports.parseIndividualTicket(client, data, subdomain)
    })
};

/* 
    parseIndividualTicket function.
    Parse payload and call for further formatting if tickets are found.
    If a login error occurs, user is prompted for credentials again.
*/

exports.parseIndividualTicket = function(client, data, subdomain){
    try {
        if('error' in data) {
            var error = JSON.stringify(data['error'])
            throw new Error(error);
        } else {
            styling.format_individual_tickets_view(data);
            prompt.menu(client, subdomain)
            }
    } catch(e) {
        console.log('Error: ' + JSON.stringify(e['message']));
        switch(e['message']) {
            case "\"RecordNotFound\"":
                prompt.menu(client, subdomain);
                break;
            case "\"Couldn't authenticate you\"":
                prompt.getZendeskCredentials();
                break;
        }
    }
}

if (require.main === module){   
    console.log('Please run `node main.js`!')
}  else {
}
