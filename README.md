HanBS (HanBootStrap) is a page initialization and object creation/utility library.

HanBS includes some object-creation and extension functions to make object-oriented
Javascript easier. It also contains a function that runs when the page is loaded and looks for two data variables
on the body element (data-section and data-page).

## How to use HanBootStrap

Include [dist/hbs.min.js](hbs.min.js) in your JavaScript distribution (either directly with a <code>&lt;script&gt;</code> tag or as part of a code bundle.)

In typical usage, there are two levels of JavaScript. A **main** or **global** JS file that is included and run on every page of the site, and a **section controller**
that contains code only needed for a certain section or page.
 
### main.js
[Example main.js file](example/js/APP/main.js)

```javascript 
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
        // Global application code goes here. Create other functions as needed.
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
```

Main.js should be used to bootstrap any JavaScript that's used on every page of the site (for example, navigation pulldowns or search features). Usually these functions are collected in an <code>init()</code> function that runs when the DOM is fully loaded.

The only other requirement of main.js is that it call <code>HBS.initPage()</code>. This will trigger the section controller to load.

We typically use the revealing module pattern when creating controllers. All the code in a JS module is defined inside an immediately-invoked function expression (IIFE) to prevent variables from leaking into the global namespace.

<code>HBS.namespace()</code> is a utility function to make the current module globally accessible with an alias. Our typical convention is to namespace all the application code for a project under a single three- or four-letter code (e.g. <code>APP</code>). Often this matches the name of the site or client. 

### Section Controller

[Example section controller](example/js/APP/controllers/example.js)

```javascript
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
```

Section controllers are structured similarly to main.js, with an <code>init()</code> function for code shared among a section or collection of views, and supporting functions for
each specific view.

HanBootStrap relies on two data-attributes of the <code>&lt;body&gt;</code> element, **data-section** and **data-page**, to tell it which section controller to load and which page method to run. The **data-page**
 attribute is always optional. If data-page is not specified, only the <code>init()</code> method is run.
 
 <pre><code>&lt;body data-section=&quot;APP.controllers.example&quot; data-page=&quot;examplePage&quot;&gt;</code></pre>
 
<code>HBS.initPage()</code> will look for an object in the global namespace that matches the value of **data-section**, so it's important that to use <code>HBS.namespace()</code>
or another method to expose your section controller at that name. In the example above, it expects an object named <code>APP.controllers.example()</code>.

If this object is found, <code>HBS.initPage()</code> will attempt to run the <code>init()</code> function of the loaded controller automatically. If you specified a **data-page** attribute, it will attempt to run that method as well, after <code>init()</code>.

 See [example/index.html](example/index.html) for a working example.