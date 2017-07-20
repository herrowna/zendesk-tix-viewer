/*
    prompt_schema.js
    Questions for prompt.
*/

exports.credentials = [{
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
    },{
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
}];

exports.menu = [{
    type: 'list',
    name: 'menu',
    message: 'Menu:\n',
    choices: ['View all tickets', 'View a ticket', 'Exit'],
    default: 'View all tickets'
}];

exports.ticket_number = [{
    type: 'input',
    name: 'ticket_number',
    message: 'Enter ticket ID:\n',
    validate: function(value){
        var pass = value.match(/^[0-9]*$/)
        if (pass){
            return true
        }
        else {
            return "Please enter a valid ticket ID (numbers only)."
        }
    }
}];

exports.view_more = [{
    type: 'confirm',
    name: 'view_more',
    message: 'More tickets available! View more?',
}];

if (require.main === module){   
    console.log('Please run `node main.js`!')
}  else {
}
