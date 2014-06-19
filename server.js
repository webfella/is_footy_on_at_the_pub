var express  = require('express'),
    async    = require('async'),
    feed     = require('./feed'),
    app      = express();

app.get('/scrape', function(req, res, next) {
    var externalFeed = 'http://foxsoccerplus.com/tvfeed/',
        localFeed    = 'feed.json';

    async.waterfall([
        feed.scrapeFeed.bind(null, externalFeed),
        feed.saveFeed.bind(null, localFeed)
        ], function(err, data) {
            if (err) { return next(err); }
            res.json(data);
    });
});

app.get('/', function(req, res) {
    res.send('In progress, visit /feed.json for data');
});

app.listen('1337');

console.log('App started on port 1337');

module.exports = app;
