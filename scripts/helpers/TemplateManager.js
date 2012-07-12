define(['jquery', 'handlebars'], function ($, Handlebars) {
	'use strict';
	
	// Template Manager module to handle dynamically loading templates from the server.
	// Depending on whether or not the templating lib of choice supports pre-compiling them
	// before they get cached, this can be a big performance booster over the built in
	// text loader from Require.js. In this case, "Handlebars", our templating library of choice
	// does support precompilation, so in the bigger scope of things, this approach may
	// be more performant than the text lib included with Require.js.
	var TemplateManager = {
	    templates: {},
	    get: function (id, callback) {
	        // If the template is already in the cache, just return it.
	        if (this.templates[id]) {
	            return callback.call(this, this.templates[id]);
	        }
	        // Otherwise, use Traffic Cop to load up the template.
	        var url = 'templates/' + id + '.html',
	            promise = $.trafficCop(url),
	            that = this;
	        promise.done(function (template) {
	            // Once loading is complete, compile and cache the template for later use.
	            var tmp = Handlebars.compile(template);
	            that.templates[id] = tmp;
	            callback.call(that, tmp);
	        });
	    }
	};

	return TemplateManager;
});