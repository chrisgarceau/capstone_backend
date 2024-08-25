// Database information
var server = "sql563.main-hosting.eu";
var port = 3306;
var db = "u604220124_mcSmartPark";
var user = "u604220124_wangs";
var pwd = "";
var tableName = "parkingData"

/* Connect to MySQL */
function connectmysql() {
  //Initiating database connection
  var url = "jdbc:mysql://" + server + ":" + port + "/" + db;
  console.log(url)
  var conn = Jdbc.getConnection(url, user, pwd);
  Logger.log(conn);

// Spreadsheet information
var sheet = SpreadsheetApp.getActiveSheet();
var data = sheet.getDataRange().getValues();

// Deletes entire table in order to repopulate with updated spreadsheet data set
var clearStatement = conn.createStatement();
var delSQL = "DELETE FROM " + tableName;
clearStatement.execute(delSQL);

// Initializing SQL statement through the database connection
var statement = conn.createStatement();

var recordCounter = 0;  // stores the # of records that are exported to the databse
var lastRow;
var maxRecordsPerBatch = 1000;

conn.setAutoCommit(false);
for (var i = 1; i < data.length; i++) {
  lastRow = (i + 1 == data.length ? true : false); // stores the last 
  var sql = "INSERT INTO "+ tableName + "(car_enter, car_exit, date, time, total_cars) VALUES (?,?,?,?,?);";

  statement = conn.prepareCall(sql);  
  statement.setInt(1, data[i][0]);
  statement.setInt(2, data[i][1]);
  statement.setString(3, data[i][2]);
  statement.setString(4, data[i][3]);
  statement.setInt(5, data[i][4]);
  statement.executeUpdate(); 

  statement.addBatch();
  recordCounter += 1;

  if (recordCounter == maxRecordsPerBatch || lastRow) {
    try {
      statement.executeBatch();
    }
    catch(e) {
      console.log('Attempted to update TABLE `' + tableName + '` in DB `' + db + '`, but the following error was returned: ' + e);
    }
    if (!lastRow) { // Reset vars
      // Better to reset this variable to avoid any potential "No operations allowed after statement closed" errors
      statement = conn.prepareCall(sql); 
      recordCounter = 0;
    }
  }

  conn.commit();

  } 
  
conn.close();
}

