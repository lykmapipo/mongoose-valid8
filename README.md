# mongoose-valid8

[![Build Status](https://travis-ci.org/lykmapipo/mongoose-valid8.svg?branch=master)](https://travis-ci.org/lykmapipo/mongoose-valid8)

Additional mongoose schema validations based on [validator.js](https://github.com/chriso/validator.js)

*Note!: v1.0.0 drops support for all validators and only specific validators are available*

## Requirements

- [NodeJS v8.11.1+](https://nodejs.org)
- [Npm v5.6.0+](https://www.npmjs.com/)
- [MongoDB v3.4.10+](https://www.mongodb.com/)
- [Mongoose v5.1.2+](https://github.com/Automattic/mongoose)

## Installation

```sh
npm install mongoose mongoose-valid8 --save
```

## Usage

```javascript
const mongoose = require('mongoose');
require('mongoose-valid8');
const Schema = mongoose.Schema;


//define you schema using validator
const PersonSchema = new Schema({
  email: {
    type: String,
    email: true
  }
});
const Person = mongoose.model('User', UserSchema);


//validate
new Person({ email: 'invalidemail' })
  .validate(function (error) {
    //errors
    ...
  });


//or save
new Person({ email: 'invalidemail' })
  .save(function (error) {
    //errors
    ...
  });

```

## Available Validations

## String
- `email`
- `macaddres`
- `ip`
- `fqdn`
- `alpha`
- `alphanumeric`
- `md5`
- `uuid`
- `creditcard`
- `base64`
- `mobile`
- `mimetype`

## Number
- `numeric`
- `integer`
- `float`

## Testing
* Clone this repository

* Install all development dependencies
```sh
$ npm install
```
* Then run test
```sh
$ npm test
```

## Contribute
It will be nice, if you open an issue first so that we can know what is going on, then, fork this repo and push in your ideas. Do not forget to add a bit of test(s) of what value you adding.


## Licence
The MIT License (MIT)

Copyright (c) 2015 lykmapipo & Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 
