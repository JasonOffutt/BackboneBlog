define(['jquery', 'underscore', 'backbone', 'TemplateManager'], function($, _, Backbone, TemplateManager) {
	var DetailsView = Backbone.View.extend({
	    tagName: 'article',
	    className: 'post',
	    template: 'blogPost',
	    events: {
	        'click .edit': 'editPost',
	        'click .delete': 'deletePost'
	    },
	    initialize: function(options) {
	        this.ev = options.ev;
	    },
	    render: function() {
	        var that = this;
	        TemplateManager.get(this.template, function(tmp) {
	            var html = _.template($(this.template).html(), that.model.toJSON());
	            that.$el.html(html);
	        });
	        return this;
	    },
	    editPost: function(e) {
	        var href = $(e.currentTarget).attr('href');
	        this.ev.trigger('post:edit', this.model.get('id'), href);
	        return false;
	    },
	    deletePost: function() {
	        if (confirm('Are you sure you want to delete "' + this.model.get('title') + '"?')) {
	            this.ev.trigger('post:delete', this.model.get('id'));
	        }
	        return false;
	    }
	});

	return DetailsView;
});