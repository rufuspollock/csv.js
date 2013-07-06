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

  var array = CSV.serialize(csv);
  var exp = '"Jones, Jay",10\n' +
  '"Xyz \"ABC\" O\'Brien",11:35\n' +
  '"Other, AN",12:35\n';
  deepEqual(array, exp);
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
  '"Xyz \"ABC\" O\'Brien",11:35\n' +
  '"Other, AN",12:35\n';
  deepEqual(array, exp);
});

})(this.jQuery);
