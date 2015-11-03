var mongoose = require('mongoose');

//var imagerConfig = require('../imager.js');
var utils = require('../routes/utils');

var Schema = mongoose.Schema;

/**
 * Getters
 */

var getTags = function (tags) {
  return tags.join(',');
};

/**
 * Setters
 */

var setTags = function (tags) {
  return tags.split(',');
};

/**
 * Article Schema
 */

 var projectSchema = new Schema({
                         createdate: {type: Date, default: Date.now},
                         modifydate: {type: Date, default: Date.now},
                         // set create and modify date the same when proj first created
                         //change modify date if project info changed
                         title: {type: String},
                         user: { type : mongoose.Schema.ObjectId, ref : 'user' },
                         url: {type: String},
                         category: {type: String},
                         location: {type: String},
                          fundgoal: { type: Number, default: 0 },
                         body: {type: String},
                         photo:{ file: { name: String, bin: Buffer }},  //may need proper type here to represent img file
                         ylink:{type: String}, //youtube link
                         ssnetwork:{type: String}, // social network link
                         tags: { type: [], get: getTags, set: setTags },
                        likes: { type: Number, default: 0 },
                        dislikes: { type: Number, default: 0 },
                        ratings: { type: Number, default : 0 },
                        createdAt  : { type : Date, default : Date.now },
                        comments: { type: [String], default: [""] },  //default no comments
                        progress: { type: String, default: "haventstarted" },

                        donation: { type: Number, default: 0 },
                        hasRaised: { type: Number, default: 0 }
 });

/**
 * Pre-remove hook
 */

 projectSchema.pre('remove', function (next) {

  next();
});

/**
 * Methods
 */

 projectSchema.methods = {

  /**
   * Save article
   */

  uploadAndSave: function (images, cb) {
    return this.save(cb);
  }
}

/**
 * Statics
 */

 projectSchema.statics = {

  /**
   * Find article by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  load: function (id, cb) {
    this.findOne({ _id : id })
      .populate('user', 'name email username')
      .exec(cb);
  },

  /**
   * List articles
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  list: function (options, cb) {
        var criteria = options.criteria || {};
        var sortby = options.sortby;
        if (sortby) {
            if (sortby == "createdAt") {
                console.log("createdAt");
                this.find(criteria)
                .populate('user', 'name username')
                .sort({ "createdAt": -1 })// sort by date
                .exec(cb);
            }
            if (sortby == "ratings") {
                console.log("ratings");
                this.find(criteria)
                .populate('user', 'name username')
                .sort({ "ratings": -1 })// sort by date
                .exec(cb);
            }

        }
        else {
            this.find(criteria)
        .populate('user', 'name username')
        .sort({ 'createdAt': -1 })// sort by date by default
        .exec(cb);

        }
    },

    findkbest: function (options, cb) {
        var criteria = options.criteria || {}

        this.find(criteria)
      .sort({ 'ratings': -1 })// sort by date
      .limit(options.k)
      .exec(cb);
    }

}

mongoose.model('project', projectSchema);
