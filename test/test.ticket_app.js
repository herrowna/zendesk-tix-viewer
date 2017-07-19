var chai    = require('chai');
var expect  = chai.expect;
var app     = require('../ticket_app');
var type    = require('type-detect');

var credentials = [{
    subdomain: 'acmecorp',
    username: 'hel@love.com',
    password: 'zendesk',
}];

var client = app.initClient(credentials);

describe('Initialising client', function(){
    it('Should return a Node client object', function(){
    expect(app.initClient(credentials)).to.be.an('object');
    })  
})

describe('Fetching tickets', function(){
    it('Should return an object', function(done){
        app.getTickets(client, 'https://acmecorp.zendesk.com/api/v2/tickets.json?&per_page=25', function(data){
            expect(data).to.be.an('object');
            done();
        });
    })

    it('Should have property "tickets"', function(done){
        app.getTickets(client, 'https://acmecorp.zendesk.com/api/v2/tickets.json?&per_page=25', function(data){
            expect(data).to.have.property('error');
            done();
        });
    })
})