define(['backbone'], function(Backbone) {
    // Models will house domain specific functionality. They should know how to do thing that are 
    // within their domain, authorize and validate themselves. Application logic, however, ought
    // to be pushed out to the Presenter.
    var BlogPost = Backbone.Model.extend({
        initialize: function(options) {
            var content = this.get('content'),
                date = new Date(this.get('postDate'));

            if (content) {
                this.set({ excerpt: content.substring(0, 137) + '...' }, { silent: true });
            }

            if (date) {
                this.set({ displayDate: date.toLocaleDateString() }, { silent: true });
            }
            
            this.set({ foo: 'bar' }, { silent: true });
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
            if (typeof options.content !== 'undefined' && !options.content) {
                errors.push({ content: 'Post content is required.' });
            }
            if (typeof options.title !== 'undefined' && !options.title) {
                errors.push({ title: 'Post title is required.' });
            }
            if (errors.length > 0) {
                this.modelErrors = errrors;
                return errors;
            }
        }
    });

    return BlogPost;
});