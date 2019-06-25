process.env.NODE_ENV = 'test'
const { app } = require('../app');
const request = require('supertest')(app);
const { expect } = require('chai');
const { connection } = require('../connection');

describe('/api', () => {
    beforeEach(() => connection.seed.run());
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
                .get('/api/users/rogersop')
                .expect(200)
                .then(({ body : { user }}) => {
                    expect(user).to.contain.keys('username', 'name', 'avatar_url');
                    expect(user.name).to.equal('paul');
                }); 
        });
        it('404 responds not found for non-existent but valid username', () => {
            return request
                .get('/api/users/gollum')
                .expect(404)
                .then(({ body }) => {
                    expect(body.message).to.equal('invalid username');
                });
        });
    });

});
