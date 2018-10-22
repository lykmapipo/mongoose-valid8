'use strict';


/* dependencies */
const path = require('path');
const mongoose = require('mongoose');

/* extend string schema type with custom validations */
require(path.join(__dirname, 'lib', 'string'));

/* extend number schema type with custom validations */
require(path.join(__dirname, 'lib', 'number'));

/* exports mongoose */
module.exports = exports = mongoose;
