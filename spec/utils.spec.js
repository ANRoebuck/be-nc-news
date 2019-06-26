const { expect } = require('chai');
const { formatDate, makeRefObj, formatComments } = require('../db/utils/utils');

describe('formatDate', () => {
    it('returns a new array', () => {
        const input = [];
        const expected = [];
        const actual = formatDate(input);
        expect(actual).to.eql(expected);
        expect(actual).not.to.equal(expected);
    });
    it('formats one object', () => {
        const input = [
        {title: 'Living in the shadow of a great man',
        created_at: 1542284514171},];
        const expected = [
        {title: 'Living in the shadow of a great man',
        created_at: (new Date(1542284514171))}];
        const actual = formatDate(input);
        expect(actual).to.eql(expected);
    });
    it('formats all objects', () => {
        const input = [
        {title: 'Living in the shadow of a great man',
        created_at: 1542284514171},
        {title: 'Sony Vaio; or, The Laptop',
        created_at: 1416140514171},
        {title: 'Eight pug gifs that remind me of mitch',
        created_at: 1289996514171}];
        const expected = [
        {title: 'Living in the shadow of a great man',
        created_at: (new Date(1542284514171))},
        {title: 'Sony Vaio; or, The Laptop',
        created_at: (new Date(1416140514171))},
        {title: 'Eight pug gifs that remind me of mitch',
        created_at: (new Date(1289996514171))}];
        const actual = formatDate(input);
        expect(actual).to.eql(expected);
    });
});

describe('makeRefObj', () => {
    it('returns an empty object, when passed an empty array', () => {
        const input = [];
        const actual = makeRefObj(input, 'name', 'address');
        const expected = {};
        expect(actual).to.eql(expected);
      });
      it('returns correct ojbect, when passed an array of one object', () => {
        const input = [{ name: 'vel', phoneNumber: '01134445566', address: 'Northcoders, Leeds' }];
        const actual = makeRefObj(input, 'name', 'phoneNumber');
        const expected = {vel: '01134445566'};
        expect(actual).to.eql(expected);
      });
      it('adds array of multiple entries to object', () => {
        const input = [
          { name: 'vel', phoneNumber: '01134445566', address: 'Northcoders, Leeds' },
          { name: 'ant', phoneNumber: '01612223344', address: 'Northcoders, Manchester' },
          { name: 'mitch', phoneNumber: '07777777777', address: null },
        ];
        const actual = makeRefObj(input, 'name', 'phoneNumber');
        const expected = {vel: '01134445566', ant: '01612223344', mitch: '07777777777'};
        expect(actual).to.eql(expected);
      });
});

describe('formatComments', () => {
    it('formats one comment', () => {
        const comments = [{
            created_by: 'bob',
            belongs_to: 'excellent article',
            body: 'some nonsense'
        }];
        const refObj = {
            'excellent article': 1,
            'terrible article': 2
        };
        const actual = formatComments(comments, refObj)
        const expected = [{
            author: 'bob',
            article_id:1,
            body: 'some nonsense'
        }];
        expect(actual).to.eql(expected);
    });
    it('formats all comments', () => {
        const comments = [
            {created_by: 'bob',
            belongs_to: 'excellent article',
            body: 'some nonsense'},
            {created_by: 'jim',
            belongs_to: 'terrible article',
            body: 'this is rubbish'},
            {created_by: 'kim',
            belongs_to: 'excellent article',
            body: 'excellent'}
        ];
        const refObj = {
            'excellent article': 1,
            'terrible article': 2
        };
        const actual = formatComments(comments, refObj)
        const expected = [
            {author: 'bob',
            article_id:1,
            body: 'some nonsense'},
            {author: 'jim',
            article_id:2,
            body: 'this is rubbish'},
            {author: 'kim',
            article_id:1,
            body: 'excellent'}
        ];
        expect(actual).to.eql(expected);
    });
});
