define(['jquery', 'json', 'underscore', 'backbone'], function($, JSON, _, Backbone) {
	var extendView = function() {
			
			// Add a `close` utility method to Backbone.View to serve as a wrapper for `remove`, and `unbind`.
			// This allows a view to clean up after itself by removing its DOM elements, unbind any events, and
			// call an `onClose` method in case any additional cleanup needs to happen (e.g. - unbinding any
			// events explicitly bound to the model or event aggregator).
			Backbone.View.prototype.close = function() {
			    this.remove();
			    this.unbind();
			    if (typeof this.onClose === 'function') {
			        this.onClose.call(this);
			    }
			};
		}
		hydrateBlog = function() {
			var posts = [],
				title,
				id;
			for (var i = 0; i < 5; i++) {
				id = i + 1;
				posts.push({
					id: id,
					title: "I'm serious as a heart attack",
					content: "You think water moves fast? You should see ice. It moves like it has a mind. Like it knows it killed the world once and got a taste for murder. After the avalanche, it took us a week to climb out. Now, I don't know exactly when we turned on each other, but I know that seven of us survived the slide... and only five made it out. Now we took an oath, that I'm breaking now. We said we'd say it was the snow that killed the other two, but it wasn't. Nature is lethal but it doesn't hold a candle to man.",
					author: 'Ima Testguy',
					postDate: new Date()
				});
			}
			localStorage.setItem('backboneBlog', JSON.stringify(posts));
			return posts;
		},
		extendSync = function() {
			
			// Overriding `Backbone.synd()` here to use HTML5 local storage rather than sending
			// the call out to a server.
			Backbone.sync = function(method, model, options) {
				// Wrapping load operations for local storage API in a jQuery Deferred to preserve
				// the interface of `sync`. Generally, you can expect to receive back the expression
				// result of `$.ajax` (which in jQuery >= 1.5 is a promise).
				var dfd = $.Deferred(),
					posts = JSON.parse(localStorage.getItem('backboneBlog')) || hydrateBlog();

				switch (method) {
					case 'read':
						//posts = JSON.parse(localStorage.getItem('backboneBlog')) || hydrateBlog();
						break;
					case 'create':
						//posts.push(model.toJSON());
						console.log('adding new post');
						break;
					case 'update':
						console.log('updating post');
						break;
					case 'delete':
						console.log('deleting post');
						break;
				}

				if (method !== 'read') {
					localStorage.setItem('backboneBlog', JSON.stringify(posts));
				}
				
				// Most of the native Backbone pieces that pass through calls to `sync` will pass along
				// success and error callbacks.
				if (typeof options.success === 'function') {
					options.success(posts);
				}

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

	return {
		init: function() {
			extendView();
			extendSync();
			initTrafficCop();
		}
	};
});