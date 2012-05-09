define(['backbone'], function(Backbone) {
    // Models will house domain specific functionality. They should know how to do thing that are 
    // within their domain, authorize and validate themselves. Application logic, however, ought
    // to be pushed out to the Presenter.
    var BlogPost = Backbone.Model.extend({
        initialize: function(options) {
            this.setExcerpt();
            this.setDisplayDate();
            _.bindAll(this);
            this.on('change:content', this.setExcerpt);
            this.on('change:postDate', this.setDisplayDate);
        },
        setExcerpt: function() {
            var content = this.get('content') || '';
            if (content.length > 140) {
                this.set({ excerpt: content.substring(0, 137) + '...' }, { silent: true });
            } else {
                this.set({ excerpt: content }, { silent: true });
            }
        },
        setDisplayDate: function() {
            var date = new Date(this.get('postDate'));
            if (date) {
                this.set({ displayDate: date.toLocaleDateString() }, { silent: true });
            }
        },
        // Per Backbone's docs, `validate` should only return something if there is a validation error.
        // If so, I've found it useful to return an array of hashes with the key equaling the property
        // that threw an error. That way it can later be accessed via indexer.
        // `validate is` fired when you call `set`, `save` and `isValid` on a model. If it fails, it will
        // generally fail silently. So there's no need to wrap it in an `if` check... see `save` method
        // presenter for example usage.
        validate: function(options) {
            this.modelErrors = null;
            var errors = [];

            // First we need to check if any of these required fields are present in the opbions object.
            // If so, and they're not set (falsy), then we can add an error to the list.
            if (typeof options.content !== 'undefined' && !options.content) {
                errors.push({ content: 'Post content is required.' });
            }
            if (typeof options.title !== 'undefined' && !options.title) {
                errors.push({ title: 'Post title is required.' });
            }

            // Per Backbone documentation, if there are no validation errors, return nothing.
            // Otherwise you can return a string or an object.
            if (errors.length > 0) {
                this.modelErrors = errrors;
                return errors;
            }
        }
    });

    return BlogPost;
});