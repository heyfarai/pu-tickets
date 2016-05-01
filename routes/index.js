/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);
var sitemap = require('keystone-express-sitemap');


// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('routes', middleware.forceSSL);
keystone.pre('render', middleware.flashMessages);

// Handle 404 errors
keystone.set('404', function (req, res, next) {
	res.status(404).render('errors/404', {

	});
});

// Handle other errors
keystone.set('500', function (err, req, res, next) {
	var title, message;
	if (err instanceof Error) {
		message = err.message;
		err = err.stack;
	}
	res.status(500).render('errors/500', {
		err: err,
		errorTitle: title,
		errorMsg: message
	});
});

// Import Route Controllers
var routes = {
	views: importRoutes('./views')
};

// Setup Route Bindings
exports = module.exports = function(app) {
	app.get('/sitemap.xml', function(req, res) {
		sitemap.create(keystone, req, res, {
			ignore: [
				'/e'
			]
		});
	});

	// Views
	app.get('/', routes.views.index);
	app.all('/speakers', routes.views.speakers);
	app.all('/speakers/:speaker', routes.views.speaker_detail);
	app.all('/schedule', routes.views.schedule);
	app.get('/venue', routes.views.venue);

// TODO: add South africa page content

	// app.get('/south-africa/johannesburg', routes.views.location);
	// app.get('/south-africa/johannesburg/maboneng', routes.views.location);
	app.get('/tickets', routes.views.tickets);
	app.get('/sponsors', routes.views.sponsors);


	app.get('/convince-your-boss', routes.views.convince);
	// app.get('/workshops', routes.views.workshop);
	// app.get('/workshops/:workshop', routes.views.workshop);
	// app.get('/about', routes.views.long_form);

	// app.get('/exhibition', routes.views.exhibition);
	// app.get('/volunteer', routes.views.volunteer);
	// app.get('/wanna-volunteer', routes.views.volunteer);

	// app.get('/accessibility', routes.views.long_form);

	app.get('/terms', routes.views.terms);

	// app.get('/credits', routes.views.long_form);

	app.get('/code-of-conduct', routes.views.code_of_conduct);
	app.get('/has/a/code-of-conduct', routes.views.code_of_conduct);

	// app.all('/contact', routes.views.contact);
	app.get('/blog/:post', routes.views.post);
	app.get('/blog/:category?', routes.views.blog);

	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

};
