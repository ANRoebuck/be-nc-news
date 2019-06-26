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
    
    describe('/topics', () => {
        describe('GET', () => {
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
    });

    describe('/articles/:article_id', () => {
        describe('GET', () => {
            it('returns an article object', () => {
                return request
                    .get('/api/articles/1')
                    .expect(200)
                    .then(({ body }) => {
                        expect(body[0]).to.contain.keys('author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes', 'comment_count');
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
                    .expect(201)
                    .then(({ body }) => {
                        expect(body[0]).to.contain.keys('author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes', 'comment_count');
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
        });
    });

    describe('/articles/:article_id/comments', () => {
        describe('POST', () => {
            it('POSTs a comment', () => {
                const comment = {
                    body: 'One does not simply walk into Mordor',
                    username: 'butter_bridge'
                };
                return request
                    .post('/api/articles/1/comments')
                    .send(comment)
                    .expect(201)
                    .then(({ body }) => {
                        expect(body).to.include.keys('comment_id', 'author', 'article_id', 'votes', 'body', 'created_at');
                    });
            });
            it('POSTs 400 bad request for non-existent but valid article_id', () => {
                const comment = {
                    body: 'One does not simply walk into Mordor',
                    username: 'butter_bridge'
                };
                return request
                    .post('/api/articles/12345/comments')
                    .send(comment)
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.message).to.equal('bad request')
                    });
            });
            it('POSTs 400 bad request for invalid article_id', () => {
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
            it('POSTs 400 bad request for invalid comment', () => {
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
                    .then(({ body }) => {
                        expect(body).to.be.an('array');
                        expect(body[0]).to.have.keys('comment_id', 'votes', 'created_at', 'author', 'body');
                    })
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
            it('QUERY sort by any column', () => {
                return request
                    .get('/api/articles/1/comments?sort_by=author')
                    .expect(200)
                    .then(({ body }) => {
                        expect(body).to.be.sortedBy('author');
                    });
            });
            it('QUERY default sort by created_at', () => {
                return request
                    .get('/api/articles/1/comments')
                    .expect(200)
                    .then(({ body }) => {
                        expect(body).to.be.sortedBy('created_at');
                    });
            });
            it('QUERY order asc/desc', () => {
                return request
                    .get('/api/articles/1/comments?sort_by=votes&order=desc')
                    .expect(200)
                    .then(({ body }) => {
                        expect(body).to.be.sortedBy('votes', { descending: true });
                    });
            });
        });
    });

    describe('/articles', () =>{
        describe('GET', () =>{
            it('returns all articles', () =>{
                return request
                    .get('/api/articles')
                    .expect(200)
                    .then( ({ body })  => {
                        expect(body).to.be.an('array');
                        expect(body[0]).to.contain.keys('author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes', 'comment_count');
                    });
            });
            it('QUERY sorts by given column, defaults ascending', () => {
                return request
                    .get('/api/articles?sort_by=title')
                    .expect(200)
                    .then(({ body }) => {
                        expect(body).to.be.sortedBy('title');
                    });
            });
            it('QUERY order asc/desc', () => {
                return request
                    .get('/api/articles?sort_by=title&order=desc')
                    .expect(200)
                    .then(({ body }) => {
                        expect(body).to.be.sortedBy('title', { descending: true });
                    });
            });
            it('QUERY filter by author', () => {
                return request
                    .get('/api/articles?author=butter_bridge')
                    .expect(200)
                    .then(({ body }) => {
                        const test = body.every(article => (article.author==='butter_bridge'))
                        expect(test).to.equal(true);
                    });
            });
            it('QUERY filter by topic', () => {
                return request
                    .get('/api/articles?topic=mitch')
                    .expect(200)
                    .then(({ body }) => {
                        const test = body.every(article => (article.topic==='mitch'))
                        expect(test).to.equal(true);
                    });
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
                    .expect(201)
                    .then(({ body }) => {
                        expect(body[0]).to.contain.keys('comment_id', 'author', 'article_id', 'votes', 'created_at', 'body');
                    });
            });
            it('updates a comment with negative', () => {
                const vote = { inc_votes: -5 };
                return request
                    .patch('/api/comments/1')
                    .send(vote)
                    .expect(201)
                    .then(({ body }) => {
                        expect(body[0]).to.contain.keys('comment_id', 'author', 'article_id', 'votes', 'created_at', 'body');
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
    });

});

describe('invalid endpoint', () => {
    it('404 not found', () => {
        return request
            .get('/menu/status')
            .expect(404)
            .then(({ body }) => {
                expect(body.message).to.equal('not found');
            })
    })
})