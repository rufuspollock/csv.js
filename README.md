Simple pure javascript CSV library focused on the browser.

Originally developed as part of [ReclineJS][] but now fully standalone.

[ReclineJS]: http://okfnlabs.org/recline/

## Usage

Grab the `csv.js` file and include it in your application.

Depends on underscore plus either jQuery or underscore.deferred (for deferred).

### fetch

A convenient way to load a CSV file from various different sources. fetch
supports 3 options depending on the attribute provided on the info argument:

    CSV.fetch({
        data: 'raw csv string'
        // or ...
        url: 'url to a csv file'
        // or ...
        file: an HTML 5 file object
      }
    ).done(function(dataset) {
      // dataset object doc'd below
      console.log(dataset);
    });

Some more detail on the argument object:

* `data` is a string in CSV format. This is passed directly to
  the CSV parser
* `url`: a url to an online CSV file that is ajax accessible (note this
  usually requires either local or on a server that is CORS enabled). The file
  is then loaded using jQuery.ajax and parsed using the CSV parser (NB: this
  requires jQuery) All options generates similar data and use the memory store
  outcome, that is they return something like:
* `file`: is an HTML5 file object. This is opened and parsed with the CSV
  parser.

Returned `dataset` object looks like:

<pre>
{
  // an array of arrays - one array each row in the CSV
  // (excluding header row - i.e. first row)
  records: [ [...], [...], ... ],
  // list of fields
  fields: [ 'field-name-1', 'field-name-2', ... ],
  metadata: { may be some metadata e.g. file name }
}
</pre>

### Raw parsing

    var out = CSV.parse(csvString, options);

Converts a Comma Separated Values string into an array of arrays.  Each line in
the CSV becomes an array.

Empty fields are converted to nulls and non-quoted numbers are converted to
integers or floats.

Options:

* trim: {Boolean} [trim=false] If set to True leading and trailing
  whitespace is stripped off of each non-quoted field as it is
  imported
* delimiter {String} [delimiter=','] A one-character string used to
  separate fields. It defaults to ','
* quotechar {String} [quotechar='"'] A one-character string used to
  quote fields containing special characters, such as the delimiter
  or quotechar, or which contain new-line characters. It defaults to
  '"' @param {Integer} skipInitialRows A integer number of rows to
  skip (default 0)

### Serialize

Convert an Object or a simple array of arrays into a Comma
Separated Values string.

    var out = CSV.serialize(dataToSerialize);

Nulls are converted to empty fields and integers or floats are converted to
non-quoted numbers.

Returns a string representing the array serialized as a CSV.

`dataToSerialize` is an Object or array of arrays to convert. Object structure
must be as follows:

    {
      fields: [ {id: .., ...}, {id: ..., 
      records: [ { record }, { record }, ... ]
      ... // more attributes we do not care about
    }

Options for serializing the CSV file are:

* `delimiter` and `quotechar` (see parse options parameter above for details on
  these).

## Other JS CSV Libs

* http://www.uselesscode.org/javascript/csv/ - basic CSV parser on which this library was originally based 
* https://github.com/maxogden/browser-csv-stream - Pure browser version of node-csv from @maxogden via browserify 
* https://github.com/onyxfish/csvkit.js - pure JS CSV reader from @onyxfish (author of the "legendary" python csvkit)

### Node

* https://github.com/wdavidw/node-csv - this is the Node CSV lib we use by preference
* https://github.com/maxogden/binary-csv - new CSV lib from @maxogden with a focus on being very fast

