define(['jquery', 'underscore', 'backbone', 'TemplateManager'], function($, _, Backbone, TemplateManager) {
	var EditView = Backbone.View.extend({
	    tagName: 'section',
	    className: 'post',
	    template: 'editPost',
	    events: {
	        'click .save': 'saveClicked',
	        'click .cancel': 'cancelClicked'
	    },
	    initialize: function(options) {
	        this.ev = options.ev;
	        _.bindAll(this);
	    },
	    render: function() {
	        var that = this;
	        TemplateManager.get(this.template, function(tmp) {
	            var html = tmp(that.model.toJSON());
	            that.$el.html(html);
	        });
	        return this;
	    },
	    saveClicked: function(e) {
	        var attrs = {
	            title: this.$el.find('#title').val(),
	            content: this.$el.find('#content').val(),
	            postDate: this.$el.find('#postDate').val()
	        };
	        this.el.trigger('post:save', attrs, this.model);
	        return false;
	    },
	    cancelClicked: function(e) {
	    	var href = $(e.currentTarget).attr('href');
	        this.ev.trigger('post:list', null, href);
	        return false;
	    }
	});

	return EditView;
});