require.config({
	paths: {
		jquery: 				'vendor/jquery/jquery-1.7.2.min',
		underscore: 			'vendor/underscore/underscore.require',
		backbone: 				'vendor/backbone/backbone.require',
		handlebars: 			'vendor/handlebars/handlebars-1.0.0.beta2.min.js',
		Extensions: 			'helpers/Extensions',
		TemplateManager: 		'helpers/TemplateManager',
		BlogPost: 				'models/BlogPost', 
		BlogPostCollection: 	'collections/BlogPostCollection',
		BlogRouter: 			'routers/BlogRouter',
		BlogPresenter: 			'presenters/BlogPresenter',
		DetailsView: 			'views/DetailsView',
		EditView: 				'views/EditView',
		ListView: 				'views/ListView',
		SummaryView: 			'views/SummaryView'
	}
});

require([ 'jquery', 'underscore', 'backbone', 'Extensions', 'BlogPostCollection', 'BlogRouter' ], 
	function($, _, Backbone, Extensions, BlogPostCollection, BlogRouter) {
		$(function() {
			Extensions.init();
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