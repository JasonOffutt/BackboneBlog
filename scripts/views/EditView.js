define(['jquery', 'underscore', 'backbone', 'TemplateManager'], function ($, _, Backbone, TemplateManager) {
	'use strict';

	var EditView = Backbone.View.extend({
	    tagName: 'section',
	    className: 'post',
	    template: 'editPost',
	    events: {
	        'click .btn-success': 'saveClicked',
	        'click .cancel': 'cancelClicked',
	        'click .btn-danger': 'deleteClicked'
	    },
	    initialize: function (options) {
	        this.ev = options.ev;
	        _.bindAll(this);
	    },
	    render: function (callback) {
	        var that = this;
	        TemplateManager.get(this.template, function (tmp) {
	            var html = tmp(that.model.toJSON());
	            that.$el.html(html);
	            that.onRenderComplete(callback);
	        });
	        return this;
	    },
	    saveClicked: function (e) {
	        var attrs = {
	            title: this.$el.find('#title').val(),
	            content: this.$el.find('#content').val(),
	            postDate: this.$el.find('#postDate').val(),
	            author: this.$el.find('#author').val()
	        };
	        this.ev.trigger('post:save', attrs, this.model);
	        return false;
	    },
	    cancelClicked: function (e) {
	    	var href = $(e.currentTarget).attr('href');
	        this.ev.trigger('post:list', null, href);
	        return false;
	    },
	    deleteClicked: function () {
	    	if (confirm('Are you sure you want to delete "' + this.model.get('title') + '"?')) {
	            this.ev.trigger('post:delete', this.model);
	        }
	        return false;
	    }
	});

	return EditView;
});