'use strict';


/* dependencies */
const _ = require('lodash');
const mongoose = require('mongoose');
const MongooseError = mongoose.Error;
const SchemaArray = mongoose.Schema.Types.Array;


/* custom validations error message */
MongooseError.messages.Array = (MongooseError.messages.Array || {});
MongooseError.messages.Array.empty = ('Path `{PATH}` can not be empty.');


/**
 * Sets empty validator.
 *
 * ####Example:
 *
 *     var s = new Schema({ n: { type: [String], empty: false })
 *     var M = db.model('M', s)
 *     var m = new M({ n: [] })
 *     m.save(function (err) {
 *       console.error(err) // validator error
 *       m.n = ['a'];
 *       m.save() // success
 *     })
 *
 * @param {Boolean|Object} options empty validation options
 * @param {String} [message] optional custom error message
 * @return {SchemaType} this
 * @see Customized Error Messages #error_messages_MongooseError-messages
 * @api public
 */

SchemaArray.prototype.empty = function empty(options, message) {

  if (this.emptyValidator) {
    this.validators = this.validators.filter(function (v) {
      return v.validator !== this.emptyValidator;
    }, this);
  }

  if (options !== null && options !== undefined) {
    const msg =
      (options.message || message || MongooseError.messages.Array.empty);
    const shouldAllowEmpty = options;
    this.validators.push({
      validator: this.emptyValidator = function (v) {
        return shouldAllowEmpty ? true : !_.isEmpty(v);
      },
      message: msg,
      type: 'empty'
    });
  }

  return this;

};


/**
 * Remove falsey values. The values false, null, 0, "", undefined, and NaN
 * are falsey.
 *
 * ####Example:
 *
 *     var s = new Schema({ caps: { type: [String], compact: true }})
 *     var M = db.model('M', s);
 *     var m = new M({ caps: [null, 'a', undefined, 'b']});
 *     console.log(m.caps) // 'a', 'b'
 *
 * @api public
 * @see Customized Error Messages #error_messages_MongooseError-messages
 * @return {SchemaType} this
 */

SchemaArray.prototype.compact = function compact(shouldApply) {
  if (arguments.length > 0 && !shouldApply) {
    return this;
  }
  return this.set(function (v /*, self*/ ) {
    let value = [].concat(v);
    value = _.compact(value);
    return value;
  });
};


/**
 * Creates a duplicate-free version of an array
 *
 * ####Example:
 *
 *     var s = new Schema({ caps: { type: [String], duplicate: false }})
 *     var M = db.model('M', s);
 *     var m = new M({ caps: ['a', 'a', 'b', 'b']});
 *     console.log(m.caps) // 'a', 'b'
 *
 * @api public
 * @see Customized Error Messages #error_messages_MongooseError-messages
 * @return {SchemaType} this
 */

SchemaArray.prototype.duplicate = function duplicate(shouldApply) {
  if (arguments.length > 0 && shouldApply && !_.isFunction(shouldApply)) {
    return this;
  }
  return this.set(function (v /*, self*/ ) {
    let value = [].concat(v);
    value = _.compact(value);
    value = (
      _.isFunction(shouldApply) ?
      _.uniqWith(value, shouldApply) :
      _.uniq(value)
    );
    return value;
  });
};


/**
 * Creates sorted array of elements
 *
 * ####Example:
 *
 *     var s = new Schema({ caps: { type: [String], sort: true }})
 *     var M = db.model('M', s);
 *     var m = new M({ caps: ['b', 'a', 'c', 'b']});
 *     console.log(m.caps) // 'a', 'b', 'c'
 *
 * @api public
 * @see Customized Error Messages #error_messages_MongooseError-messages
 * @return {SchemaType} this
 */

SchemaArray.prototype.sort = function sort(shouldApply) {
  if (arguments.length > 0 && !shouldApply) {
    return this;
  }
  return this.set(function (v, self) {
    //prepare value
    let value = [].concat(v);
    value = _.compact(value);

    //ensure unique sortable
    const comparator = (self.options || {}).sort;
    value = (
      _.isFunction(comparator) ?
      _.uniqWith(value, comparator) :
      _.uniq(value)
    );

    //sort value
    value =
      (
        _.isString(shouldApply) ?
        _.orderBy(value, null, shouldApply) :
        _.orderBy(value)
      );
    return value;
  });
};
