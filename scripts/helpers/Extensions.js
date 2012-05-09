define(['jquery', 'json', 'underscore', 'backbone'], function($, JSON, _, Backbone) {
	var extendView = function() {
			
			// Add a `close` utility method to Backbone.View to serve as a wrapper for `remove`, and `unbind`.
			// This allows a view to clean up after itself by removing its DOM elements, unbind any events, and
			// call an `onClose` method in case any additional cleanup needs to happen (e.g. - unbinding any
			// events explicitly bound to the model or event aggregator).
			Backbone.View.prototype.close = function() {
			    this.remove();  // Removes the DOM representation of the View
			    this.unbind();  // Unbinds any DOM events associated with the View
			    if (typeof this.onClose === 'function') {
			        
			    	// Call onClose if it's defined on the view. This lets us unbind any events
			    	// and do any extra cleanup that tie the View to anything else (models,
			    	// collections, child views, etc)
			        this.onClose.call(this);
			    }
			};
		},
		// Creating a little helper here to populate the blog when it gets loaded for the first time
		hydrateBlog = function() {
			var posts = [],
				title,
				id;
			
			// Create 5 new blog posts and add them to an array.
			for (var i = 0; i < 5; i++) {
				id = i + 1;
				posts.push({
					id: id,
					title: "I'm serious as a heart attack",
					content: "You think water moves fast? You should see ice. It moves like it has a mind. Like it knows it killed the world once and got a taste for murder. After the avalanche, it took us a week to climb out. Now, I don't know exactly when we turned on each other, but I know that seven of us survived the slide... and only five made it out. Now we took an oath, that I'm breaking now. We said we'd say it was the snow that killed the other two, but it wasn't. Nature is lethal but it doesn't hold a candle to man.",
					author: 'Samuel L. Ipsum',
					postDate: new Date()
				});
			}

			// Stuff the array into local storage on the browser.
			localStorage.setItem('backboneBlog', JSON.stringify(posts));
			return posts;
		},
		extendSync = function() {
			
			// Overriding `Backbone.synd()` here to use HTML5 local storage rather than sending
			// the call out to a server.
			Backbone.sync = function(method, model, options) {
				// Wrapping load operations for local storage API in a jQuery Deferred to preserve
				// the interface of `sync`. Generally, you can expect to receive back the expression
				// result of `$.ajax` (which in jQuery >= 1.5 is a promise). See additional notes
				// for return statement below.
				var dfd = $.Deferred(),
					posts = JSON.parse(localStorage.getItem('backboneBlog')) || hydrateBlog();

				// The `method` Backbone passes in will be 'create', 'read', 'update', or 'delete'.
				// We're really only concerned about creates and deletes here...
				if (method === 'create') {
					// Find the highest vaue in the 'id' property and increment it.
					var newest = _.max(posts, function(p) {
							return p.id;
						}),
						id = posts.length;

					if (newest && newest.id) {
						id = newest.id;
					}

					console.log(id);
					model.set({ id: ++id }, { silent: true });
				} else if (method === 'delete') {
					// Find the first post with the same id and remove it from the list of posts
					var post = _.find(posts, function(p) {
						return p.id === model.get('id');
					});
					posts.pop(post);
				}

				// If the method is any thing but 'read', we need to write our changes to local storage.
				if (method !== 'read') {
					if (model.collection) {
						posts = model.collection.toArray();	
					}
					
					localStorage.setItem('backboneBlog', JSON.stringify(posts));
				}
				
				// Most of the native Backbone pieces that pass through calls to `sync` will pass along
				// success and error callbacks.
				if (typeof options.success === 'function') {
					if (model instanceof Backbone.Model) {
						options.success(model);
					} else {
						options.success(posts);
					}
				}

				// Pass through the jQuery deferred object so callbacks can be appended to it.
				// Backbone expects this behavior. The native `sync` method returns the result of
				// an `$.ajax()` call (e.g. - `return $.ajax(options);`). Since jQuery ajax uses
				// deferreds under the covers, we can mock its behavior by using them here, even
				// though it's not necessarily needed.
				return dfd.resolve(posts);
			};
		},
		initTrafficCop = function() {

			// Traffic Cop jQuery plugin to marshall requests being sent to the server.
			// (found here: https://github.com/ifandelse/TrafficCop)
			// You can optionally modify `Backbone.sync` to use this plugin over `$.ajax`
			// or just use it for other utility functions (bootstrapping data, loading
			// external Underscore/Mustache/Handlebars templates, etc.

			// Requests are cached in here by settings value. If the cached request already
			// exists, append the callback to the cached request rather than making a second
			// one. This will prevent race conditions when loading things rapid fire from
			// the server.
			var inProgress = {};
			$.trafficCop = function(url, options) {
			    var reqOptions = url, 
			        key;
			    if(arguments.length === 2) {
			        reqOptions = $.extend(true, options, { url: url });
			    }
			    key = JSON.stringify(reqOptions);
			    if (key in inProgress) {
			        for (var i in {success: 1, error: 1, complete: 1}) {
			            inProgress[key][i](reqOptions[i]);
			        }
			    } else {
			        // Ultimately, we just wrap `$.ajax` and return the promise it generates.
			        inProgress[key] = $.ajax(reqOptions).always(function () { delete inProgress[key]; });
			    }
			    return inProgress[key];
			};
		};

	// Return an object as our Require.js module, with an `init()` wrapper to wire up all our tweaks
	return {
		init: function() {
			extendView();
			extendSync();
			initTrafficCop();
		}
	};
});