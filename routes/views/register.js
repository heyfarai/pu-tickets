var async = require('async'),
	keystone = require('keystone'),
    _ = require('underscore');

var Order = keystone.list('Order');
var Pass = keystone.list('Pass');

/**
 * List Orders
 */


 exports.showTicket = function(req, res) {
     var view = new keystone.View(req, res);
     var locals = res.locals;
     locals.data = {
 		ticket: []
 	};

     // Load other posts
 	view.on('init', function(next) {
 		var q = keystone.list('Pass').model.findOne()
 		.where('_id', req.params.ticketId)
         q.exec(function(err, ticket) {
            console.log(req.params.ticketId)
             locals.data.ticket = ticket;
             next(err);
         });
     });

     // Render the view
     view.render('register/ticket_detail');
 }

 exports.updateTicketsByOrder = function(req, res) {
     var view = new keystone.View(req, res);
     var locals = res.locals;
     var postData = req.body;

     locals.data = {
 		order: []
 	};

    // GET THE ORDER
    view.on('init', function(next) {
        var q = keystone.list('Order').model.findOne()
        .where('_id', req.params.orderId)
        q.exec(function(err, order) {
            console.log("Got the Order")
            locals.data.order = order;
            next(err);
        });

    });

    // GET THE TICKETS
    view.on('init', function(next) {
        var q = keystone.list('Pass').model.find()
        .where('orderId', locals.data.order.orderId)
        q.exec(function(err, results) {
            console.log("Found tickets ", results.length)

            // do updates for the tickets. probably wrong
            _.each(results, function(ticketObj){
                // check id the ticket is Assigned
                if(ticketObj.isAssigned==false){

					// GET THE FORM DATA FOR THE TICket
                    ticketData = postData[ticketObj.id];

                    // GET THE FORM DATA FOR THE TICket

                    // update the ticket
                    ticketObj.getUpdateHandler(req).process(ticketData, function(err) {
                        // IF the ticket wasn't updated
                        if (err) return console.log("Error updatign tickets", err);
                        console.log("updated ticket")
                    })
					ticketObj.save();
                }
            })


            locals.data.tickets = results;
            next(err);
        });
    });

    // Render the view
    view.render('register/ticket_assigned');
}

exports.ticketDetails = function(req, res) {
    var view = new keystone.View(req, res);
    var locals = res.locals;
    locals.data = {
		order: []
	};

    // Load other posts
	view.on('init', function(next) {
		var q = keystone.list('Order').model.findOne()
		.where('orderId', req.params.orderId)
        q.exec(function(err, order) {
            locals.data.order = order;
            next(err);
        });
    });

    // Load other posts
    view.on('init', function(next) {

        if(locals.data.order.ticketsAdded == false){
            var newPasses = []
            for(i = 0; i < locals.data.order.earlyBird_2day; i++){
                var newPass = {
                    orderId: locals.data.order.orderId,
                    type: '2 Day',
                    order: locals.data.order,
                    isEarlyBird : true,
                };
                newPasses.push(newPass);
            }
            for(i = 0; i < locals.data.order.earlyBird_3day; i++){
                var newPass = {
                    orderId: locals.data.order.orderId,
                    order: locals.data.order,
                    type: '3 Day',
                    isEarlyBird : true
                };
                newPasses.push(newPass);
            }
            for(i = 0; i < locals.data.order.full_2day; i++){
                var newPass = {
                    orderId: locals.data.order.orderId,
                    order: locals.data.order,
                    type: '2 Day'
                };
                newPasses.push(newPass);
            }
            for(i = 0; i < locals.data.order.full_3day; i++){
                var newPass = {
                    orderId: locals.data.order.orderId,
                    order: locals.data.order,
                    type: '3 Day'
                };
                newPasses.push(newPass);
            }
            console.log("New passes", newPasses);
            var q = keystone.list('Pass').model.create(newPasses, function(err, results) {
                if(err){
                    console.log("Error creatign passes", err)
                } else {
                    console.log("New tickets created", results);
                }
                next(err);
            });

        } else {
            next();
        }
    });

    // Load other posts
	view.on('init', function(next) {
		var q = keystone.list('Order').model.findOne()
		.where('orderId', req.params.orderId)
        q.exec(function(err, order) {
            order.paygate_id = req.params.paygateId,
            order.pay_request_id = req.params.payRequestId,
            order.transaction_status = 1,
            order.checksum = req.params.checksum,
            order.ticketsAdded = true,
            order.save(function(err){
                locals.data.order = order;
                next(err);
            })
        });
    });



    // Load other posts
	view.on('init', function(next) {
		var q = keystone.list('Pass').model.find()
		.where('orderId', locals.data.order.orderId)
        q.exec(function(err, results) {
            locals.data.tickets = results;
            next(err);
        });
    });

    // Render the view
    view.render('register/ticket_details');

};
