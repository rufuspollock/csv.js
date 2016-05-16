(function ($) {
module("Backend Local CSV");

test("parse", function() {
  var csv = '"Jones, Jay",10\n' +
  '"Xyz ""ABC"" O\'Brien",11:35\n' +
  '"Other, AN",12:35\n';

  var array = CSV.parse(csv);
  var exp = [
    ['Jones, Jay', 10],
    ['Xyz "ABC" O\'Brien', '11:35' ],
    ['Other, AN', '12:35' ]
  ];
  deepEqual(exp, array);

  var csv = '"Jones, Jay", 10\n' +
  '"Xyz ""ABC"" O\'Brien", 11:35\n' +
  '"Other, AN", 12:35\n';
  var array = CSV.parse(csv, {trim : true});
  deepEqual(exp, array);

  var csv = 'Name, Value\n' +
  '"Jones, Jay", 10\n' +
  '"Xyz ""ABC"" O\'Brien", 11:35\n' +
  '"Other, AN", 12:35\n';
  var dataset = {
    data: csv
  };
  // strictly this is asynchronous
  CSV.fetch(dataset).done(function(dataset) {
    equal(dataset.records.length, 3);
    var row = dataset.records[0];
    deepEqual(dataset.fields, ['Name', 'Value']);
    deepEqual(row, ['Jones, Jay', 10]);
  });
});

test("parse - semicolon", function() {
  var csv = '"Jones; Jay";10\n' +
  '"Xyz ""ABC"" O\'Brien";11:35\n' +
  '"Other; AN";12:35\n';

  var array = CSV.parse(csv, {delimiter : ';'});
  var exp = [
    ['Jones; Jay', 10],
    ['Xyz "ABC" O\'Brien', '11:35' ],
    ['Other; AN', '12:35' ]
  ];
  deepEqual(exp, array);

});

test("parse - quotechar", function() {
  var csv = "'Jones, Jay',10\n" +
  "'Xyz \"ABC\" O''Brien',11:35\n" +
  "'Other; AN',12:35\n";

  var array = CSV.parse(csv, {quotechar:"'"});
  var exp = [
    ["Jones, Jay", 10],
    ["Xyz \"ABC\" O'Brien", "11:35" ],
    ["Other; AN", "12:35" ]
  ];
  deepEqual(exp, array);

});

test("parse skipInitialRows", function() {
  var csv = '"Jones, Jay",10\n' +
  '"Xyz ""ABC"" O\'Brien",11:35\n' +
  '"Other, AN",12:35\n';

  var array = CSV.parse(csv, {skipInitialRows: 1});
  var exp = [
    ['Xyz "ABC" O\'Brien', '11:35' ],
    ['Other, AN', '12:35' ]
  ];
  deepEqual(exp, array);
});

test("serialize - Array", function() {
  var csv = [
    ['Jones, Jay', 10],
    ['Xyz "ABC" O\'Brien', '11:35' ],
    ['Other, AN', '12:35' ]
  ];

  var out = CSV.serialize(csv);
  var exp = '"Jones, Jay",10\n' +
  '"Xyz ""ABC"" O\'Brien",11:35\n' +
  '"Other, AN",12:35\n';
  deepEqual(out, exp);
});

test("serialize - Object", function() {
  var indata = {
    fields: [ {id: 'name'}, {id: 'number'}],
    records: [
      {name: 'Jones, Jay', number: 10},
      {name: 'Xyz "ABC" O\'Brien', number: '11:35' },
      {name: 'Other, AN', number: '12:35' }
    ]
  };

  var array = CSV.serialize(indata);
  var exp = 'name,number\n' +
  '"Jones, Jay",10\n' +
  '"Xyz ""ABC"" O\'Brien",11:35\n' +
  '"Other, AN",12:35\n';
  deepEqual(array, exp);
});

test("serialize - dialect options", function() {
  var csv = [
    ['Jones, Jay', 10],
    ['Xyz "ABC" O\'Brien', '11:35' ]
  ];

  var out = CSV.serialize(csv, {doubleQuote: false});
  var exp = '"Jones, Jay",10\n' +
  '"Xyz "ABC" O\'Brien",11:35\n'
  deepEqual(out, exp);
});

asyncTest("request fail", function(){
  var dataset = {
    url: 'http://fauxurlexample.com',
  };

  CSV.fetch(dataset).always(function(response, status){
    if(response.error) {
      var r = response.error.request;
      equal(r.status, 0);
      equal(r.readyState, 0);
    } else {
      ok(false);
    }
    start();
  });
});

test('normalizeDialectOptions', function() {
  var indata = {
  };
  var exp = {
    delimiter: ',',
    doublequote: true,
    lineterminator: '\n',
    quotechar: '"',
    skipinitialspace: true,
    skipinitialrows: 0
  }
  var out = CSV.normalizeDialectOptions(indata);
  deepEqual(out, exp);

  var indata = {
    doubleQuote: false,
    trim: false
  };
  var exp = {
    delimiter: ',',
    doublequote: false,
    lineterminator: '\n',
    quotechar: '"',
    skipinitialspace: false,
    skipinitialrows: 0
  }
  var out = CSV.normalizeDialectOptions(indata);
  deepEqual(out, exp);
});

test('normalizeLineTerminator', function() {
  var exp = [
    ['Jones, Jay', 10],
    ['Xyz "ABC" O\'Brien', '11:35' ],
    ['Other, AN', '12:35' ]
  ];
  var csv, array;

  // Multics, Unix and Unix-like systems (Linux, OS X, FreeBSD, AIX, Xenix, etc.), BeOS, Amiga, RISC OS, and other
  csv = '"Jones, Jay",10\n' +
  '"Xyz ""ABC"" O\'Brien",11:35\n' +
  '"Other, AN",12:35\n';
  array = CSV.parse(csv);
  deepEqual(exp, array);

  // Commodore 8-bit machines, Acorn BBC, ZX Spectrum, TRS-80, Apple II family, Oberon, Mac OS up to version 9, and OS-9
  csv = '"Jones, Jay",10\r' +
  '"Xyz ""ABC"" O\'Brien",11:35\r' +
  '"Other, AN",12:35\r';
  array = CSV.parse(csv);
  deepEqual(exp, array);

  // Microsoft Windows, DOS (MS-DOS, PC DOS, etc.),
  csv = '"Jones, Jay",10\r\n' +
  '"Xyz ""ABC"" O\'Brien",11:35\r\n' +
  '"Other, AN",12:35\r\n';
  array = CSV.parse(csv);
  deepEqual(exp, array);

});

})(this.jQuery);
