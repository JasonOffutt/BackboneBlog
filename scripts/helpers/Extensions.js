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
		},
		extendSync = function() {
			
			// Overriding `Backbone.synd()` here to use HTML5 local storage rather than sending
			// the call out to a server.
			Backbone.sync = function(method, model) {
				// Wrapping load operations for local storage API in a jQuery Deferred to preserve
				// the interface of `sync`. Generally, you can expect to receive back the expression
				// result of `$.ajax` (which in jQuery >= 1.5 is a promise).
				var dfd = $.Deferred();
				return dfd.resolve([]);
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