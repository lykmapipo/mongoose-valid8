# mongoose-valid8

[![Build Status](https://travis-ci.org/lykmapipo/mongoose-valid8.svg?branch=master)](https://travis-ci.org/lykmapipo/mongoose-valid8)

Additional mongoose schema validations based on [validator.js](https://github.com/chriso/validator.js)

## Usage

```javascript
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//apply mongoose-valid8 plugin to mongoose
mongoose.plugin(require('mongoose-valid8'));

...

//define you schema using validator
var PersonSchema = new Schema({
    email:{
            type:String,
            isEmail:true
        },
    registeredAt:{
            type:Date,
            isDate:{
                    message:'Registered at must be a valid date'
                    //other options
                }
        }
});
var Person = mongoose.model('User',UserSchema);

//validate
new Person({email:'invalidemail'})
    .validate(function(error){
        //errors
        ... 
    });

//or save
new Person({email:'invalidemail'})
    .save(function(error){
        //errors
        ... 
    });

...

```

## How to Define Validation
`mongoose-valid8` utilizes all defined [validator js validations methods](https://github.com/chriso/validator.js#validators) and bind them to schema fields for validations.

Validations are defined by following format:
```javascript
validator:Boolean || Object
```

- When validation defined in the format
```javascript
var PersonSchema = new Schema({
    email:{
            type:String,
            isEmail:true
    }
});
```
Error message will be default to `mongoose default errors`.


- When validation defined in the format
```javascript
var PersonSchema = new Schema({
    email:{
            type:String,
            isEmail:{
                message:'Email must be a valid email address',
                options:{//other validator js isEmail options}
            }
    }
});
```
Error message will be `custom supplied message` and gives ability to pass additional `validator options`.

`options` added follows `validator js` validators definitions, thus if a validator accept primitives arguments, they can be defined inline with message and if it accepts plain object it must be defined using key `options`.

- Example of validator accept a primitive argument [isLength(str, min [, max])](https://github.com/chriso/validator.js#validators)
```javascript
var PersonSchema = new Schema({
    password:{
            type:String,
            isLength:{
                message:'Password must have more than 8 characters',
                min:8
            }
    }
});
```

- Example of validator accept a plain object options [isEmail(str [, options])](https://github.com/chriso/validator.js#validators)
```javascript
var PersonSchema = new Schema({
    email:{
            type:String,
            isEmail:{
                message:'Email must be a valid email address',
                options:{
                        allow_utf8_local_part: false
                    }
            }
    }
});
```



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