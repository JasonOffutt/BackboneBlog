define(['underscore', 'backbone', 'BlogPresenter'], function(_, Backbone, BlogPresenter) {
	// This is a router and only a router. Using it as a Controller generally leads to problems
	// in a larger scale app. If you delegate handling actual application logic to a Presenter
	// or a 'real' Controller object, you will generally have an easier time keeping things strait
	// as your project grows and/or requirements change.
	var BlogRouter = Backbone.Router.extend({
	    routes: {
	        '': 'index',
	        'post/:id': 'post',
	        'post/:id/edit': 'edit',
	        '*options': 'index'  // Catchall route
	    },
	    initialize: function(options) {
	        this.ev = options.ev;
	        this.presenter = new BlogPresenter({ ev: this.ev, model: this.model });

	        // Listen for these post events and update URL/browser history accordingly
	        _.bindAll(this);
	        this.ev.on('post:list post:view post:edit', this.navigateTo);
	    },
	    index: function() {
	        this.presenter.showIndex();
	    },
	    post: function(id) {
	        this.presenter.showPost(id);
	    },
	    edit: function(id) {
	        this.presenter.showEdit(id);
	    },
	    navigateTo: function(id, uri) {
	        // Update the URL hash and browser history
	        this.navigate(uri, true);
	    }
	});

	return BlogRouter;
});