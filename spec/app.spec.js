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
        it('GETs a user object', () => {
            return request
                .get('/api/users/rogersop')
                .expect(200)
                .then(({ body : { user }}) => {
                    expect(user).to.contain.keys('username', 'name', 'avatar_url');
                    expect(user.name).to.equal('paul');
                }); 
        });
        it('GETs 404 not found for non-existent username', () => {
            return request
                .get('/api/users/gollum')
                .expect(404)
                .then(({ body }) => {
                    expect(body.message).to.equal('user does not exist: gollum');
                });
        });
    });

    describe('/articles/:article_id', () => {
        it('GETs an article object', () => {
            return request
                .get('/api/articles/1')
                .expect(200)
                .then(({ body }) => {
                    expect(body).to.contain.keys('author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes', 'comment_count');
                }); 
        });
        it('GETs 404 not found for non-existent but valid article_id', () => {
            return request
                .get('/api/articles/12345')
                .expect(404)
                .then(({ body }) => {
                    expect(body.message).to.equal('article does not exist: 12345');
                });
        });
        it('GETs 400 bad request for invalid article_id', () => {
            return request
                .get('/api/articles/cabbages')
                .expect(400)
                .then(({ body }) => {
                    expect(body.message).to.equal('bad request');
                });
        });
        it('PATCHes an article', () => {
            const vote = { inc_votes: 5 };
            return request
                .patch('/api/articles/1')
                .send(vote)
                .expect(201)
                .then(({ body }) => {
                    expect(body).to.contain.keys('author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes', 'comment_count');
                });
        });
        it('PATCHes 404 not found for non-existent but valid article_id', () => {
            const vote = { inc_votes: 5 };
            return request
                .patch('/api/articles/12345')
                .send(vote)
                .expect(404)
                .then(({ body }) => {
                    expect(body.message).to.equal('article does not exist: 12345');
                });
        });
        it('PATCHes 400 bad request for invalid article_id', () => {
            const vote = { inc_votes: 5 };
            return request
                .patch('/api/articles/bananas')
                .send(vote)
                .expect(400)
                .then(({ body }) => {
                    expect(body.message).to.equal('bad request');
                });
        });
    });

});