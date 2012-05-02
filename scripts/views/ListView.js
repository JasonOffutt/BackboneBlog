define(['jquery', 'underscore', 'backbone', 'handlebars', 'TemplateManager', 'SummaryView'], function($, _, Backbone, Handlebars, TemplateManager, SummaryView) {
	var ListView = Backbone.View.extend({
	    tagName: 'section',
	    className: 'posts',
	    template: 'blog',
	    initialize: function(options) {
	        this.ev = options.ev;
	        this.childViews = [];
	        var that = this;
	        this.model.forEach(function(post) {
	        	console.log(post);
	           	that.childViews.push(new SummaryView({ ev: this.ev, model: post }));
	        });
	    },
	    render: function() {
	    	var that = this;
	    	TemplateManager.get(this.template, function(tmp) {
	    		var html = tmp(that.model.toJSON());
		        that.$el.html(html);
		        _.forEach(that.childViews, function(view) {
		            view.render().$el.appendTo(that.$el);
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