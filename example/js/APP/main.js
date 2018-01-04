/**
 * @requires HBS
 */
(function() {
	/**
	 * @exports APP.main
	 */
	var module = {};

	/**
	 * Global init code for the whole application
	 */
	module.init = function() {
		$('#main-js').text('This text comes from main.js. This code will run on every page on the site.');
	};

	/**
	 * Initialize the app and run the bootstrapper
	 */
	$(document).ready(function() {
		module.init();
		HBS.initPage();
	});
	HBS.namespace('APP.main', module);
}());
