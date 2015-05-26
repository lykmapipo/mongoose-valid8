'use strict';

//dependencies
var validator = require('validator');
var _ = require('lodash');


//extend validator with isNotNull validations
validator.extend('isNotNull', function(value) {
    return !_.isEmpty(value);
});


//isNotNull alias
validator.extend('isRequired', function(value) {
    return !_.isEmpty(value);
});


//sanitizers
var sanitizers = ['blacklist', 'escape', 'ltrim', 'normalizeEmail',
    'rtrim', 'stripLow', 'toBoolean', 'toDate',
    'toFloat', 'toInt', 'toString', 'trim', 'whitelist'
];


//unknown validator and sanitizers
var unknowns = ['version', 'extend', 'init'];


//grab only validations from validator
var _clean = _.union(unknowns, sanitizers);
var validations = _.remove(_.keys(validator), function(value) {
    return _.indexOf(_clean, value) === -1;
});


/**
 * @description build schema field validator based on validation type and its
 *              options
 * @param  {String} action  valid validator js validation
 * @param  {Object|String|Date} options options to be passed to validator js validations
 */
function buildValidator(action, options) {
    return {
        validator: function(value, done) {
            //if only validator provided without
            //options
            if (_.isBoolean(options)) {
                done(validator[action].call(validator, value));
            }

            //otherwise pass additional options to validator
            else {
                var args = [value];

                //prepare validator options
                var _options = _.clone(options);
                options = _.omit(_options, 'message');

                //extend args with options
                _.forEach(options, function(option) {
                    args.push(option);
                });

                done(validator[action].apply(validator, args));
            }
        },

        //pass a custom error message
        //othewise use default mongoose error messages
        message: _.isBoolean(options) ? undefined : options.message,

        //pass the validator type
        //to signal what validator used
        type: action.replace(/is/, '')
    };
}


/**
 * @description extend schema field with additional validator validations
 *              based on schema field options
 * @param  {Schema} schema valid mongoose schema
 */
module.exports = function(schema) {

    //build path validations
    schema.eachPath(function(pathname, schemaType) {

        if (schemaType.options) {
            //grab field options
            var options = _.keys(schemaType.options);

            options.forEach(function(option) {
                // check for validator validations
                if (validations.indexOf(option) > -1) {

                    //build validatior
                    var _validator =
                        buildValidator(option, schemaType.options[option]);

                    //push validator to current schema type
                    //validators collection
                    schemaType.validators.push(_validator);
                }
            });
        }

    });
};