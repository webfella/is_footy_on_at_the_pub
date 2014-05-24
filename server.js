var express  = require('express'),
    request  = require('request'),
    cheerio  = require('cheerio'),
    feedUtil = require('./feed'),
    app      = express();

app.get('/scrape', function(req, res) {
    request('http://foxsoccerplus.com/tvfeed/', function(err, resp, html) {
        var $, rawData;

        if (!err) {
            $ = cheerio.load(html);
            rawData = unescape($('script').first().text().split("'")[1]);

            feedUtil.parseFeed(rawData, function(data) {
                feedUtil.saveFeed(data);
                res.json(data);
            });
        } else {
            console.error(err);
            res.json(504, { error: 'Unable to access FoxSoccer feed, please try again later.' });
        }
    });
});

app.get('/', function(req, res) {
    res.send('In progress, visit /feed.json for data');
});

app.listen('1337');

console.log('App started on port 1337');

module.exports = app;
