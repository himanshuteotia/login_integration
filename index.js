const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var users = [];
let google = require('googleapis');
let authentication = require("./authentication");

 
// Run server to listen on port 8000.
const server = app.listen(3000, () => {
  console.log('listening on *:3000');
});
 
const io = require('socket.io')(server); 
app.use(bodyParser.urlencoded({ extended: false } ));
app.use(express.static('static'));

function getData(auth) {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: '1dPhQnfoTAGq3X63gzWeV_07WQV9F1vYNta4Xh69RG1k',
    range: 'Sheet2!A2:J', //Change Sheet1 if your worksheet's name is something else
  }, (err, response) => {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    } 
    var rows = response.values;
    if (rows.length === 0) {
      console.log('No data found.');
    } else {
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        console.log(row.join(", "));
      }
    }
  });
}

app.use('/getAllUsers', (req,res) => {
	console.log("All users here");
	var GoogleSpreadsheet = require('google-spreadsheet');
	var async = require('async');
	 
	// spreadsheet key is the long id in the sheets URL 
	var doc = new GoogleSpreadsheet('1dPhQnfoTAGq3X63gzWeV_07WQV9F1vYNta4Xh69RG1k');
	var sheet;
	 
	async.series([
	  function setAuth(step) {
	    // see notes below for authentication instructions! 
	    var creds = require('./credentials.json');
	    console.log("creds",creds)
	    // OR, if you cannot save the file locally (like on heroku) 
	    // var creds_json = {
	    //   client_email: '958544791064-39273muic1n0pe7umusc268nfbb5kd51.apps.googleusercontent.com',
	    //   private_key: 'your long private key stuff here'
	    // }
	 
	    doc.useServiceAccountAuth(creds, step);
	  },
	  function getInfoAndWorksheets(step) {
	  	console.log("getInfoAndWorksheets....")
	    doc.getInfo(function(err, info) {
	      console.log('Loaded doc: '+info.title+' by '+info.author.email);
	      sheet = info.worksheets[0];
	      console.log('Sheet 1: '+sheet.title+' '+sheet.rowCount+'x'+sheet.colCount);
	      step();
	    });
	  },
	  function workingWithRows(step) {
	    // google provides some query options 
	    console.log("workingWithRows....")
	    sheet.getRows({
	      offset: 1,
	      limit: 20,
	      orderby: 'col2'
	    }, function( err, rows ){
	      console.log('Read '+rows.length+' rows');
	 
	      // the row is an object with keys set by the column headers 
	      rows[0].colname = 'new val';
	      rows[0].save(); // this is async 
	 
	      // deleting a row 
	      rows[0].del();  // this is async 
	 
	      step();
	    });
	  },
	  function workingWithCells(step) {
	  	console.log("workingWithCells....")
	    sheet.getCells({
	      'min-row': 1,
	      'max-row': 5,
	      'return-empty': true
	    }, function(err, cells) {
	      var cell = cells[0];
	      console.log('Cell R'+cell.row+'C'+cell.col+' = '+cell.value);
	 
	      // cells have a value, numericValue, and formula 
	      cell.value == '1'
	      cell.numericValue == 1;
	      cell.formula == '=ROW()';
	 
	      // updating `value` is "smart" and generally handles things for you 
	      cell.value = 123;
	      cell.value = '=A1+B2'
	      cell.save(); //async 
	 
	      // bulk updates make it easy to update many cells at once 
	      cells[0].value = 1;
	      cells[1].value = 2;
	      cells[2].formula = '=A1+B1';
	      sheet.bulkUpdateCells(cells); //async 
	 
	      step();
	    });
	  },
	  function managingSheets(step) {
	  	console.log("managingSheets....")
	    doc.addWorksheet({
	      title: 'my new sheet'
	    }, function(err, sheet) {
	 
	      // change a sheet's title 
	      sheet.setTitle('new title'); //async 
	 
	      //resize a sheet 
	      sheet.resize({rowCount: 50, colCount: 20}); //async 
	 
	      sheet.setHeaderRow(['name', 'age', 'phone']); //async 
	 
	      // removing a worksheet 
	      sheet.del(); //async 
	 
	      step();
	    });
	  }
	], function(err){
	    if( err ) {
	      console.log('Error: '+err);
	    }
	});
})

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError) return res.status(400).send(JSON.stringify({
      error: "Invalid JSON"
  }))
  console.error(err);
  res.status(500).send();
});
 
// Set socket.io listeners.
io.on('connection', (socket) => {
  console.log('a user connected');
 
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  client.on('subscribeToTimer', (interval) => {
    console.log('client is subscribing to timer with interval ', interval);
    setInterval(() => {
      client.emit('timer', new Date());
    }, interval);
  });

});
 