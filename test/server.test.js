const chai = require('chai');
const http = require('http');

const { expect } = chai;

describe('Server', () => {
    it('should respond to GET requests with status code 200 and JSON content type', (done) => {
        
        http.get('http://localhost:3000/animes', (res) => {
           
            expect(res.statusCode).to.equal(200);

          
            expect(res.headers['content-type']).to.equal('application/json');

           
            done();
        });
    });
});