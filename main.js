/*
    main.js
    Run me!
    `npm install`
    `node main.js`
*/

var chalk  = require('chalk');
var prompt = require('./prompt');

if (require.main === module){   
    console.log(chalk.cyan.bold.inverse('Welcome to Zendesk Tix Viewer!'));
    prompt.getZendeskCredentials();
}  else {
}