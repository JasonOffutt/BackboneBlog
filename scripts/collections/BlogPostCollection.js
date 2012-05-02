define(['backbone'], function(Backbone) {
	var BlogPostCollection = Backbone.Model.extend({
	    model: SomeModel,
	    // Backbone will automatically sort a collection based on the result of this function.
	    // Alternatively, there are other sort methods that get delegated through to Underscore.
	    comparator: function(model) {
	        // Sort posts descending...
	        var date = model.get('dateCreated') || new Date(0);
	        return -date.getTime();
	    },
	    // Part of Backbone's server side magic comes from informing your models and collections
	    // of where they originate from. By setting the base url, we can just call `fetch()` on our
	    // models or collections, and Backbone will issue a `GET` request to that URL. Additionally,
	    // when we call things like `save()` and `destroy()` on models, Backbone will by default
	    // make a RESTful call with this URL as its base (e.g. - DELETE /posts/:id)
	    url: function() {
	        return '/posts';
	    }
	});

	return BlogPostCollection;
});