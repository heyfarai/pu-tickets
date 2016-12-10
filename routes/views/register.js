var async = require('async'),
	keystone = require('keystone'),
	sendgrid = require('sendgrid')(process.env.SENDGRID_KEY),
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
		.populate('order')
         q.exec(function(err, ticket) {
            locals.data.ticket = ticket;
			next(err);
         });
     });

	 // FIND THE ORDER
 	view.on('init', function(next) {
 		var q = keystone.list('Order').model.findOne()
 		.where('_id', locals.data.ticket.order.id)
 		.populate('passes')
         q.exec(function(err, order) {
            locals.data.order = order;
 			sendReceipt(order, function(error, response) {
				console.log("response");
			});
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

function getTicketList(ticketObj){
	console.log(ticketObj)
	var tix = "";
	tix = (ticketObj.count3D>0) ? tix + ticketObj.count3D + " x 3 Day Tickets<br/>" : '' ;
	tix = (ticketObj.count2D>0) ? tix + ticketObj.count2D + " x 2 Day Tickets" : tix ;
	return tix;
}

function sendReceipt(order){
	//console.log(order);
	var helper = require('sendgrid').mail;

	mail = new helper.Mail()
	email = new helper.Email("farai@pixelup.co.za", "Farai Madzima (PIXEL UP!)")
	mail.setFrom(email)

	// SET THE SUBJECT
	if(keystone.get('env')=="development"){
		mail.setSubject("TEST EMAIL")
	} else {
		mail.setSubject("Your PIXEL UP! receipt")
	}

	// ADD PERSONALISATION
	personalization = new helper.Personalization()

	// SEND TO THE CUSTOMER
	var to_email = new helper.Email(order.buyerEmail, order.buyerName);
	personalization.addTo(to_email)

	// SEND (BCC) TO THE TEAM
	email = new helper.Email("team@pixelup.co.za", "Someone bought a ticket")
	personalization.addBcc(email)

	// ADD HTML CONTENT
	var content = new helper.Content('text/html', '<p></p>');
    mail.addContent(content)

	substitution = new helper.Substitution("-date-", order.createdAt.toDateString())
	personalization.addSubstitution(substitution)
	substitution = new helper.Substitution("-name-", order.buyerName)
	personalization.addSubstitution(substitution)
	substitution = new helper.Substitution("-company-", (order.buyerCompany!='') ? '(' + order.buyerCompany + ')' : '')
  	personalization.addSubstitution(substitution)
	substitution = new helper.Substitution("-amount-", Number(order.orderAmount).toFixed(2).toLocaleString())
  	personalization.addSubstitution(substitution)
	substitution = new helper.Substitution("-tickets-", getTicketList(order))
  	personalization.addSubstitution(substitution)

	mail.addPersonalization(personalization)
	mail.setTemplateId(process.env.RECEIPT_TEMPLATE)

	var sg = require('sendgrid')(process.env.SENDGRID_KEY);
	var request = sg.emptyRequest({
	  method: 'POST',
	  path: '/v3/mail/send',
	  body: mail.toJSON(),
	});
	console.log(request.body.personalizations);

	var res = sg.API(request, function(error, response) {
		  console.log(response.body);
		  console.log(response.headers);
	  return response;
	});
	return res;
}

exports.ticketDetails = function(req, res) {
    var view = new keystone.View(req, res);
    var locals = res.locals;
    locals.data = {
		order: []
	};

    // FIND THE ORDER
	view.on('init', function(next) {
		var q = keystone.list('Order').model.findOne()
		.where('orderId', req.params.orderId)
		.populate('passes')
        q.exec(function(err, order) {
            locals.data.order = order;
			if(order.receiptSent==false){
				sendReceipt(order);
				order.receiptSent = true;
				order.save();
			}
            next(err);
        });
    });

    // CREATE THE TICKETS
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
            console.log("New passes", newPasses.length);
            var q = keystone.list('Pass').model.create(newPasses, function(err, results) {
                if(err){
                    console.log("Error creatign passes", err)
                } else {
                    console.log("New tickets created");
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
            order.paygateId = req.params.paygateId,
            order.payRequestId = req.params.payRequestId,
            order.transactionStatus = 1,
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
