var async = require('async'),
	keystone = require('keystone');

var Order = keystone.list('Order');
var Pass = keystone.list('Pass');
var _ = require('lodash')

/**
 * List Orders
 */
exports.list = function(req, res) {
	Order.model.find(function(err, items) {

		if (err) return res.apiError('database error', err);

		res.apiResponse({
			orders: items
		});

	});
}

/**
 * Get Order by ID
 */
exports.get = function(req, res) {
	Order.model.findOne(
        {
            "orderId" : req.params.id
        }
    )
    .exec(function(err, item) {

		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');

		res.apiResponse({
			order: item
		});

	});
}

exports.notifyUpdate = function(req, res) {
	data = (req.method == 'POST') ? req.body : req.query;
	cleanData = {}
	_.forEach(data, function(value, key) {
	  	cleanData[_.camelCase(key)] = value;
	});
	console.log("PAYGATE SAYS:", cleanData)
	Order.model.findOne(
		{
			"orderId" : req.params.id
		}
	)
	.exec(function(err, item) {

		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');

		// TODO:  check if this is a dupe
		item.getUpdateHandler(req).process(cleanData, function(err) {

			if (err) return res.apiError('create error', err);

			res.apiResponse({
				order: item
			});

		});

	});


}

function createPass($passData){
    var res = [];
    async.series([
        function(callback) {
            // do some stuff ...
            var pass = new Pass.model({
                orderId: $passData['orderId']
            });
            pass.save();
            callback(null, pass);
        },
        function(callback) {
            // do some more stuff ...
            var pass = new Pass.model({
                orderId: $passData['orderId']
            });
            pass.save();
            callback(null, pass);
        }
    ],
    // optional callback
    function(err, results) {
        console.log(results);
        res = results;
    });
    return "res";
}



/**
 * Create a Order
 */
exports.create = function(req, res) {

	var item = new Order.model(),
		data = (req.method == 'POST') ? req.body : req.query;
		console.log("Creating order request:", data.REFERENCE);
	    item.getUpdateHandler(req).process(data, function(err) {

            // IF the Order wasn't created
    		if (err) return res.apiError('Error creating the order', err);
			res.apiResponse({
				order: item
			});
    	});
}



/**
 * Get Order by ID
 */
exports.update = function(req, res) {
	Order.model.findById(req.params.id).exec(function(err, item) {

		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');

		var data = (req.method == 'POST') ? req.body : req.query;

		item.getUpdateHandler(req).process(data, function(err) {

			if (err) return res.apiError('create error', err);

			res.apiResponse({
				order: item
			});

		});

	});
}
