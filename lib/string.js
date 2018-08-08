'use strict';


/* dependencies */
const validator = require('validator');
const mongoose = require('mongoose');
const MongooseError = mongoose.Error;
const SchemaString = mongoose.Schema.Types.String;


/* custom validations error message */
MongooseError.messages.String.email =
  ('`{VALUE}` is not a valid email address for path `{PATH}`.');
MongooseError.messages.String.macaddress =
  ('`{VALUE}` is not a valid mac address for path `{PATH}`.');
MongooseError.messages.String.ip =
  ('`{VALUE}` is not a valid ip address for path `{PATH}`.');
MongooseError.messages.String.fqdn =
  ('`{VALUE}` is not a valid fully qualified domain name for path `{PATH}`.');
MongooseError.messages.String.alpha =
  ('`{VALUE}` is not a valid alpha value for path `{PATH}`.');
MongooseError.messages.String.alphanumeric =
  ('`{VALUE}` is not a valid alphanumeric value for path `{PATH}`.');
MongooseError.messages.String.md5 =
  ('`{VALUE}` is not a valid md5 value for path `{PATH}`.');
MongooseError.messages.String.creditcard =
  ('`{VALUE}` is not a valid credit card value for path `{PATH}`.');
MongooseError.messages.String.base64 =
  ('`{VALUE}` is not a valid base64 value for path `{PATH}`.');
MongooseError.messages.String.mobile =
  ('`{VALUE}` is not a valid mobile phone number value for path `{PATH}`.');
MongooseError.messages.String.mimetype =
  ('`{VALUE}` is not a valid mimetype value for path `{PATH}`.');


/**
 * Sets email validator.
 *
 * ####Example:
 *
 *     var s = new Schema({ n: { type: String, email: true })
 *     var M = db.model('M', s)
 *     var m = new M({ n: 'a@b' })
 *     m.save(function (err) {
 *       console.error(err) // validator error
 *       m.n = 'a@b.com';
 *       m.save() // success
 *     })
 *
 * @param {Boolean|Object} options email validation options
 * @param {String} [message] optional custom error message
 * @return {SchemaType} this
 * @see Customized Error Messages #error_messages_MongooseError-messages
 * @api public
 */
SchemaString.prototype.email = function email(options, message) {

  if (this.emailValidator) {
    this.validators = this.validators.filter(function (v) {
      return v.validator !== this.emailValidator;
    }, this);
  }

  if (options !== null && options !== undefined) {
    const msg =
      (options.message || message || MongooseError.messages.String.email);
    this.validators.push({
      validator: this.emailValidator = function (v) {
        return validator.isEmail(String(v));
      },
      message: msg,
      type: 'email'
    });
  }

  return this;

};


/**
 * Sets macaddress validator.
 *
 * ####Example:
 *
 *     var s = new Schema({ n: { type: String, macaddress: true })
 *     var M = db.model('M', s)
 *     var m = new M({ n: 'abc' })
 *     m.save(function (err) {
 *       console.error(err) // validator error
 *       m.n = 'FF:FF:FF:FF:FF:FF';
 *       m.save() // success
 *     })
 *
 * @param {Boolean|Object} options macaddress validation options
 * @param {String} [message] optional custom error message
 * @return {SchemaType} this
 * @see Customized Error Messages #error_messages_MongooseError-messages
 * @api public
 */
SchemaString.prototype.macaddress = function macaddress(options, message) {

  if (this.macaddressValidator) {
    this.validators = this.validators.filter(function (v) {
      return v.validator !== this.macaddressValidator;
    }, this);
  }

  if (options !== null && options !== undefined) {
    const msg =
      (options.message || message || MongooseError.messages.String.macaddress);
    this.validators.push({
      validator: this.macaddressValidator = function (v) {
        return validator.isMACAddress(String(v));
      },
      message: msg,
      type: 'macaddress'
    });
  }

  return this;

};


/**
 * Sets ip validator.
 *
 * ####Example:
 *
 *     var s = new Schema({ n: { type: String, ip: true })
 *     var M = db.model('M', s)
 *     var m = new M({ n: 'abc' })
 *     m.save(function (err) {
 *       console.error(err) // validator error
 *       m.n = '127.0.0.1';
 *       m.save() // success
 *     })
 *
 * @param {Boolean|Object} options ip validation options
 * @param {String} [message] optional custom error message
 * @return {SchemaType} this
 * @see Customized Error Messages #error_messages_MongooseError-messages
 * @api public
 */
SchemaString.prototype.ip = function ip(options, message) {

  if (this.ipValidator) {
    this.validators = this.validators.filter(function (v) {
      return v.validator !== this.ipValidator;
    }, this);
  }

  if (options !== null && options !== undefined) {
    const msg =
      (options.message || message || MongooseError.messages.String.ip);
    this.validators.push({
      validator: this.ipValidator = function (v) {
        return validator.isIP(String(v));
      },
      message: msg,
      type: 'ip'
    });
  }

  return this;

};


