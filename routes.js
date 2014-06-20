var express = require('express'),
    async   = require('async'),
    feed    = require('./feed'),
    router  = express.Router();

router.get('/', function(req, res) {
    res.render('index', {
        title: 'Is Footy on at the pub?',
        heading: 'A guide to when the AFL is showing on Fox Soccer'
    });
});

router.get('/scrape', function(req, res, next) {
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

module.exports = router;
