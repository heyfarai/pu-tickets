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
keystone.pre('routes', middleware.forceTickets);
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
	views: importRoutes('./views'),
	api: importRoutes('./api')
};

// TODO: FIX THIS PROPERLY
keystone.redirect('/speakers/rebecca-bortman-garza/', '/speakers/rebecca-garza-bortman/');

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
	app.get('/p/home', routes.views.home);
	app.all('/p/speakers', routes.views.speakers);
	app.all('/p/speakers/:speaker', routes.views.speaker__detail);
	app.all('/p/schedule', routes.views.schedule);
	app.get('/p/venue', routes.views.venue);
	app.get('/p/slack', routes.views.slack);

	// TODO: add South africa page content

	// app.get('/south-africa/johannesburg', routes.views.location);
	// app.get('/south-africa/johannesburg/maboneng', routes.views.location);
	app.get('/p/tickets', routes.views.tickets);
	app.get('/p/sponsors', routes.views.sponsors);

	app.get('/p/convince-your-boss', routes.views.convince);
	app.get('/p/workshops', routes.views.workshops);
	app.get('/p/workshops/:workshop', routes.views.workshop__detail);
	// app.get('/about', routes.views.long_form);

	// app.get('/exhibition', routes.views.exhibition);
	app.get('/p/volunteer', routes.views.volunteer);
	// app.get('/wanna-volunteer', routes.views.volunteer);

	app.get('/p/privacy', routes.views.privacy);
	app.get('/p/terms', routes.views.terms);

	// app.get('/credits', routes.views.long_form);

	app.get('/p/code-of-conduct', routes.views.code_of_conduct);
	app.get('/has/a/code-of-conduct', routes.views.code_of_conduct);

	app.post('/email', routes.views.email_signup);
	app.get('/p/blog/:post', routes.views.blog__post);
	app.get('/p/blog/articles-about/:category', routes.views.blog);
	app.get('/p/blog', routes.views.blog);

	app.all('/get-ready/:p', routes.views.activate);
	app.get('/get-ready', routes.views.activate);
	app.get('/slack', routes.views.slack);
	app.get('/doable/', routes.views.dashboard);
	app.get('/scribble', routes.views.scribble);
	app.get('/downloads', routes.views.downloads);
	app.get('/feedback', routes.views.feedback);

	app.get('/register-tickets/:orderId/:payRequestId/:paygateId/:checksum', routes.views.register.ticketDetails);
	app.post('/register-tickets/:orderId/update-tickets', routes.views.register.updateTicketsByOrder)
	app.get('/register-tickets/:ticketId', routes.views.register.showTicket)

	// API
	app.all('/api*', keystone.middleware.api);

	app.get('/api/order/list', routes.api.orders.list);
	app.all('/api/order/create', routes.api.orders.create);
	app.get('/api/order/:id', routes.api.orders.get);
	app.all('/api/order/:id/update', routes.api.orders.update);
	// app.get('/api/order/:id/remove', keystone.initAPI, routes.api.orders.remove);

	app.all('/api/speakers', routes.api.speakers);
	app.all('/api/sessions', routes.api.sessions);
	app.all('/api/sponsors', routes.api.sponsors);
	app.all('/api/staff', routes.api.staff);
	app.all('/api/attendees/:type?', routes.api.attendees);

	// redirect all others to the index (HTML5 history)
	app.get('*', routes.views.index);



	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

};
