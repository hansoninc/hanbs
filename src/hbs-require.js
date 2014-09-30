/*
 Copyright (c) 2013 Hanson Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of
 the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/* global browser, require, define, console */
/**
 * @class HBS
 * @namespace HBS
 * @requires require
 * @desc HBS (HanBootStrap) is a page initialization and object creation/utility library.
 */
define([], function () {
	var module = {};

	module.defaults = {
		debugMode: false,
		autoInit: false
	};

	/**
	 * @method initPage
	 * @memberof HBS
	 * @desc Initializes a page based on two HTML data attributes, data-section and data-page,
	 * located on the body element. <b>data-section</b> defines a Javascript file to be loaded using
	 * require.js notation (dir/subdir/file). This file is expected to act as a "section controller"
	 * and to load common scripts and initialize common functionality for a group of related pages.
	 * If the loaded JS file contains an init() function, it will be run automatically.
	 * <b>data-page</b> is optional and defines a second, page-level function to run. If data-location
	 * is "com/sections/products", data-action might be "productDetail", in which case HanBootStrapper
	 * will look for a productDetail() function in the loaded JS file and run it.
	 * @param {Boolean} [async=false] If true, loads the script associated with data-async-script
	 * @param {Boolean} [afterAsyncLoad=false] If true, suppresses asynchronous loading to prevent an infinite loop.
	 * Passed by autoLoadScript().
	 */
	module.initPage = function (async, afterAsyncLoad) {
		var body = document.body,
			section = body.getAttribute('data-section'),
			page = body.getAttribute('data-page'),
			asyncScript = body.getAttribute('data-async-script'),
			autoLoadScript = body.getAttribute('data-autoload') != null || async === true;

		if (section) {
			require([section], function (loadedSection) {

				if (loadedSection != null) {

					if (loadedSection.hasOwnProperty('init')) {
						loadedSection.init();
					}

					if (page && typeof(loadedSection[page]) === 'function') {
						loadedSection[page]();
					}

				} else {
					console.log("Unable to load module " + section);
				}

			});
		}
	};

	/**
	 * @method namespace
	 * @memberof HBS
	 * @param {string} pkg: A dot-separated package name for your object, e.g. com.myClass.
	 * Any missing objects from the window object to your class will be created.
	 * @param {function|object} func: A function or object to be namespaced.
	 * @desc Namespaces an object by creating or appending it to the chain of objects
	 * located within a certain package.
	 */
	module.namespace = function (pkg, func) {
		var packageParts = module.getPackageArray(pkg);
		var target = window;
		var nextPart;

		for (var i = 0, max = packageParts.length; i < max; i++) {
			nextPart = packageParts[i];
			target[nextPart] = target[nextPart] || {};
			if (i === max - 1) {
				target[nextPart] = func;
			} else {
				target = target[nextPart];
			}
		}
	};

	/**
	 * @method extend
	 * @memberof HBS
	 * @param {object, function} parent: An object or class to be used as an inheritance
	 * prototype. The child object will be the same type (object or class) as the parent.
	 * @param {function} constructor: An optional function to be the constructor of your
	 * child class. Constructor is ignored if parent is of type {object}.
	 */
	module.extend = function (parent, _constructor) {
		var child;
		var tmp;

		if (typeof(parent) === 'function') {
			var tmp = function () {
			};
			tmp.prototype = parent.prototype;
			child = _constructor;
			child.prototype = new parent(Array.prototype.slice.call, arguments);
			child.prototype._super = parent.prototype;
			return child;
		}

		else if (typeof(parent) === 'object') {
			child = {};
			child.prototype = parent;
			return child;
		}
	};

	/**
	 * @memberof HBS
	 * @param {string} pkg An object in dot notation (e.g. mySite.myObject)
	 * @returns {Boolean} Whether or not the current object is defined
	 */
	module.exists = function(pkg) {
		return module.getNamespacedObject(pkg) !== null;
	};

	/**
	 * @memberof HBS
	 * @param {string} pkg An object in dot notation (e.g. mySite.myObject)
	 * @returns {Boolean} Returns a namespace object if it exists, or null if it doesn't
	 */
	module.getNamespacedObject = function(pkg) {
		var packageParts = module.getPackageArray(pkg),
			target = window,
			nextPart,
			retVal = null;

		for (var i = 0, max = packageParts.length; i < max; i++) {
			nextPart = packageParts[i];
			if (typeof (target[nextPart]) === 'undefined') {
				retVal = false;
				break;
			}
			retVal = target = target[nextPart];
		}

		return retVal;
	};

	/**
	 * @private
	 * @memberof HBS
	 * @param {Object} pkg: An internal function used to split a string
	 * into an array of objects to be created or traversed.
	 */
	module.getPackageArray = function (pkg) {
		return (typeof(pkg) !== 'string') ? '' : pkg.split('.');
	};

	/**
	 * Returns the path to a given script
	 * @param {String} scriptName
	 * @returns {String} The path of the script to be loaded
	 */
	module.getScriptPath = function(scriptName) {
		if (/^\/\//.test(scriptName)) {
			scriptName = document.location.protocol + scriptName;
		}
		return scriptName;
	}

	if (module.defaults.autoInit) {
		$(document).ready(function() {
			module.initPage();
		});
	}

	module.namespace('HBS', module);
	return module;
});
