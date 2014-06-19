var fs       = require('fs'),
    request  = require('request'),
    cheerio  = require('cheerio'),
    xml2js   = require('xml2js').parseString;

exports.scrapeFeed = function(feed, cb) {
    request(feed, function(err, resp, html) {
        var $, rawData;

        if (err) { return cb(err); }

        $ = cheerio.load(html);
        rawData = unescape($('script').first().text().split("'")[1]);

        exports.parseFeed(rawData, function(err, data) {
            if (err) { return cb(err); }

            cb(null, data);
        });
    });
};

exports.parseFeed = function(feed, cb) {
    xml2js(feed, function(err, data) {
        if (err) { return cb(err); }

        exports.filterFeed(data, function(err, data) {
            if (err) { return cb(err); }

            cb(null, data);
        });
    });
};

exports.filterFeed = function(feed, cb) {
    return cb(null, feed);
};

exports.saveFeed = function(filename, feed, cb) {
    fs.writeFile(filename, JSON.stringify(feed, null, 4), function(err) {
        if (err) { return cb(err); }

        cb(null, feed);
    })
};
