process.env.NODE_ENV = 'test'
const { app } = require('../app');
const request = require('supertest')(app);
const { expect } = require('chai');
const { connection } = require('../connection');

describe('/api', () => {
    beforeEach(() => {
        return connection.seed.run();
    });
    after(() => connection.destroy());
    
    describe('/topics', () => {
        it('GETs array of topics', () => {
            return request
                .get('/api/topics')
                .expect(200)
                .then(({body: {rows }}) => {
                    expect(rows[0]).to.contain.keys('slug', 'description');
                    expect(rows[0].slug).to.be.a('string');
                });
        });
    });
        
    describe('/users/:username', () => {
        it('responds with a user object', () => {
            return request
                .get('/api/users/paul')
                .expect(200)
                .then(({ body }) => {
                    console.log(body);
                });
        });
    });

});
