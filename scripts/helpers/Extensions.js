define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
	var extendView = function() {
			Backbone.View.prototype.close = function() {
		    this.remove();
		    this.unbind();
		    if (typeof this.onClose === 'function') {
		        this.onClose.call(this);
		    }
		};
	},
	extendSync = function() {
		Backbone.sync = function(method, model) {
			var dfd = $.Deferred();
			return dfd.resolve();
		};
	},
	initTrafficCop = function() {
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