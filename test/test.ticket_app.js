var chai    = require('chai');
var expect  = chai.expect;
var app     = require('../ticket_app');

var valid_credentials = {
    subdomain: 'acmecorp',
    username: 'hel@love.com',
    password: 'zendesk',
};

var invalid_credentials = {
    subdomain: 'acmecorp',
    username: 'hel@love.com',
    password: '111',
};

var valid_client = app.initClient(valid_credentials);
var invalid_client = app.initClient(invalid_credentials);

describe('Initialising client', function(){
    it('should return a client object', function(){
    expect(valid_client).to.be.an('object');
    })  
})

describe('View all tickets function', function(){
    it('should return an object', function(done){
        app.getTickets(valid_client, 'https://acmecorp.zendesk.com/api/v2/tickets.json?&per_page=25', function(data){
            expect(data).to.be.an('object');
            done();
        });
    })
    it('should have property "tickets" with valid login credentials', function(done){
        app.getTickets(valid_client, 'https://acmecorp.zendesk.com/api/v2/tickets.json?&per_page=25', function(data){
            expect(data).to.have.property('tickets');
            done();
        });
    })
    it('should have property "error" with invalid login credentials', function(done){
        app.getTickets(invalid_client, 'https://acmecorp.zendesk.com/api/v2/tickets.json?&per_page=25', function(data){
            expect(data).to.have.property('error');
            done();
        }); 
    })
    it('should have property "error" with invalid subdomain', function(done){
        app.getTickets(valid_client, 'https://acmecorp111.zendesk.com/api/v2/tickets.json?&per_page=25', function(data){
            expect(data).to.have.property('error');
            done();
        }); 
    })
})

describe('Check more tickets function', function(){
    it('should return false with invalid login credentials', function(done){
        app.getTickets(invalid_client, 'https://acmecorp.zendesk.com/api/v2/tickets.json?&per_page=25', function(data){
            expect(app.checkMoreTickets(invalid_client,data,'acmecorp')).to.be.false;
        done();
        }); 
    })

    it('should return false with invalid subdomain', function(done){
        app.getTickets(invalid_client, 'https://acmecorp111.zendesk.com/api/v2/tickets.json?&per_page=25', function(data){
            expect(app.checkMoreTickets(invalid_client,data,'acmecorp')).to.be.false;
        done();
        }); 
    })
})