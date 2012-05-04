define(['jquery', 'underscore', 'backbone', 'handlebars', 'TemplateManager', 'SummaryView'], function($, _, Backbone, Handlebars, TemplateManager, SummaryView) {
	var ListView = Backbone.View.extend({
	    tagName: 'section',
	    className: 'posts',
	    template: 'blog',
	    initialize: function(options) {
	        this.ev = options.ev;
	        this.childViews = [];
	        var that = this;
	        this.model.sort().forEach(function(post) {
	           	that.childViews.push(new SummaryView({ ev: this.ev, model: post }));
	        });
	    },
	    render: function() {
	    	var that = this;
	    	TemplateManager.get(this.template, function(tmp) {
	    		var html = tmp(that.model.toJSON()), $ol;
		        that.$el.html(html);
		        $ol = that.$el.find('#blog-posts');
		        _.forEach(that.childViews, function(view) {
		            view.render().$el.appendTo($ol);
		        });
	    	});
	        
	        return this;
	    },
	    onClose: function() {
	        _.forEach(this.childViews, function(view) {
	            view.close();
	        });
	    }
	});

	return ListView;
});