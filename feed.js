var fs       = require('fs'),
    path     = require('path'),
    _        = require('underscore'),
    request  = require('request'),
    cheerio  = require('cheerio'),
    xml2js   = require('xml2js').parseString;

exports.scrape = function(feed, cb) {
    request(feed, function(err, resp, html) {
        var $, rawData;

        if (err) { return cb(err); }

        $ = cheerio.load(html);
        rawData = unescape($('script').first().text().split("'")[1]);

        exports.parse(rawData, function(err, data) {
            if (err) { return cb(err); }

            cb(null, data);
        });
    });
};

exports.parse = function(feed, cb) {
    xml2js(feed, function(err, data) {
        if (err) { return cb(err); }

        exports.filter(data, function(err, data) {
            if (err) { return cb(err); }

            cb(null, data);
        });
    });
};

exports.filter = function(feed, cb) {
    var uid   = exports.getId(feed),
        clean = [];

    _.forEach(_.first(feed.channel_guide.schedule).week, function(week) {

        _.forEach(week.day, function(day) {
            var date = {
                date: day.$.date,
                matches: []
            };

            _.forEach(day.episode, function(match) {
                if (_.first(match.series).$.id === uid && !_.isEmpty(_.first(match.title))) {
                    date.matches.push(exports.clean_match_data(match));
                }
            });

            if (!_.isEmpty(date.matches)) {
                clean.push(date);
            }
        });
    });

    cb(null, clean);
};

exports.save = function(filename, feed, cb) {
    var file = path.join(__dirname, 'public/') + filename;

    fs.writeFile(file, JSON.stringify(feed), function(err) {
        if (err) { return cb(err); }

        cb(null, feed);
    });
};

exports.getId = function(feed) {
    var category = _.filter(_.first(feed.channel_guide['series-descriptions']).series, function(series) {
        return series.$.category === 'AFL';
    });

    return _.first(category).$.id;
};

exports.clean_match_data = function(match) {
    var data = {
        title: _.first(match.title),
        duration: _.first(match.duration).$.minutes,
        time: _.first(_.first(match["show-time"]).eastern).$,
        status: _.first(match["show-time"]).$.live
    };

    delete match["$"];
    delete match["title"];
    delete match["description"];
    delete match["series"];
    delete match["content-rating"];
    delete match["duration"];
    delete match["show-time"];

    return _.extend(match, data);
};
