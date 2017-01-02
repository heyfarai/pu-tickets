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
	attendeeName: { type: Types.Name, initial: true, index: true },
	email: { type: Types.Email, initial: true, index: true },
	twitterName: { type: String, size: 'small' },
	companyName: { type: String, size: 'small' },
	mobileNumber: { type: String },

	glutenFree: { type: Boolean, default: false },
	dairyFree: { type: Boolean, default: false },
	halaal: { type: Boolean, default: false },
	vegetarian: { type: Boolean, default: false },
	vegan: { type: Boolean, default: false },
	kosher: { type: Boolean, default: false },

	orderId: { type: String },
	type: { type: Types.Select, options: '2 Day, 3 Day, 1 Day, 1 Day Workshop', default: '2 Day' },
	order: { type: Types.Relationship, ref: 'Order', index: true },

	completeLater: { type: Boolean, default: false },
	isAssigned: { type: Boolean, default: false },
	isComplete: { type: Boolean, default: false },


	isEarlyBird: { type: Boolean, default: false },
	isActivated: { type: Boolean, default: false },

	createdAt: { type: Date, default: Date.now }
});

// Fix the Twitter handle
Pass.schema.pre('save', function(next) {
	if(this.completeLater==false){
		this.completeLater = (this.email=="" && this.attendeeName.first =="" && this.attendeeName.last =="") ? true : false;
	}
	next()
});


Pass.defaultColumns = 'orderId';
Pass.register();