/**
 * Sets fqdn validator.
 *
 * ####Example:
 *
 *     var s = new Schema({ n: { type: String, fqdn: true })
 *     var M = db.model('M', s)
 *     var m = new M({ n: 'abc' })
 *     m.save(function (err) {
 *       console.error(err) // validator error
 *       m.n = 'domain.com';
 *       m.save() // success
 *     })
 *
 * @param {Boolean|Object} options fqdn validation options
 * @param {String} [message] optional custom error message
 * @return {SchemaType} this
 * @see Customized Error Messages #error_messages_MongooseError-messages
 * @api public
 */
SchemaString.prototype.fqdn = function fqdn(options, message) {

  if (this.fqdnValidator) {
    this.validators = this.validators.filter(function (v) {
      return v.validator !== this.fqdnValidator;
    }, this);
  }

  if (options !== null && options !== undefined) {
    const msg =
      (options.message || message || MongooseError.messages.String.fqdn);
    this.validators.push({
      validator: this.fqdnValidator = function (v) {
        return validator.isFQDN(String(v));
      },
      message: msg,
      type: 'fqdn'
    });
  }

  return this;

};


/**
 * Sets alpha validator.
 *
 * ####Example:
 *
 *     var s = new Schema({ n: { type: String, alpha: true })
 *     var M = db.model('M', s)
 *     var m = new M({ n: 'abc1' })
 *     m.save(function (err) {
 *       console.error(err) // validator error
 *       m.n = 'abc';
 *       m.save() // success
 *     })
 *
 * @param {Boolean|Object} options alpha validation options
 * @param {String} [message] optional custom error message
 * @return {SchemaType} this
 * @see Customized Error Messages #error_messages_MongooseError-messages
 * @api public
 */
SchemaString.prototype.alpha = function alpha(options, message) {

  if (this.alphaValidator) {
    this.validators = this.validators.filter(function (v) {
      return v.validator !== this.alphaValidator;
    }, this);
  }

  if (options !== null && options !== undefined) {
    const msg =
      (options.message || message || MongooseError.messages.String.alpha);
    this.validators.push({
      validator: this.alphaValidator = function (v) {
        return validator.isAlpha(String(v));
      },
      message: msg,
      type: 'alpha'
    });
  }

  return this;

};


/**
 * Sets alphanumeric validator.
 *
 * ####Example:
 *
 *     var s = new Schema({ n: { type: String, alphanumeric: true })
 *     var M = db.model('M', s)
 *     var m = new M({ n: 'abc' })
 *     m.save(function (err) {
 *       console.error(err) // validator error
 *       m.n = 'abc1';
 *       m.save() // success
 *     })
 *
 * @param {Boolean|Object} options alphanumeric validation options
 * @param {String} [message] optional custom error message
 * @return {SchemaType} this
 * @see Customized Error Messages #error_messages_MongooseError-messages
 * @api public
 */
SchemaString.prototype.alphanumeric = function alphanumeric(options, message) {

  if (this.alphanumericValidator) {
    this.validators = this.validators.filter(function (v) {
      return v.validator !== this.alphanumericValidator;
    }, this);
  }

  if (options !== null && options !== undefined) {
    const msg =
      (options.message || message || MongooseError.messages.String.alphanumeric);
    this.validators.push({
      validator: this.alphanumericValidator = function (v) {
        return validator.isAlphanumeric(String(v));
      },
      message: msg,
      type: 'alphanumeric'
    });
  }

  return this;

};


/**
 * Sets md5 validator.
 *
 * ####Example:
 *
 *     var s = new Schema({ n: { type: String, md5: true })
 *     var M = db.model('M', s)
 *     var m = new M({ n: 'abc' })
 *     m.save(function (err) {
 *       console.error(err) // validator error
 *       m.n = 'd94f3f016ae679c3008de268209132f2';
 *       m.save() // success
 *     })
 *
 * @param {Boolean|Object} options md5 validation options
 * @param {String} [message] optional custom error message
 * @return {SchemaType} this
 * @see Customized Error Messages #error_messages_MongooseError-messages
 * @api public
 */
SchemaString.prototype.md5 = function md5(options, message) {

  if (this.md5Validator) {
    this.validators = this.validators.filter(function (v) {
      return v.validator !== this.md5Validator;
    }, this);
  }

  if (options !== null && options !== undefined) {
    const msg =
      (options.message || message || MongooseError.messages.String.md5);
    this.validators.push({
      validator: this.md5Validator = function (v) {
        return validator.isMD5(String(v));
      },
      message: msg,
      type: 'md5'
    });
  }

  return this;

};


/**
 * Sets uuid validator.
 *
 * ####Example:
 *
 *     var s = new Schema({ n: { type: String, uuid: true })
 *     var M = db.model('M', s)
 *     var m = new M({ n: 'abc' })
 *     m.save(function (err) {
 *       console.error(err) // validator error
 *       m.n = 'A987FBC9-4BED-5078-AF07-9141BA07C9F3';
 *       m.save() // success
 *     })
 *
 * @param {Boolean|Object} options uuid validation options
 * @param {String} [message] optional custom error message
 * @return {SchemaType} this
 * @see Customized Error Messages #error_messages_MongooseError-messages
 * @api public
 */
