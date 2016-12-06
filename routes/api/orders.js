var async = require('async'),
	keystone = require('keystone');

var Order = keystone.list('Order');
var Pass = keystone.list('Pass');

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
	console.log("PAYGATE SAYS:", data)
	Order.model.findOne(
		{
			"orderId" : req.params.id
		}
	)
	.exec(function(err, item) {

		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');

		res.apiResponse({
			code: item
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

	    item.getUpdateHandler(req).process(data, function(err) {

            // IF the Order wasn't created
    		if (err) return res.apiError('error', err);

            Order.model.findById(item._id).exec()
            .then(function(err, obj){
                console.log(obj);
                    res.apiResponse({
                        order: item
                    });
            }, function (err) { //first promise rejected
                if (err) return res.apiError('Error creating tickets', err);
            })

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
