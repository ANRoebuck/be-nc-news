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
    it('', () => {
        const input = [
        {title: 'Living in the shadow of a great man',
        created_at: 1542284514171},
        {title: 'Sony Vaio; or, The Laptop',
        created_at: 1416140514171},
        {title: 'Eight pug gifs that remind me of mitch',
        created_at: 1289996514171}];
        const expected = [
        {title: 'Living in the shadow of a great man',
        created_at: 'Thu Nov 15 2018 12:21:54 GMT+0000 (Greenwich Mean Time)'},
        {title: 'Sony Vaio; or, The Laptop',
        created_at: 'Sun Nov 16 2014 12:21:54 GMT+0000 (Greenwich Mean Time)'},
        {title: 'Eight pug gifs that remind me of mitch',
        created_at: 'Wed Nov 17 2010 12:21:54 GMT+0000 (Greenwich Mean Time)'}];
        const actual = formatDate(input);
        expect(actual).to.eql(expected);
    });
});

describe('makeRefObj', () => {});

describe('formatComments', () => {});
