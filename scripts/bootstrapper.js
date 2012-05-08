// Configuring Require.js to know about the following modules. Doing this allows us to
// reference these modules by name, rather than typing in the path over and over.
require.config({
	paths: {
		jquery: 				'vendor/jquery/jquery-1.7.2.min',
		underscore: 			'vendor/underscore/underscore.require',
		backbone: 				'vendor/backbone/backbone.require',
		handlebars: 			'vendor/handlebars/handlebars-1.0.0.beta2.min',
		json: 					'vendor/json/json.require',
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

// Call to Require.js's `require` function. This will load all the dependencies in the array that's
// passed in as the first argument. Using the Require.js `order` plugin on the initial module loads
// to ensure they get injected onto the page in the right order.
require([ 'order!jquery', 'order!underscore', 'order!backbone', 'order!Extensions', 'order!BlogPostCollection', 'order!BlogRouter' ], 
	
	// Callback function that will fire once all of the above dependencies are loaded. The argument
	// list should appear in the same order as the array above.
	function($, _, Backbone, Extensions, BlogPostCollection, BlogRouter) {
		
		// Shorthand for jQuery $(document).ready()
		$(function() {

			// In `helpers/Extensions.js` there are some extensions to Backbone and a jQuery plugin
			// that need to be initialized.
			Extensions.init();

			// Making a clone of Backbone.Events to serve as an event aggregator for our app
			var eventAggregator = _.extend({}, Backbone.Events),
				posts = new BlogPostCollection(),

				// Call `fetch()` on our BlogPostCollection to load the posts. `fetch()` delegates
				// to `Backbone.sync()`, which returns a promise...
				promise = posts.fetch(),
				router;

			// So we can add a callback to it and wire up our app as soon as the Blog Posts are fully loaded.
			promise.done(function() {
				router = new BlogRouter({ ev: eventAggregator, model: posts });
				Backbone.history.start();
			})
		});
	});