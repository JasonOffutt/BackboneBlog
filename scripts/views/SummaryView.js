define(['jquery', 'underscore', 'backbone', 'handlebars', 'TemplateManager'], function ($, _, Backbone, Handlebars, TemplateManager) {
	'use strict';
	
	// Summary view of a blog post. Title, excerpt, author, date, etc...
	var SummaryView = Backbone.View.extend({
	    tagName: 'li',
	    className: 'post',
	    template: 'postSummary',
	    events: {
	        'click .view': 'viewPost'
	    },
	    initialize: function (options) {
	        this.ev = options.ev;
	        _.bindAll(this);
	        this.model.on('change', this.onUpdated);
	        this.model.on('remove', this.close);
	    },
	    // Note that in `render`, we're NOT actually injecting the view's contents into the DOM.
	    // That will be handled by our presenter.
	    // The benefit of this approach is that the view is now decoupled from the DOM
	    render: function (callback) {
	        // Use template loader to do this part. This can come in handy if you need to load up
	        // `n` Summary views nested inside a List view. TemplateManager and Traffic Cop will
	        // throttle the amount of traffic that's actually sent to the server, and provide a
	        // boost in performance.
	        var that = this;
	        TemplateManager.get(this.template, function (tmp) {
	            var html = tmp(that.model.toJSON());
	            that.$el.html(html);
	            that.onRenderComplete(callback);
	        });
	        return this;
	    },
	    viewPost: function (e) {
	        var href = $(e.currentTarget).attr('href');
	        this.ev.trigger('post:view', this.model.get('id'), href);
	        return false;
	    },
	    onUpdated: function () {
	        // Re-render the view when the model's state changes
	        this.render();
	    },
	    onClose: function () {
	        // Unbind events from model on close to prevent memory leaks.
	        this.model.off('change destroy');
	    }
	});

	return SummaryView;
});