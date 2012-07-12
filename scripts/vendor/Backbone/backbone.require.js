// Require.js module wrapper for Backbone. In a previous version, support
// for Common.js was removed from Backbone, so we need to wrap it in a 
// module definition to work.
define(['vendor/Backbone/backbone-0.9.2.min'], function () {
	'use strict';
	return Backbone;
});