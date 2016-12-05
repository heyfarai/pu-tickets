var createHash = require('create-hash');
var keystone = require('keystone');
var bindLastModified = require('../lib/bindLastModified');
var Types = keystone.Field.Types;
var randomstring = require("randomstring");

/**
 * Person Model
 * ==============
 */

var Order = new keystone.List('Order', {
});

Order.add({
	buyerName: { type: String, required: true, initial: true, index: true },
	buyerEmail: { type: Types.Email, initial: true, index: true },
	buyerCompany: { type: String, initial: true },
	orderAmount: { type: String },
	reference: { type: String },
	orderId: { type: String },
    earlyBird_2day: { type: Number, size: 'small' },
    earlyBird_3day: { type: Number, size: 'small' },
    full_2day: { type: Number, size: 'small' },
    full_3day: { type: Number, size: 'small' },

    paygate_id: { type: String },
    pay_request_id: { type: String },
    transaction_status: { type: String },
    checksum: { type: String },

	ticketsAdded: { type: Boolean, default: false },
	isComplete: { type: Boolean, default: false },
	isPublished: { type: Boolean, default: false, index: true, initial: true },

	createdAt: { type: Date, default: Date.now }
});

Order.relationship({ path: 'passes', ref: 'Pass', refPath: 'order' });

Order.schema.post('save', function() {

});

Order.defaultColumns = 'buyerName, buyerEmail, orderAmount, createdAt';
Order.register();