SchemaString.prototype.uuid = function uuid(options, message) {

  if (this.uuidValidator) {
    this.validators = this.validators.filter(function (v) {
      return v.validator !== this.uuidValidator;
    }, this);
  }

  if (options !== null && options !== undefined) {
    const msg =
      (options.message || message || MongooseError.messages.String.uuid);
    this.validators.push({
      validator: this.uuidValidator = function (v) {
        return validator.isUUID(String(v));
      },
      message: msg,
      type: 'uuid'
    });
  }

  return this;

};


/**
 * Sets creditcard validator.
 *
 * ####Example:
 *
 *     var s = new Schema({ n: { type: String, creditcard: true })
 *     var M = db.model('M', s)
 *     var m = new M({ n: 'abc' })
 *     m.save(function (err) {
 *       console.error(err) // validator error
 *       m.n = '4716-2210-5188-5662';
 *       m.save() // success
 *     })
 *
 * @param {Boolean|Object} options creditcard validation options
 * @param {String} [message] optional custom error message
 * @return {SchemaType} this
 * @see Customized Error Messages #error_messages_MongooseError-messages
 * @api public
 */
SchemaString.prototype.creditcard = function creditcard(options, message) {

  if (this.creditcardValidator) {
    this.validators = this.validators.filter(function (v) {
      return v.validator !== this.creditcardValidator;
    }, this);
  }

  if (options !== null && options !== undefined) {
    const msg =
      (options.message || message || MongooseError.messages.String.creditcard);
    this.validators.push({
      validator: this.creditcardValidator = function (v) {
        return validator.isCreditCard(String(v));
      },
      message: msg,
      type: 'creditcard'
    });
  }

  return this;

};


/**
 * Sets base64 validator.
 *
 * ####Example:
 *
 *     var s = new Schema({ n: { type: String, base64: true })
 *     var M = db.model('M', s)
 *     var m = new M({ n: 'abc' })
 *     m.save(function (err) {
 *       console.error(err) // validator error
 *       m.n = 'Zm9vYmE=';
 *       m.save() // success
 *     })
 *
 * @param {Boolean|Object} options base64 validation options
 * @param {String} [message] optional custom error message
 * @return {SchemaType} this
 * @see Customized Error Messages #error_messages_MongooseError-messages
 * @api public
 */
SchemaString.prototype.base64 = function base64(options, message) {

  if (this.base64Validator) {
    this.validators = this.validators.filter(function (v) {
      return v.validator !== this.base64Validator;
    }, this);
  }

  if (options !== null && options !== undefined) {
    const msg =
      (options.message || message || MongooseError.messages.String.base64);
    this.validators.push({
      validator: this.base64Validator = function (v) {
        return validator.isBase64(String(v));
      },
      message: msg,
      type: 'base64'
    });
  }

  return this;

};


/**
 * Sets mobile validator.
 *
 * ####Example:
 *
 *     var s = new Schema({ n: { type: String, mobile: true })
 *     var M = db.model('M', s)
 *     var m = new M({ n: 'abc' })
 *     m.save(function (err) {
 *       console.error(err) // validator error
 *       m.n = '255714676767';
 *       m.save() // success
 *     })
 *
 * @param {Boolean|Object} options mobile validation options
 * @param {String} [message] optional custom error message
 * @return {SchemaType} this
 * @see Customized Error Messages #error_messages_MongooseError-messages
 * @api public
 */
SchemaString.prototype.mobile = function mobile(options, message) {

  if (this.mobileValidator) {
    this.validators = this.validators.filter(function (v) {
      return v.validator !== this.mobileValidator;
    }, this);
  }

  if (options !== null && options !== undefined) {
    const msg =
      (options.message || message || MongooseError.messages.String.mobile);
    this.validators.push({
      validator: this.mobileValidator = function (v) {
        return validator.isMobilePhone(String(v));
      },
      message: msg,
      type: 'mobile'
    });
  }

  return this;

};


/**
 * Sets mimetype validator.
 *
 * ####Example:
 *
 *     var s = new Schema({ n: { type: String, mimetype: true })
 *     var M = db.model('M', s)
 *     var m = new M({ n: 'abc' })
 *     m.save(function (err) {
 *       console.error(err) // validator error
 *       m.n = 'application/json';
 *       m.save() // success
 *     })
 *
 * @param {Boolean|Object} options mimetype validation options
 * @param {String} [message] optional custom error message
 * @return {SchemaType} this
 * @see Customized Error Messages #error_messages_MongooseError-messages
 * @api public
 */
SchemaString.prototype.mimetype = function mimetype(options, message) {

  if (this.mimetypeValidator) {
    this.validators = this.validators.filter(function (v) {
      return v.validator !== this.mimetypeValidator;
    }, this);
  }

  if (options !== null && options !== undefined) {
    const msg =
      (options.message || message || MongooseError.messages.String.mimetype);
    this.validators.push({
      validator: this.mimetypeValidator = function (v) {
        return validator.isMimeType(String(v));
      },
      message: msg,
      type: 'mimetype'
    });
  }

  return this;

};