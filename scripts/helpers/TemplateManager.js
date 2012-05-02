define(['jquery', 'handlebars'], function($) {
	var TemplateManager = {
	    templates: {},
	    get: function(id, callback) {
	        // If the template is already in the cache, just return it.
	        if (this.templates[id]) {
	            return callback.call(this, this.templates[id]);
	        }
	        // Otherwise, use Traffic Cop to load up the template.
	        var url = 'templates/' + id + '.html',
	            promise = $.trafficCop(url),
	            that = this;
	        promise.done(function(template) {
	            // Once loading is complete, cache the template. Optionally,
	            // if it's supported by the templating engine, you can pre-compile
	            // the template before it gets cached.
	            that.templates[id] = template;
	            callback.call(that, template);
	        });
	    }
	};

	return TemplateManager;
});