'use strict';


/* dependencies */
const faker = require('faker');
const path = require('path');
const { expect } = require('chai');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require(path.join(__dirname, '..', 'index'));


/* test runner */
function test(options) {

  //prepare testing schema
  const fields = {
    content: {
      type: options.type || String
    }
  };

  fields.content[options.validator] = options.args || true;

  const modelName = faker.date.past().getTime().toString();
  const UserSchema = new Schema(fields);
  const User = mongoose.model(modelName, UserSchema);


  //test for valid input
  if (options.valid) {
    options.valid.forEach(function (valid) {
      new User({
        content: valid
      }).validate(function (error) {
        expect(error).to.not.exist;
      });
    });
  }

  //test for invalid input
  if (options.invalid) {
    options.invalid.forEach(function (invalid) {
      new User({
        content: invalid
      }).validate(function (error) {
        expect(error).to.exist;
        expect(error.errors).to.exist;
        expect(error.errors.content).to.exist;
        expect(error.errors.content.kind).to.exist;
        expect(error.errors.content.value).to.exist;
        expect([options.type.name, options.validator])
          .to.be.include(error.errors.content.kind);
        expect(error.errors.content.value).to.be.equal(invalid);
      });
    });
  }
}

//source https://github.com/chriso/validator.js/blob/master/test/validators.js
//with modifications to make work for mongoose-valid8
describe('Validators', () => {
  /*jshint camelcase:false*/
  /*jshint -W100 */

  it('should validate email addresses', () => {
    test({
      type: String,
      validator: 'email',
      valid: [
        'foo@bar.com',
        'x@x.au',
        'foo@bar.com.au',
        'foo+bar@bar.com',
        'hans.m端ller@test.com',
        'hans@m端ller.com',
        'test|123@m端ller.com',
        'test123+ext@gmail.com'
      ],
      invalid: [
        'invalidemail@',
        'invalid.com',
        '@invalid.com',
        'foo@bar.com.',
        'somename@ｇｍａｉｌ.com',
        'foo@bar.co.uk.',
        'z@co.c'
      ]
    });
  });

  it('should validate MAC addresses', () => {
    test({
      type: String,
      validator: 'macaddress',
      valid: [
        'ab:ab:ab:ab:ab:ab',
        'FF:FF:FF:FF:FF:FF',
        '01:02:03:04:05:ab',
        '01:AB:03:04:05:06',
      ],
      invalid: [
        'abc',
        '01:02:03:04:05',
        '01:02:03:04::ab',
        '1:2:3:4:5:6',
        'AB:CD:EF:GH:01:02',
      ]
    });
  });


  it('should validate IP addresses', () => {
    test({
      type: String,
      validator: 'ip',
      valid: [
        '127.0.0.1',
        '0.0.0.0',
        '255.255.255.255',
        '1.2.3.4',
        '::1',
        '2001:db8:0000:1:1:1:1:1',
        '2001:41d0:2:a141::1',
        '::ffff:127.0.0.1',
        '::0000',
        '0000::',
        '1::',
        '1111:1:1:1:1:1:1:1',
        'fe80::a6db:30ff:fe98:e946',
        '::',
        '::ffff:127.0.0.1',
        '0:0:0:0:0:ffff:127.0.0.1',
      ],
      invalid: [
        'abc',
        '256.0.0.0',
        '0.0.0.256',
        '26.0.0.256',
        '0200.200.200.200',
        '200.0200.200.200',
        '200.200.0200.200',
        '200.200.200.0200',
        '::banana',
        'banana::',
        '::1banana',
        '::1::',
        '1:',
        ':1',
        ':1:1:1::2',
        '1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1',
        '::11111',
        '11111:1:1:1:1:1:1:1',
        '2001:db8:0000:1:1:1:1::1',
        '0:0:0:0:0:0:ffff:127.0.0.1',
        '0:0:0:0:ffff:127.0.0.1',
      ]
    });
  });

  it('should validate FQDN', () => {
    test({
      type: String,
      validator: 'fqdn',
      valid: [
        'domain.com',
        'dom.plato',
        'a.domain.co',
        'foo--bar.com',
        'xn--froschgrn-x9a.com',
        'rebecca.blackfriday',
      ],
      invalid: [
        'abc',
        '256.0.0.0',
        '_.com',
        '*.some.com',
        's!ome.com',
        'domain.com/',
        '/more.com',
      ],
    });
  });

  it('should validate alpha strings', () => {
    test({
      type: String,
      validator: 'alpha',
      valid: [
        'abc',
        'ABC',
        'FoObar',
      ],
      invalid: [
        'abc1',
        '  foo  ',
        '',
        'ÄBC',
        'FÜübar',
        'Jön',
        'Heiß',
      ],
    });
  });

  it('should validate alphanumeric strings', () => {
    test({
      type: String,
      validator: 'alphanumeric',
      valid: [
        'abc123',
        'ABC11',
      ],
      invalid: [
        'abc ',
        'foo!!',
        'ÄBC',
        'FÜübar',
        'Jön',
      ],
    });
  });

  it('should validate numeric value', () => {
    test({
      type: Number,
      validator: 'numeric',
      valid: [
        123,
        '123',
        '00123',
        '0',
        '123.123',
        '+123',
        '-0',
        '-00123',
      ],
      invalid: [],
    });
  });

  it('should validate integers', () => {
    test({
      type: Number,
      validator: 'integer',
      valid: [
        '13',
        '123',
        '0',
        '123',
        '-0',
        '+1',
        '01',
        '-01',
        '000',
      ],
      invalid: [
        123.123,
      ],
    });
  });

  it('should validate floats', () => {
    test({
      type: Number,
      validator: 'float',
      valid: [
        '123',
        '123.',
        '123.123',
        '-123.123',
        '-0.123',
        '+0.123',
        '0.123',
        '.0',
        '-.123',
        '+.123',
        '01.123',
        '-0.22250738585072011e-307',
      ],
      invalid: [
        '+',
        '-',
        '.',
        'foo',
      ],
    });
  });

  it('should validate md5 strings', () => {
    test({
      type: String,
      validator: 'md5',
      valid: [
        'd94f3f016ae679c3008de268209132f2',
        '751adbc511ccbe8edf23d486fa4581cd',
        '88dae00e614d8f24cfd5a8b3f8002e93',
        '0bf1c35032a71a14c2f719e5a14c1e96',
      ],
      invalid: [
        'KYT0bf1c35032a71a14c2f719e5a14c1',
        'q94375dj93458w34',
        '39485729348',
        '%&FHKJFvk',
      ],
    });
  });

  it('should validate UUIDs', () => {
    test({
      type: String,
      validator: 'uuid',
      valid: [
        'A987FBC9-4BED-3078-CF07-9141BA07C9F3',
        'A987FBC9-4BED-4078-8F07-9141BA07C9F3',
        'A987FBC9-4BED-5078-AF07-9141BA07C9F3',
      ],
      invalid: [
        '',
        'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3',
        'A987FBC9-4BED-3078-CF07-9141BA07C9F3xxx',
        'A987FBC94BED3078CF079141BA07C9F3',
        '934859',
        '987FBC9-4BED-3078-CF07A-9141BA07C9F3',
        'AAAAAAAA-1111-1111-AAAG-111111111111',
      ],
    });
  });

  it('should validate credit cards', () => {
    test({
      type: String,
      validator: 'creditcard',
      valid: [
        '375556917985515',
        '36050234196908',
        '4716461583322103',
        '4716-2210-5188-5662',
        '4929 7226 5379 7141',
        '5398228707871527',
        '6283875070985593',
        '6263892624162870',
        '6234917882863855',
        '6234698580215388',
        '6226050967750613',
        '6246281879460688',
        '2222155765072228',
        '2225855203075256',
        '2720428011723762',
        '2718760626256570',
        '6765780016990268',
      ],
      invalid: [
        'foo',
        'foo',
        '5398228707871528',
        '2718760626256571',
        '2721465526338453',
        '2220175103860763',
        '375556917985515999999993',
        '899999996234917882863855',
        'prefix6234917882863855',
        '623491788middle2863855',
        '6234917882863855suffix',
      ],
    });
  });

  it('should validate base64 strings', () => {
    test({
      type: String,
      validator: 'base64',
      valid: [
        'Zg==',
        'Zm8=',
        'Zm9v',
        'Zm9vYg==',
        'Zm9vYmE=',
        'Zm9vYmFy',
        'TG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdC4=',
        'Vml2YW11cyBmZXJtZW50dW0gc2VtcGVyIHBvcnRhLg==',
        'U3VzcGVuZGlzc2UgbGVjdHVzIGxlbw==',
        'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuMPNS1Ufof9EW/M98FNw' +
        'UAKrwflsqVxaxQjBQnHQmiI7Vac40t8x7pIb8gLGV6wL7sBTJiPovJ0V7y7oc0Ye' +
        'rhKh0Rm4skP2z/jHwwZICgGzBvA0rH8xlhUiTvcwDCJ0kc+fh35hNt8srZQM4619' +
        'FTgB66Xmp4EtVyhpQV+t02g6NzK72oZI0vnAvqhpkxLeLiMCyrI416wHm5Tkukhx' +
        'QmcL2a6hNOyu0ixX/x2kSFXApEnVrJ+/IxGyfyw8kf4N2IZpW5nEP847lpfj0SZZ' +
        'Fwrd1mnfnDbYohX2zRptLy2ZUn06Qo9pkG5ntvFEPo9bfZeULtjYzIl6K8gJ2uGZ' +
        'HQIDAQAB',
      ],
      invalid: [
        '12345',
        '',
        'Vml2YW11cyBmZXJtZtesting123',
        'Zg=',
        'Z===',
        'Zm=8',
        '=m9vYg==',
        'Zm9vYmFy====',
      ],
    });
  });

  it('should validate mobile phone number', () => {
    test({
      type: String,
      validator: 'mobile',
      valid: [
        '+971502674453',
        '+971521247658',
        '+971541255684',
        '+971555454458',
        '+971561498855',
        '+971585215778',
        '971585215778',
        '0585215778',
        '585215778',
        '255714080898',
      ],
      invalid: [
        ''
      ],
    });
  });

  it('should validate MIME types', () => {
    test({
      type: String,
      validator: 'mimetype',
      valid: [
        'application/json',
        'application/xhtml+xml',
        'audio/mp4',
        'image/bmp',
        'font/woff2',
        'message/http',
        'model/vnd.gtw',
        'multipart/form-data',
        'multipart/form-data; boundary=something',
        'multipart/form-data; charset=utf-8; boundary=something',
        'multipart/form-data; boundary=something; charset=utf-8',
        'multipart/form-data; boundary=something; charset="utf-8"',
        'multipart/form-data; boundary="something"; charset=utf-8',
        'multipart/form-data; boundary="something"; charset="utf-8"',
        'text/css',
        'text/plain; charset=utf8',
        'Text/HTML;Charset="utf-8"',
        'text/html;charset=UTF-8',
        'Text/html;charset=UTF-8',
        'text/html; charset=us-ascii',
        'text/html; charset=us-ascii (Plain text)',
        'text/html; charset="us-ascii"',
        'video/mp4',
      ],
      invalid: [
        '',
        ' ',
        '/',
        'f/b',
        'application',
        'application\\json',
        'application/json/text',
        'application/json; charset=utf-8',
        'audio/mp4; charset=utf-8',
        'image/bmp; charset=utf-8',
        'font/woff2; charset=utf-8',
        'message/http; charset=utf-8',
        'model/vnd.gtw; charset=utf-8',
        'video/mp4; charset=utf-8',
      ],
    });
  });

});
