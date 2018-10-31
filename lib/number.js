'use strict';


/* dependencies */
const validator = require('validator');
const mongoose = require('mongoose');
const MongooseError = mongoose.Error;
const SchemaNumber = mongoose.Schema.Types.Number;


/* custom validations error message */
MongooseError.messages.Number.numeric =
  ('`{VALUE}` is not a valid numeric value for path `{PATH}`.');
MongooseError.messages.Number.integer =
  ('`{VALUE}` is not a valid integer value for path `{PATH}`.');
MongooseError.messages.Number.float =
  ('`{VALUE}` is not a valid float value for path `{PATH}`.');


/**
 * Sets numeric validator.
 *
 * ####Example:
 *
 *     var s = new Schema({ n: { type: Number, numeric: true })
 *     var M = db.model('M', s)
 *     var m = new M({ n: 'a' })
 *     m.save(function (err) {
 *       console.error(err) // validator error
 *       m.n = 1;
 *       m.save() // success
 *     })
 *
 * @param {Boolean|Object} options numeric validation options
 * @param {String} [message] optional custom error message
 * @return {SchemaType} this
 * @see Customized Error Messages #error_messages_MongooseError-messages
 * @api public
 */

SchemaNumber.prototype.numeric = function numeric(options, message) {

  if (this.numericValidator) {
    this.validators = this.validators.filter(function (v) {
      return v.validator !== this.numericValidator;
    }, this);
  }

  if (options !== null && options !== undefined) {
    const msg =
      (options.message || message || MongooseError.messages.Number.numeric);
    this.validators.push({
      validator: this.numericValidator = function (v) {
        return validator.isNumeric(String(v));
      },
      message: msg,
      type: 'numeric'
    });
  }

  return this;

};


/**
 * Sets integer validator.
 *
 * ####Example:
 *
 *     var s = new Schema({ n: { type: Number, integer: true })
 *     var M = db.model('M', s)
 *     var m = new M({ n: 'a' })
 *     m.save(function (err) {
 *       console.error(err) // validator error
 *       m.n = 1;
 *       m.save() // success
 *     })
 *
 * @param {Boolean|Object} options integer validation options
 * @param {String} [message] optional custom error message
 * @return {SchemaType} this
 * @see Customized Error Messages #error_messages_MongooseError-messages
 * @api public
 */

SchemaNumber.prototype.integer = function integer(options, message) {

  if (this.integerValidator) {
    this.validators = this.validators.filter(function (v) {
      return v.validator !== this.integerValidator;
    }, this);
  }

  if (options !== null && options !== undefined) {
    const msg =
      (options.message || message || MongooseError.messages.Number.integer);
    this.validators.push({
      validator: this.integerValidator = function (v) {
        return validator.isInt(String(v));
      },
      message: msg,
      type: 'integer'
    });
  }

  return this;

};


/**
 * Sets float validator.
 *
 * ####Example:
 *
 *     var s = new Schema({ n: { type: Number, float: true })
 *     var M = db.model('M', s)
 *     var m = new M({ n: 'fa' })
 *     m.save(function (err) {
 *       console.error(err) // validator error
 *       m.n = 123.123;
 *       m.save() // success
 *     })
 *
 * @param {Boolean|Object} options float validation options
 * @param {String} [message] optional custom error message
 * @return {SchemaType} this
 * @see Customized Error Messages #error_messages_MongooseError-messages
 * @api public
 */

SchemaNumber.prototype.float = function float(options, message) {

  if (this.floatValidator) {
    this.validators = this.validators.filter(function (v) {
      return v.validator !== this.floatValidator;
    }, this);
  }

  if (options !== null && options !== undefined) {
    const msg =
      (options.message || message || MongooseError.messages.Number.float);
    this.validators.push({
      validator: this.floatValidator = function (v) {
        return validator.isFloat(String(v));
      },
      message: msg,
      type: 'float'
    });
  }

  return this;

};
