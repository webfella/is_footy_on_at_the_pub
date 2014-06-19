var express  = require('express'),
    async    = require('async'),
    feed     = require('./feed'),
    app      = express(),
    port     = '1337';

app.get('/scrape', function(req, res, next) {
    var externalFeed = 'http://foxsoccerplus.com/tvfeed/',
        localFeed    = 'feed.json';

    async.waterfall([
        feed.scrape.bind(null, externalFeed),
        feed.save.bind(null, localFeed)
        ], function(err, data) {
            if (err) { return next(err); }
            res.json(data);
    });
});

app.get('/', function(req, res) {
    res.send('In progress, visit /feed.json for data');
});

app.listen(port);

console.log('App started on port ' + port);

module.exports = app;
