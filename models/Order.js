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
    earlyBird_2day: { type: Number, size: 'small', default: 0 },
    earlyBird_3day: { type: Number, size: 'small', default: 0 },
    full_2day: { type: Number, size: 'small', default: 0 },
    full_3day: { type: Number, size: 'small', default: 0 },

    paygateId: { type: String, size: 'small' },
    payRequestId: { type: String, size: 'small' },
    transactionStatus: { type: String, size: 'small' },
    checksum: { type: String, size: 'small' },
    reference: { type: String, size: 'small' },
    resultCode: { type: String, size: 'small' },
    resultDesc: { type: String, size: 'small' },
    transactionId: { type: String, size: 'small' },
    authCode: { type: String, size: 'small' },
    riskIndicator: { type: String, size: 'small' },
    payMethodDetail: { type: String, size: 'small' },

	receiptSent: { type: Boolean, default: false },
	ticketsAdded: { type: Boolean, default: false },
	isComplete: { type: Boolean, default: false },
	isPublished: { type: Boolean, default: false, index: true, initial: true },

	createdAt: { type: Date, default: Date.now }
});

Order.relationship({ path: 'passes', ref: 'Pass', refPath: 'order' });

Order.schema.virtual('buyerFirstName').get(function() {
	return (this.buyerName.substr(0, this.buyerName.indexOf(' ')));
});

Order.schema.virtual('buyerLastName').get(function() {
	return (this.buyerName.substr(this.buyerName.indexOf(' ')));
});

Order.schema.virtual('count2D').get(function() {
	return (this.earlyBird_2day + this.full_2day);
});
Order.schema.virtual('count3D').get(function() {
	return (this.earlyBird_3day + this.full_3day);
});

Order.defaultColumns = 'buyerName, buyerEmail, orderAmount, createdAt';
Order.register();
