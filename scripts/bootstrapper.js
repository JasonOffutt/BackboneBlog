require.config({
	paths: {
		jquery: 				'vendor/jquery/jquery-1.7.2.min',
		underscore: 			'vendor/underscore/underscore.require',
		backbone: 				'vendor/backbone/backbone.require',
		BlogPost: 				'models/BlogPost', 
		BlogPostCollection: 	'collections/BlogPostCollection',
		BlogRouter: 			'routers/BlogRouter',
		BlogPresenter: 			'presenters/BlogPresenter'
	}
});

require([ 'jquery', 'underscore', 'backbone', 'BlogPostCollection', 'BlogPostRouter' ], 
	function($, _, Backbone, BlogPostCollection, BlogRouter) {
		$(function() {
			var eventAggregator = _.extend({}, Backbone.Events),
				posts = new BlogPostCollection(),
				promise = posts.fetch(),
				router;

			promise.done(function() {
				router = new BlogRouter({ev: eventAggregator, model: posts});
				Backbone.history.start();
			})
		});
	});