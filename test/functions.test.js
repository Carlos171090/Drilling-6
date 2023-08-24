const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index'); 
const expect = chai.expect;

chai.use(chaiHttp);

describe('Anime CRUD', () => {

    
    describe('addAnime()', () => {
        it('Should add a new anime with valid data', (done) => {
           
            const newAnime = {
                nombre: 'Example Anime',
                genero: 'Action',
                año: 2023,
                autor: 'Example Author'
            };

            
            chai.request(server)
                .post('/animes')
                .send(newAnime)
                .end((err, res) => {
                  
                    expect(res).to.have.status(201);

                    
                    expect(res.body).to.have.property('id');

                    
                    done();
                });
        });

        it('Should return an error when trying to add an anime with missing required fields', (done) => {
            
            const invalidAnime = {
                genero: 'Action',
                año: 2023,
                
            };

            
            chai.request(server)
                .post('/animes')
                .send(invalidAnime)
                .end((err, res) => {
                  
                    expect(res).to.have.status(400);

                    
                    expect(res.body).to.have.property('error');

                    
                    done();
                });
        });
    });

    
    describe('findAnimeById()', () => {
        it('Should return an existing anime when providing a valid ID', (done) => {
         
            const existingId = '1';

            
            chai.request(server)
                .get(`/animes?id=${existingId}`)
                .end((err, res) => {
                    
                    expect(res).to.have.status(200);

                    
                    expect(res.body).to.be.an('object');

                   
                    done();
                });
        });

        it('Should return an error when providing an invalid ID', (done) => {
            
            const invalidId = '9999';

            
            chai.request(server)
                .get(`/animes?id=${invalidId}`)
                .end((err, res) => {
                  
                    expect(res).to.have.status(404);

                   
                    expect(res.body).to.have.property('error');

                  
                    done();
                });
        });
    });

   
    after(() => {
        server.close();
    });
});