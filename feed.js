var fs     = require('fs'),
    xml2js = require('xml2js').parseString,
    pub    = {};

pub.parseFeed = function(feed, cb) {
    xml2js(feed, function(err, data) {
        if (!err) {
            cb(pub.filterFeed(data));
        } else {
            console.error(err);
        }
    });
};

pub.filterFeed = function(feed) {
    return feed;
};

pub.saveFeed = function(feed) {
    var fileName = 'feed.json';

    fs.writeFile(fileName, JSON.stringify(feed, null, 4), function(err) {
        if (!err) {
            console.log('Feed saved to ' + fileName + '.');
        } else {
            console.error(err);
        }
    })
};

module.exports = pub;
