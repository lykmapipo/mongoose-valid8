'use strict';


/* dependencies */
const faker = require('faker');
const path = require('path');
const { expect } = require('chai');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require(path.join(__dirname, '..', 'index'));

/* .env */
process.env.DEFAULT_COUNTRY_CODES = 'TZ,US';


/* TODO refactor per schema type */

/* test runner */
function test(options) {

  //prepare testing schema
  const fields = {
    content: {
      type: options.type || String
    }
  };

  fields.content[options.validator] =
    (options.args !== null && options.args !== undefined ? options.args : true);

  const modelName = faker.date.past().getTime().toString();
  const UserSchema = new Schema(fields);
  const User = mongoose.model(modelName, UserSchema);


  //test for valid input
  if (options.valid) {
    options.valid.forEach(function (valid) {
      const user = new User({ content: valid });
      user.validate(function (error) {
        expect(error).to.not.exist;
        if (options.assert) {
          options.assert(user.content);
        }
      });
    });
  }

  //test for invalid input
  if (options.invalid) {
    options.invalid.forEach(function (invalid) {
      const user = new User({ content: invalid });
      user.validate(function (error) {
        expect(error).to.exist;
        expect(error.errors).to.exist;
        expect(error.errors.content).to.exist;
        expect(error.errors.content.kind).to.exist;
        expect(error.errors.content.value).to.exist;
        expect([options.type.name, options.validator])
          .to.be.include(error.errors.content.kind);
        expect(error.errors.content.value).to.be.eql(invalid);
        if (options.assert) {
          options.assert(user.content);
        }
      });
    });
  }
}


