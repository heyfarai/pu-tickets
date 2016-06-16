var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.

	locals.data = {
	};

	var backURL=req.header('Referer') || '/';

	mc.lists.subscribe({
		id: keystone.app.locals.newsletter_id,
		email:{email:req.body.email}},
		function(data) {
			req.flash('success', 'Sharp! We\'ve sent you an email to confirm.');
      		res.json(data);
    	},
	    function(error) {
			var msg = 'Something broke while joining the newsletter. Try again'
			if (error.error) {
	        	//console.log('error', error.code + ": " + error.error);
				if(error.code==214) msg = error.error;
	      	}
			req.flash('error', msg);
			res.status(400);
			res.json(error);
	    });
};
