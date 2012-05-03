define(['jquery', 'underscore', 'backbone', 'TemplateManager'], function($, _, Backbone, TemplateManager) {
	var DetailsView = Backbone.View.extend({
	    tagName: 'article',
	    className: 'post',
	    template: 'blogPost',
	    events: {
	        'click .edit': 'editClicked',
	        'click .delete': 'deleteClicked',
	        'click .back': 'backClicked'
	    },
	    initialize: function(options) {
	        this.ev = options.ev;
	    },
	    render: function() {
	        var that = this;
	        TemplateManager.get(this.template, function(tmp) {
	            var html = tmp(that.model.toJSON());
	            that.$el.html(html);
	        });
	        return this;
	    },
	    editClicked: function(e) {
	        var href = $(e.currentTarget).attr('href');
	        this.ev.trigger('post:edit', this.model.get('id'), href);
	        return false;
	    },
	    deleteClicked: function() {
	        if (confirm('Are you sure you want to delete "' + this.model.get('title') + '"?')) {
	            this.ev.trigger('post:delete', this.model.get('id'));
	        }
	        return false;
	    },
	    backClicked: function() {
	    	var href = $(e.currentTarget).attr('href');
	    	this.ev.trigger('post:list', null, href);
	    	return false;
	    }
	});

	return DetailsView;
});