describe('String Validators', () => {
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

  it('should convert to capitalize value', () => {
    test({
      type: String,
      validator: 'capitalize',
      valid: [
        'fred',
        'freD',
      ],
      assert: function (val) {
        expect(val).to.be.eql('Fred');
      }
    });
  });

  it('should convert to start case(title case) value', () => {
    test({
      type: String,
      validator: 'startcase',
      valid: [
        'fred Fuga',
        'freD FuGa',
        'freD---FuGa'
      ],
      assert: function (val) {
        expect(val).to.be.eql('Fred Fuga');
      }
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
        'Vml2YW11cyBmZXJtZtesting123',
        'Zg=',
        'Z===',
        'Zm=8',
        '=m9vYg==',
        'Zm9vYmFy====',
      ],
    });
  });

  it('should validate datauri strings', () => {
    test({
      type: String,
      validator: 'datauri',
      valid: [
        'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCBmaWxsPSIjMDBCMUZGIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIvPjwvc3ZnPg==',
        ' data:,Hello%2C%20World!',
        ' data:,Hello World!',
        ' data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D',
        ' data:text/html,%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E',
        'data:,A%20brief%20note',
        'data:text/html;charset=US-ASCII,%3Ch1%3EHello!%3C%2Fh1%3E',
      ],
      invalid: [
        'dataxbase64',
        'data:HelloWorld',
        'data:text/html;charset=,%3Ch1%3EHello!%3C%2Fh1%3E',
        'data:text/html;charset,%3Ch1%3EHello!%3C%2Fh1%3E',
        'data:base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD///+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4Ug9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC',
        '',
        'http://wikipedia.org',
        'base64',
      ],
    });
  });

  it('should validate phone number', () => {
    test({
      type: String,
      validator: 'phone',
      valid: [
        '+971585215778',
        '800-621-3362',
        '0714080898',
        '255714080898',
        '+255714080898',
        '022 211 1174',
        '0800110064'
      ],
      invalid: [
        '',
        '123'
      ]
    });
  });

  it('should validate phone number', () => {
    test({
      type: String,
      validator: 'phone',
      args: { countries: ['TZ', 'US'] },
      valid: [
        '+971585215778',
        '800-621-3362',
        '0714080898',
        '255714080898',
        '+255714080898',
        '022 211 1174',
        '0800110064'
      ],
      invalid: [
        '',
        '123'
      ]
    });
  });

  it('should validate phone number and format into e164', () => {
    test({
      type: String,
      validator: 'phone',
      args: { countries: ['TZ'], e164: true },
      valid: [
        '0714080898',
        '255714080898',
        '+255714080898'
      ],
      assert: function (val) {
        expect(val).to.be.equal('255714080898');
      }
    });
  });

  it('should validate phone number', () => {
    test({
      type: String,
      validator: 'phone',
      args: { countries: 'TZ' },
      valid: [
        '+971585215778',
        '800-621-3362',
        '0714080898',
        '255714080898',
        '+255714080898',
        '022 211 1174',
        '0800110064'
      ],
      invalid: [
        '',
        '123'
      ],
    });
  });

  it('should validate mobile phone number', () => {
    test({
      type: String,
      validator: 'phone',
      args: { mobile: true },
      valid: [
        '+971502674453',
        '0714080898',
        '255714080898',
        '+255714080898',
      ],
      invalid: [
        '',
        '123',
        '022 211 1174',
        '800-621-3362',
        '0800110064'
      ],
    });
  });

  it('should validate phone number', () => {
    test({
      type: String,
      validator: 'phone',
      args: { fixedline: true },
      valid: [
        '800-621-3362',
        '022 211 1174',
        '0800110064'
      ],
      invalid: [
        '',
        '123',
        '+971585215778',
        '+255714080898',
        '0714080898'
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

  it('should validate url', () => {
    test({
      type: String,
      validator: 'url',
      valid: [
        'foobar.com',
        'www.foobar.com',
        'foobar.com/',
        'valid.au',
        'http://www.foobar.com/',
        'HTTP://WWW.FOOBAR.COM/',
        'https://www.foobar.com/',
        'HTTPS://WWW.FOOBAR.COM/',
        'http://www.foobar.com:23/',
        'http://www.foobar.com:65535/',
        'http://www.foobar.com:5/',
        'https://www.foobar.com/',
        'ftp://www.foobar.com/',
      ],
      invalid: [
        '',
        ' ',
        'xyz://foobar.com',
        'invalid/',
        'invalid.x',
        'invalid.',
        '.com',
        'http://com/',
      ],
    });
  });

  it('should validate jwt strings', () => {
    test({
      type: String,
      validator: 'jwt',
      valid: [
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dnZWRJbkFzIjoiYWRtaW4iLCJpYXQiOjE0MjI3Nzk2Mzh9.gzSraSYS8EXBxLN_oWnFSRgCzcmJmMjLiuyu5CSpyHI',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb3JlbSI6Imlwc3VtIn0.ymiJSsMJXR6tMSr8G9usjQ15_8hKPDv_CArLhxw28MI',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb2xvciI6InNpdCIsImFtZXQiOlsibG9yZW0iLCJpcHN1bSJdfQ.rRpe04zbWbbJjwM43VnHzAboDzszJtGrNsUxaqQ-GQ8',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqb2huIjp7ImFnZSI6MjUsImhlaWdodCI6MTg1fSwiamFrZSI6eyJhZ2UiOjMwLCJoZWlnaHQiOjI3MH19.YRLPARDmhGMC3BBk_OhtwwK21PIkVCqQe8ncIRPKo-E',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ' // No signature
      ],
      invalid: [
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        '$Zs.ewu.su84',
        'ks64$S/9.dy$§kz.3sd73b'
      ],
    });
  });

  it('should validate hexadecimal strings', () => {
    test({
      type: String,
      validator: 'hexadecimal',
      valid: [
        'deadBEEF',
        'ff0044',
        '0xff0044',
        '0XfF0044',
      ],
      invalid: [
        'abcdefg',
        '',
        '..',
      ],
    });
  });

  it('should validate hexacolor strings', () => {
    test({
      type: String,
      validator: 'hexacolor',
      valid: [
        '#ff0034',
        '#CCCCCC',
        'fff',
        '#f00',
      ],
      invalid: [
        '#ff',
        'fff0a',
        '#ff12FG',
      ],
    });
  });

});


describe('Number Validators', () => {
  /*jshint camelcase:false*/
  /*jshint -W100 */

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
});


describe('Array Validators', () => {
  /*jshint camelcase:false*/
  /*jshint -W100 */

  it('should validate empty array', () => {
    test({
      type: [String],
      validator: 'empty',
      args: false,
      valid: [
        ['foo@bar.com']
      ],
      invalid: [
        []
      ]
    });
  });


  it('should validate empty array', () => {
    test({
      type: [String],
      validator: 'empty',
      args: true,
      valid: [
        []
      ]
    });
  });

  it('should compact primitive array', () => {
    test({
      type: [String],
      validator: 'compact',
      valid: [
        ['a', '', undefined, null, 'b']
      ],
      assert: function (val) {
        expect(val).to.be.eql(['a', 'b']);
      }
    });
  });

  it('should compact ObjectId array', () => {
    const oid = new mongoose.Types.ObjectId();
    test({
      type: [Schema.Types.ObjectId],
      validator: 'compact',
      valid: [
        [oid, '', undefined, null]
      ],
      assert: function (val) {
        expect(val).to.be.eql([oid]);
      }
    });
  });

  it('should remove duplicates on primitive array', () => {
    test({
      type: [String],
      validator: 'duplicate',
      args: false,
      valid: [
        ['a', 'a', undefined, null, 'b', 'b']
      ],
      assert: function (val) {
        expect(val).to.be.eql(['a', 'b']);
      }
    });
  });

  it('should remove duplicates on ObjectId', () => {
    const oid1 = new mongoose.Types.ObjectId();
    const oid2 = new mongoose.Types.ObjectId();
    test({
      type: [Schema.Types.ObjectId],
      validator: 'duplicate',
      args: false,
      valid: [
        [oid1, undefined, null, oid1, oid2, oid2]
      ],
      assert: function (val) {
        expect(val).to.be.eql([oid1, oid2]);
      }
    });
  });


  it('should remove duplicates on array by comparator', () => {
    test({
      type: [String],
      validator: 'duplicate',
      args: (a, b) => a === b,
      valid: [
        ['a', 'a', undefined, null, 'b', 'b']
      ],
      assert: function (val) {
        expect(val).to.be.eql(['a', 'b']);
      }
    });
  });


  it('should sort primitive array', () => {
    test({
      type: [String],
      validator: 'sort',
      valid: [
        ['c', 'a', undefined, null, 'b', 'b']
      ],
      assert: function (val) {
        expect(val).to.be.eql(['a', 'b', 'c']);
      }
    });
  });

  it('should sort primitive array in desc', () => {
    test({
      type: [String],
      validator: 'sort',
      args: 'desc',
      valid: [
        ['c', 'a', undefined, null, 'b', 'b']
      ],
      assert: function (val) {
        expect(val).to.be.eql(['c', 'b', 'a']);
      }
    });
  });

  it('should sort primitive array in asc', () => {
    test({
      type: [String],
      validator: 'sort',
      args: 'asc',
      valid: [
        ['c', 'a', undefined, null, 'b', 'b']
      ],
      assert: function (val) {
        expect(val).to.be.eql(['a', 'b', 'c']);
      }
    });
  });

  it('should sort array of ObjectId', () => {
    const oid1 = new mongoose.Types.ObjectId();
    const oid2 = new mongoose.Types.ObjectId();
    test({
      type: [Schema.Types.ObjectId],
      validator: 'sort',
      valid: [
        [oid2, undefined, null, oid1, oid2, oid1]
      ],
      assert: function (val) {
        expect(val).to.be.eql([oid1, oid2]);
      }
    });
  });

  it('should sort array of ObjectId desc', () => {
    const oid1 = new mongoose.Types.ObjectId();
    const oid2 = new mongoose.Types.ObjectId();
    test({
      type: [Schema.Types.ObjectId],
      validator: 'sort',
      args: 'desc',
      valid: [
        [oid2, undefined, null, oid1, oid2, oid1]
      ],
      assert: function (val) {
        expect(val).to.be.eql([oid2, oid1]);
      }
    });
  });

});
