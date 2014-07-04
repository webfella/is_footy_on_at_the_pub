var App = App || (function($) {

    var pub = {};

    var match = Backbone.Model.extend({
        initialize: function() {
            this.currentIndex = 1;
        },
        setIndex: function(i) {
            this.currentIndex = i;
        }
    });

    var matches = Backbone.Collection.extend({
        model: match,
        url: '/matches.json',
        setModel: function(i) {
            pub.match.set(this.get('c' + i).attributes);
            pub.match.setIndex(i);
        },
        prev: function() {
            var currentIndex = pub.match.currentIndex,
                index = currentIndex > 1 ? currentIndex - 1 : 1;

            this.setModel(index);
        },
        next: function() {
            var currentIndex = pub.match.currentIndex,
                limit = this.models.length,
                index = currentIndex < limit ? currentIndex + 1 : limit;

            this.setModel(index);
        }
    });

    var guide = Backbone.View.extend({
        tagName: 'table',
        events: {
            'click .prev': 'prev',
            'click .next': 'next'
        },
        initialize: function() {
            _.bindAll(this, 'render');
            this.model.bind('change', this.render);

            this.template = _.template($('#guide-template').html())
        },
        render: function() {
            var data = _.extend({}, this.model.toJSON(), pub.viewHelpers),
                content = this.template(data);

            this.$el.html(content);
            return this;
        },
        prev: function() {
            this.collection.prev();
        },
        next: function() {
            this.collection.next();
        }
    });

    pub.viewHelpers = {
        format_date: function(date) {
            return moment(date, 'YYYYMMDD').format('dddd, MMMM Do YYYY');
        },
        format_time: function(time, duration) {
            var game = moment({hour: time.hour, minute: time.minute}),
                format = 'h:mma';

            return game.format(format) + ' - ' + game.add('minutes', duration).format(format);
        }
    };

    pub.init = function() {
        pub.matches = new matches();
        pub.matches.fetch({
            success: function(collection) {
                pub.match = new match(_.first(collection.models).attributes);
                pub.guide = new guide({
                    model: pub.match,
                    collection: collection
                });

                $('#guide').append(pub.guide.render().el);
            }
        });
    };

    return pub;

}(jQuery));

jQuery(function() {
    App.init();
});
