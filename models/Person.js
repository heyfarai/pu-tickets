var createHash = require('create-hash');
var keystone = require('keystone');
var bindLastModified = require('../lib/bindLastModified');
var Types = keystone.Field.Types;
var randomstring = require("randomstring");

/**
 * Person Model
 * ==============
 */

var Person = new keystone.List('Person', {
	autokey: { path: 'slug', from: 'name', unique: true }
});

Person.add({
	name: { type: Types.Name, required: true, initial: true, index: true },
	email: { type: Types.Email, initial: true, index: true },
	twitter: { type: String, size: 'small', initial: true },
	ticketType: { type: Types.Relationship, initial: true, ref: 'Ticket' },
	ticketWorkshop: { type: Types.Relationship, ref: 'ScheduleItem', filters: { type: 'workshop', isPublished: true } },
	ticketMasterclass: { type: Boolean, default: false } ,
	ticketCode: { type: String, size: 'small', index: true },
	company: { type: String },
	isActivated: { type: Boolean, default: false },

	mugshot: { type: Types.CloudinaryImage, publicID: 'slug', folder: 'people'  },
	imagePromo: { type: Types.CloudinaryImage, publicID: 'slug', folder: 'promos'  },
	city: { type: String },
	jobTitle: { type: String },
	tagline: { type: String },
	website: { type: Types.Url, note: 'Full website URL, including http://' },
	isPublished: { type: Boolean, default: false, index: true },
	isOrganiser: { type: Boolean, default: false, index: true },
	isSpeaker: { type: Boolean, default: false, index: true },
	isPublic: { type: Boolean, default: false, index: true },

	// editable via API
	bio: { type: Types.Textarea },
	content: {
		bio: { type: Types.Markdown, height: 40 },
		ourDesc: { type: Types.Markdown, height: 40 },
		shortDesc: { type: Types.Markdown, height: 40 },
	},

	// used in authentication
	activatedOn: { type: Types.Datetime },
	authHash: { type: String, default: '', index: true },

	sortPriority: { type: Number, size: 'small', default: 10 },
	createdAt: { type: Date, default: Date.now }
});

/**
 * Relationships
 */

Person.relationship({ ref: 'Post', path: 'author' });
Person.relationship({ path: 'scheduleItems', ref: 'ScheduleItem', refPath: 'speakers' });

Person.schema.index({ isPublic: 1, isOrganiser: 1, isSpeaker: 1, sortPriority: 1 });

Person.schema.virtual('workshopId').get(function() {
	return this.ticketWorkshop._id;
});

Person.schema.virtual('initials').get(function() {
	names = this.name.split(" ", 2)
	initials = names[0].substring(0,1) + names[1].substring(0,1)
	return initials;
});

bindLastModified(Person, 'people');

Person.schema.virtual('getJobTitleFull').get(function() {
	return this.jobTitle + ((this.company) ? " at " + this.company : "");
});

Person.schema.set('toJSON', { transform: function (doc, rtn) {
	return {
		id: doc._id,
		email: doc.email,
		slug: doc.slug,
		firstName: doc.name.first,
		lastName: doc.name.last,
		name: doc.name.full,
		jobTitle: doc.jobTitle || undefined,
		tagline: doc.tagline || undefined,
		mugshot: doc.mugshot.secure_url || doc.gravatar,
		twitter: doc.twitter || undefined,
		website: doc.website || undefined,
		company: doc.company || undefined,
		city: doc.city || undefined
	}
}});

Person.schema.pre('save', function(next) {
    if (this.isNew) {
		console.log('New peeps');
		this.sendGetReadyEmail();
    }
	next()
});

Person.schema.pre('save', function(next) {
	if(this.isActivated &&
		this.isModified('isActivated')){
		this.isActivating = true;
		console.log("activating")
	}
	next();
});

// Create a ticket code
Person.schema.pre('save', function(next) {
	if(!this.ticketCode){
		var newTC = randomstring.generate({
		  	length: 8,
		  	charset: 'alphabetic',
			capitalization: 'uppercase'
		});
		this.ticketCode = newTC;
	}
	next();
});

Person.schema.post('save', function() {
	if (this.isActivating) {
		console.log('activating');
		this.sendConfirmationEmail();
	}
});

var getWorkshop = function(t) {
	var s = ""
	if(t){
		keystone.list('ScheduleItem').model.findOne()
		.where('_id', t)
		.exec(function(err, workshop) {
			console.log("workshop")
			if (err) return callback(err);

			s = "Your workshop will be: " + workshop.title;
			return s;
		});
	} else {
		return s;
	}

}

Person.schema.methods.sendConfirmationEmail = function(callback) {
	var request = require('request');
	var person = this;
	var url = "https://hooks.zapier.com/hooks/catch/1239813/6y00dh/";

	var headers = {'Content-Type': 'application/json'};

	var bodyJSON = this.toJSON();
	bodyJSON.workshop = "";
	bodyJSON.masterClass = "";
	if(this.ticketWorkshop){
		if(this.ticketMasterclass) {
			bodyJSON.masterClass =  ". And you'll be attending the Accenture Service Design Masterclass."
		};
		keystone.list('ScheduleItem').model.findOne()
		.where('_id', this.ticketWorkshop)
		.exec(function(err, workshop) {
			if(workshop){
				console.log("workshop")
				if (err) return callback(err);

				s = "Your workshop will be: " + workshop.title + bodyJSON.masterClass;

			}
			bodyJSON.workshop = s;
			var body = JSON.stringify(bodyJSON);
			console.log(body)
			request({
			    url: url, //URL to hit
			    method: 'POST',
			    headers: {'Content-Type': 'application/json'},
			    body: body //Set the body as a string
			}, function (error, response, body) {
				if(error) {
					console.log(error);
				} else {
					 console.log(response.statusCode, body);
				}
			});
		});
	} else {

		if(this.ticketMasterclass) {
			bodyJSON.workshop = "You'll be attending the Accenture Service Design Masterclass."
		}

		var body = JSON.stringify(bodyJSON);
		console.log(body)
		request({
			url: url, //URL to hit
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: body //Set the body as a string
		}, function (error, response, body) {
			if(error) {
				console.log(error);
			} else {
				 console.log(response.statusCode, body);
			}
		});
	}


// 	request({
//     url: url, //URL to hit
//     method: 'POST',
//     headers: {'Content-Type': 'application/json'},
//     body: body //Set the body as a string
// }, function (error, response, body) {
// 		if(error) {
// 			console.log(error);
// 		} else {
// 			 console.log(response.statusCode, body);
// 		}
// 	});

};


Person.schema.methods.sendGetReadyEmail = function(callback) {
	var request = require('request');
	var person = this;
	var url = "https://hooks.zapier.com/hooks/catch/1239813/6ylbv6/"

	var headers = {'Content-Type': 'application/json'};
	var body = JSON.stringify(this.toJSON());
	request({
    url: url, //URL to hit
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: body //Set the body as a string
}, function (error, response, body) {
		if(error) {
			console.log(error);
		} else {
			 console.log(response.statusCode, body);
		}
	});

};

/**
 * Registration
 */

Person.defaultColumns = 'name, twitter, company, ticketType, isActivated';
Person.register()
