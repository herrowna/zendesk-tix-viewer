var styling = require ('./cli');
var prompt  = require('./prompt');

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

exports.getTickets = function(client, url, callback){
    client.get(url, function(data, response){
        callback(data);
    })
}

exports.checkMoreTickets = function(client, data, subdomain){
    if ('error' in data){
        return false;
    } else if (data['next_page'] != null){
        prompt.viewMoreTicketsMenu(function(answers){
            switch(answers['view_more']){
                case true:
                    exports.getTickets(client, data['next_page'], function(data){
                        console.log(data);
                        exports.parseTickets(data);
                        exports.checkMoreTickets(client, data, subdomain)
                    });
                    break;
                case false:
                    prompt.menu(client, subdomain);
                    break;
            }
            })
    } else {
        console.log("Reached end of query.")
        prompt.menu(client, subdomain);
    }
}

exports.parseTickets = function(data){
    try {
        if('error' in data) {
            var error = JSON.stringify(data['error'])
            throw new SyntaxError(error);
        } else {
            styling.format_all_tickets_view(data);  
            }
    } catch(e) {
        console.log('Error: ' + JSON.stringify(e.message));
        prompt.getZendeskCredentials();
    }
}

exports.getIndividualTicket = function(client, subdomain, id){
    var url = 'https://'+subdomain+'.zendesk.com/api/v2/tickets/'+id+'.json';
    client.get(url, function(data, response){
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
    })
};

if (require.main === module){   
    console.log('Please run `node main.js`!')
}  else {
}
