var createHash = require('create-hash');
var keystone = require('keystone');
var bindLastModified = require('../lib/bindLastModified');
var Types = keystone.Field.Types;
var randomstring = require("randomstring");

/**
 * Person Model
 * ==============
 */

var Pass = new keystone.List('Pass', {
});

Pass.add({
	orderId: { type: String },

	isActivated: { type: Boolean, default: false },

	createdAt: { type: Date, default: Date.now }
});

Pass.defaultColumns = 'orderId';
Pass.register();
