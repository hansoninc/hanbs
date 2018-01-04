(function() {
	/**
	 * @exports APP.controllers.home
	 * @requires HBS
	 */
	var module = {};

	module.init = function() {
		$('#section-init').text('This text comes from controllers/example.js. This code will run on any page where data-section="APP.controllers.example"');
	};

	module.examplePage = function() {
		$('#page-method').text('This text comes from controllers/example.js. This code will run on any page where data-section="APP.controllers.example" and data-page="examplePage"');
	};

	HBS.namespace('APP.controllers.example', module);
}());