var express = require('express'),
    request = require('request'),
    cheerio = require('cheerio'),
    xml2js  = require('xml2js').parseString,
    fs      = require('fs'),
    app     = express();

var parseFeed = function(feed) {
    return feed;
};

app.get('/feed', function(req, res) {
    request('http://foxsoccerplus.com/tvfeed/', function(err, resp, html) {
        var $, rawData;

        if (!err) {
            $ = cheerio.load(html);
            rawData = unescape($('script').first().text().split("'")[1]);

            xml2js(rawData, function (err, data) {
                if (!err) {
                    res.set('Content-Type', 'application/json');
                    res.send(parseFeed(data));
                } else {
                    console.error(err);
                }
            });
        } else {
            console.error(err);
        }
    });
});

app.get('/', function(req, res) {
    res.send('In progress, visit /feed data');
});

app.listen('1337');

console.log('App started on port 1337');

exports = module.exports = app;
