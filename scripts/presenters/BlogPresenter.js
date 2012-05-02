define(['jquery', 'underscore', 'backbone', 'DetailsView', 'EditView', 'ListView', 'SummaryView'], 
	function($, _, Backbone, DetailsView, EditView, ListView, SummaryView) {
		// Using the notion of a Presenter rather than a Controller. Doing things this way allows us to
		// completely decouple views from the DOM. As long as the Presenter has a reference to jQuery,
		// it will be testable independently from views.
		var BlogPresenter = function(options) {
		    this.ev = options.ev;
		    this.$container = $('#blogContainer');

		    // Bind all events in here...
		    // Events bound to aggregator are namespaced on type and action (e.g. - 'foo:save').
		    // This becomes super helpful when you've got several different Model types to worry
		    // about binding events to.
		    _.bindAll(this);
		    this.ev.on('post:list', this.index);
		    this.ev.on('post:view', this.showPost);
		    this.ev.on('post:delete', this.deletePost);
		    this.ev.on('post:edit', this.editPost);
		    this.ev.on('post:save', this.savePost);
		};

		// Presents a uniform function for injecting Views into the DOM. This allows us to manage
		// DOM manipulation in a single place.
		BlogPresenter.prototype.showView = function(view) {
		    if (this.currentView) {
		        // Call `close()` on the current view to clean up memory. Removes elements from DOM
		        // and will unbind any event listeners on said DOM elements and references to Models
		        // or Collections that are currently loaded in memory.
		        this.currentView.close();
		    }
		    this.currentView = view;
		    this.$container.append(this.currentView.render().$el);
		};

		BlogPresenter.prototype.showIndex = function() {
		    var listView = new ListView({ ev: this.ev, model: this.model });
		    this.showView(listView);
		};

		BlogPresenter.prototype.showPost = function(id) {
		    var model = this.model.get(id);
		    var detailsView = new DetailsView({ ev: this.ev, model: model });
		    this.showView(detailsView);
		};

		BlogPresenter.prototype.deletePost = function(id) {
		    var post = this.model.get(id),
		        promise = post.destroy();
		    promise.done(function() {
		        this.ev.trigger('post:destroyed');
		    });
		};

		BlogPresenter.prototype.editPost = function(id) {
		    var post = this.model.get(id),
		        editView = new EditView({ ev: this.ev, model: post });
		    this.showView(editView);
		};

		BlogPresenter.prototype.savePost = function(attrs, post) {
		    // `save` will first call `validate`. If `validate` is successful, it will call
		    // `Backbone.sync`, which returns a jQuery promise, that can be used to bind callbacks
		    // to fire additional events when the operation completes.
		    var promise = post.save(attrs);
		    if (promise) {
		        promise.done(function() {
		            // Do something now that the save is complete
		        });
		    } else {
		        
		    }
		}

		return BlogPresenter;
	});