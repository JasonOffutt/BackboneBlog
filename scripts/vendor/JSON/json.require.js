// JSON2 doesn't support Common.js, so we need to create a module wrapper for it.
define(['vendor/JSON/json2'], function() {
	return JSON;
});