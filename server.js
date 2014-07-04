var express = require('express'),
    path    = require('path'),
    logger  = require('morgan'),
    less    = require('less-middleware'),
    routes  = require('./routes'),
    app     = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(less(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

app.use(function(req, res, next) {
    var err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        title: err.message,
        error: err
    });
});

app.locals.pretty = true;

app.listen(app.get('port'));

console.log('App started on port ' + app.get('port'));

module.exports = app;
