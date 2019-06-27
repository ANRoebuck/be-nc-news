process.env.NODE_ENV = 'test'
const { app } = require('../app');
const request = require('supertest')(app);
const { connection } = require('../connection');
const chai = require('chai');
const { expect } = require('chai');
const chaiSorted = require('chai-sorted');

chai.use(chaiSorted);

describe('/api', () => {
    beforeEach(() => connection.seed.run());
    after(() => connection.destroy());

    describe('/', () =>{
        describe('GET', () => {
            it('returns JSON object of api endpoints', () => {
                return request
                    .get('/api/')
                    .then(({ body }) => {
                        expect(body).to.be.a('object');
                        expect(body).to.include.keys('GET /api', 'GET /api/topics', 'GET /api/articles');
                    });
            });
        });
        describe('invalid methods', () => {
            it('405 method not allowerd', () => {
                const invalidMethods = ['put', 'patch', 'delete', 'post'];
                const methodPromises = invalidMethods.map((method) => {
                    return request
                        [method]('/api')
                        .expect(405)
                        .then(({ body }) => {
                            expect(body.message).to.equal('method not allowed');
                        });
                });
                return Promise.all(methodPromises);
            });
        });
    });
    
    describe('/topics', () => {
        describe('GET', () => {
            it('GETs array of topics', () => {
                return request
                    .get('/api/topics')
                    .expect(200)
                    .then(({ body: { topics }}) => {
                        expect(topics[0]).to.contain.keys('slug', 'description');
                        expect(topics[0].slug).to.be.a('string');
                    });
            });
        });
        describe('invalid methods', () => {
            it('405 method not allowerd', () => {
                const invalidMethods = ['put', 'patch', 'delete', 'post'];
                const methodPromises = invalidMethods.map((method) => {
                    return request
                        [method]('/api/topics')
                        .expect(405)
                        .then(({ body }) => {
                            expect(body.message).to.equal('method not allowed');
                        });
                });
                return Promise.all(methodPromises);
            });
        });
    });
        
    describe('/users/:username', () => {
        describe('GET', () => {
            it('returns a user object', () => {
                return request
                    .get('/api/users/rogersop')
                    .expect(200)
                    .then(({ body : { user }}) => {
                        expect(user).to.contain.keys('username', 'name', 'avatar_url');
                        expect(user.name).to.equal('paul');
                    }); 
            });
            it('404 not found for non-existent username', () => {
                return request
                    .get('/api/users/gollum')
                    .expect(404)
                    .then(({ body }) => {
                        expect(body.message).to.equal('user does not exist: gollum');
                    });
            });
        });
        describe('invalid methods', () => {
            it('405 method not allowerd', () => {
                const invalidMethods = ['put', 'patch', 'delete', 'post'];
                const methodPromises = invalidMethods.map((method) => {
                    return request
                        [method]('/api/users/rogersop')
                        .expect(405)
                        .then(({ body }) => {
                            expect(body.message).to.equal('method not allowed');
                        });
                });
                return Promise.all(methodPromises);
            });
        });
    });

    describe('/articles/:article_id', () => {
        describe('GET', () => {
            it('returns an article object', () => {
                return request
                    .get('/api/articles/1')
                    .expect(200)
                    .then(({ body: { article }}) => {
                        expect(article).to.contain.keys('author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes', 'comment_count');
                    }); 
            });
            it('404 not found for non-existent but valid article_id', () => {
                return request
                    .get('/api/articles/12345')
                    .expect(404)
                    .then(({ body }) => {
                        expect(body.message).to.equal('article does not exist: 12345');
                    });
            });
            it('400 bad request for invalid article_id', () => {
                return request
                    .get('/api/articles/cabbages')
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.message).to.equal('bad request');
                    });
            });
        });
        describe('PATCH', () => {
            it('updates an article', () => {
                const vote = { inc_votes: 5 };
                return request
                    .patch('/api/articles/1')
                    .send(vote)
                    .expect(200)
                    .then(({ body: { article } }) => {
                        expect(article).to.contain.keys('author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes', 'comment_count');
                        expect(article.votes).to.equal(105);
                    });
            });
            it('404 not found for non-existent but valid article_id', () => {
                const vote = { inc_votes: 5 };
                return request
                    .patch('/api/articles/12345')
                    .send(vote)
                    .expect(404)
                    .then(({ body }) => {
                        expect(body.message).to.equal('article does not exist: 12345');
                    });
            });
            it('400 bad request for invalid article_id', () => {
                const vote = { inc_votes: 5 };
                return request
                    .patch('/api/articles/bananas')
                    .send(vote)
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.message).to.equal('bad request');
                    });
            });
            it('200 returns unchanged article with no info in request', () => {
                return request
                    .patch('/api/articles/1')
                    .expect(200)
                    .then(({ body: { article }}) => {
                        expect(article.votes).to.equal(100);
                    })
            })
        });
        describe('invalid methods', () => {
            it('405 method not allowerd', () => {
                const invalidMethods = ['put', 'delete', 'post'];
                const methodPromises = invalidMethods.map((method) => {
                    return request
                        [method]('/api/articles/1')
                        .expect(405)
                        .then(({ body }) => {
                            expect(body.message).to.equal('method not allowed');
                        });
                });
                return Promise.all(methodPromises);
            });
        });
    });

    describe('/articles/:article_id/comments', () => {
        describe('POST', () => {
            it('adds a comment', () => {
                const comment = {
                    body: 'One does not simply walk into Mordor',
                    username: 'butter_bridge'
                };
                return request
                    .post('/api/articles/1/comments')
                    .send(comment)
                    .expect(201)
                    .then(({ body: { comment }}) => {
                        expect(comment).to.include.keys('comment_id', 'author', 'article_id', 'votes', 'body', 'created_at');
                    });
            });
            it('422 unprocessable for non-existent but valid article_id', () => {
                const comment = {
                    body: 'One does not simply walk into Mordor',
                    username: 'butter_bridge'
                };
                return request
                    .post('/api/articles/12345/comments')
                    .send(comment)
                    .expect(422)
                    .then(({ body }) => {
                        expect(body.message).to.equal('unprocessable entity')
                    });
            });
            it('400 bad request for invalid article_id', () => {
                const comment = {
                    body: 'One does not simply walk into Mordor',
                    username: 'butter_bridge'
                };
                return request
                    .post('/api/articles/cucumber/comments')
                    .send(comment)
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.message).to.equal('bad request')
                    });
            });
            it('400 bad request for invalid comment', () => {
                const comment = {
                    username: 'butter_bridge'
                };
                return request
                    .post('/api/articles/1/comments')
                    .send(comment)
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.message).to.equal('bad request')
                    });
            });
        });
        describe('GET', () => {
            it('returns all comments for an article_id', () => {
                return request
                    .get('/api/articles/1/comments')
                    .expect(200)
                    .then(({ body: { comments }}) => {
                        expect(comments).to.be.an('array');
                        expect(comments[0]).to.have.keys('comment_id', 'votes', 'created_at', 'author', 'body');
                    });
            });
            it('QUERY default sorts created_at, orders descending', () => {
                return request
                    .get('/api/articles/1/comments')
                    .expect(200)
                    .then(({ body: { comments }}) => {
                        expect(comments).to.be.sortedBy('created_at', { descending: true });
                    });
            });
            it('QUERY sorts by any column', () => {
                return request
                    .get('/api/articles/1/comments?sort_by=author')
                    .expect(200)
                    .then(({ body: { comments }}) => {
                        expect(comments).to.be.sortedBy('author', { descending: true });
                    });
            });
            it('QUERY default sorts for invalid sort_by', () => {
                return request
                    .get('/api/articles/1/comments?sort_by=shoeSize')
                    .expect(200)
                    .then(({ body: { comments }}) => {
                        expect(comments).to.be.sortedBy('created_at', { descending: true });
                    });
            });
            it('QUERY orders asc/desc', () => {
                return request
                    .get('/api/articles/1/comments?sort_by=votes&order=asc')
                    .expect(200)
                    .then(({ body: { comments }}) => {
                        expect(comments).to.be.sortedBy('votes', { ascending: true });
                    });
            });
            it('200 returns empty array for valid article with no comments', () => {
                return request
                    .get('/api/articles/2/comments')
                    .expect(200)
                    .then(({ body: { comments }}) => {
                        expect(comments).to.eql([]);
                    });
            });
            it('404 not found for non-existent but valid article_id', () => {
                return request
                    .get('/api/articles/12345/comments')
                    .expect(404)
                    .then(({ body }) => {
                        expect(body.message).to.equal('article does not exist: 12345');
                    });
            });
            it('400 bad request for invalid article_id', () => {
                return request
                    .get('/api/articles/sprouts/comments')
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.message).to.equal('bad request');
                    });
            });
        });
        describe('invalid methods', () => {
            it('405 method not allowerd', () => {
                const invalidMethods = ['put', 'delete', 'patch'];
                const methodPromises = invalidMethods.map((method) => {
                    return request
                        [method]('/api/articles/1/comments')
                        .expect(405)
                        .then(({ body }) => {
                            expect(body.message).to.equal('method not allowed');
                        });
                });
                return Promise.all(methodPromises);
            });
        });
    });

    describe('/articles', () =>{
        describe('GET', () =>{
            it('returns all articles', () =>{
                return request
                    .get('/api/articles')
                    .expect(200)
                    .then( ({ body: { articles }})  => {
                        expect(articles).to.be.an('array');
                        expect(articles[0]).to.contain.keys('author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes', 'comment_count');
                    });
            });
            it('default sorts created_at, orders descending', () =>{
                return request
                    .get('/api/articles')
                    .expect(200)
                    .then( ({ body: { articles }})  => {
                        expect(articles).to.be.sortedBy('created_at', { descending: true });
                    });
            });
            it('QUERY sorts by given column', () => {
                return request
                    .get('/api/articles?sort_by=title')
                    .expect(200)
                    .then(({ body: {articles }}) => {
                        expect(articles).to.be.sortedBy('title', { descending: true });
                    });
            });
            it('QUERY sorts by given column', () => {
                return request
                    .get('/api/articles?sort_by=comment_count')
                    .expect(200)
                    .then(({ body: { articles }}) => {
                        expect(articles).to.be.sortedBy('comment_count', { descending: true });
                    });
            });
            it('QUERY sorts default for invalid sort_by', () => {
                return request
                    .get('/api/articles?sort_by=asparagus')
                    .expect(200)
                    .then(({ body: { articles }}) => {
                        expect(articles).to.be.sortedBy('created_at', { descending: true });
                    });
            });
            it('QUERY orders asc/desc', () => {
                return request
                    .get('/api/articles?sort_by=title&order=asc')
                    .expect(200)
                    .then(({ body: { articles }}) => {
                        expect(articles).to.be.sortedBy('title', { ascending: true });
                    });
            });
            it('QUERY filter by author', () => {
                return request
                    .get('/api/articles?author=butter_bridge')
                    .expect(200)
                    .then(({ body: {articles}}) => {
                        const test = articles.every(article => (article.author==='butter_bridge'))
                        expect(test).to.equal(true);
                    });
            });
            it('QUERY filter by topic', () => {
                return request
                    .get('/api/articles?topic=mitch')
                    .expect(200)
                    .then(({ body: { articles }}) => {
                        const test = articles.every(article => (article.topic==='mitch'))
                        expect(test).to.equal(true);
                    });
            });
        });
        describe('invalid methods', () => {
            it('405 method not allowerd', () => {
                const invalidMethods = ['patch', 'put', 'delete', 'post'];
                const methodPromises = invalidMethods.map((method) => {
                    return request
                        [method]('/api/articles')
                        .expect(405)
                        .then(({ body }) => {
                            expect(body.message).to.equal('method not allowed');
                        });
                });
                return Promise.all(methodPromises);
            });
        });
    });

    describe('/comments/:comment_id', () => {
        describe('PATCH', () => {
            it('updates a comment', () => {
                const vote = { inc_votes: 2 };
                return request
                    .patch('/api/comments/1')
                    .send(vote)
                    .expect(200)
                    .then(({ body: { comment }}) => {
                        expect(comment).to.contain.keys('comment_id', 'author', 'article_id', 'votes', 'created_at', 'body');
                        expect(comment.votes).to.equal(18);
                    });
            });
            it('updates a comment with negative', () => {
                const vote = { inc_votes: -5 };
                return request
                    .patch('/api/comments/1')
                    .send(vote)
                    .expect(200)
                    .then(({ body: { comment }}) => {
                        expect(comment).to.contain.keys('comment_id', 'author', 'article_id', 'votes', 'created_at', 'body');
                    });
            });
            it('200 returns unchanged comment when no info in request', () => {
                return request
                    .patch('/api/comments/1')
                    .expect(200)
                    .then(({ body: { comment }}) => {
                        expect(comment.votes).to.equal(16);
                    });
            });
            it('404 not found for non-existent but valid comment_id', () => {
                const vote = { inc_votes: -5 };
                return request
                    .patch('/api/comments/666')
                    .send(vote)
                    .expect(404)
                    .then(({ body }) => {
                        expect(body.message).to.equal('comment does not exist: 666');
                    });
            });
            it('400 bad request for invalid comment_id', () => {
                const vote = { inc_votes: -5 };
                return request
                    .patch('/api/comments/pineapple')
                    .send(vote)
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.message).to.equal('bad request');
                    });
            });
        });
        describe('DELETE', () => {
            it('removes a comment', () => {
                return request
                    .delete('/api/comments/1')
                    .expect(204);
            });
            it('404 not found for non-existend but valid comment_id', () => {
                return request
                    .delete('/api/comments/999')
                    .expect(404)
                    .then(({ body }) => {
                        expect(body.message).to.equal('comment does not exist: 999');
                    });
            });
            it('400 bad request for invalid comment_id', () => {
                return request
                    .delete('/api/comments/tangerine')
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.message).to.equal('bad request');
                    });
            });
        });
        describe('invalid methods', () => {
            it('405 method not allowerd', () => {
                const invalidMethods = ['get', 'post', 'put'];
                const methodPromises = invalidMethods.map((method) => {
                    return request
                        [method]('/api/comments/1')
                        .expect(405)
                        .then(({ body }) => {
                            expect(body.message).to.equal('method not allowed');
                        });
                });
                return Promise.all(methodPromises);
            });
        });
    });

    describe('invalid endpoint', () => {
        it('404 not found', () => {
            return request
                .get('/menu/status')
                .expect(404)
                .then(({ body }) => {
                    expect(body.message).to.equal('not found');
                });
        });
    });
});
