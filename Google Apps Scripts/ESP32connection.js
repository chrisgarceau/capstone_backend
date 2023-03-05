function doGet(e){
    Logger.log("--- doGet ---");
   
   var car_enter = "",
       car_exit = "",
       date = "",
       time = "",
       total_cars = "";
   
    try {
      // this helps during debugging
      if (e == null){
        e={}; 
        e.parameters = {car_enter: "test", car_exit: "test", date:"test",time: "test", total_cars:"test"};
        }
  
      car_enter = e.parameters.car_enter;
      car_exit = e.parameters.car_exit;
      date = e.parameters.date;
      time = e.parameters.time;
      total_cars = e.parameters.total_cars;
   
      // save the data to spreadsheet
      save_data(car_enter, car_exit, date, time, total_cars);
    
      return ContentService.createTextOutput("Wrote:\n  car_enter: " + car_enter + "\n  car_exit: " + car_exit + "\n date: " + date + "\n time: " + time + "\n total_cars: " + total_cars);
   
    } catch(error) { 
      Logger.log(error);    
      return ContentService.createTextOutput("error");
    }  
  }
   
  // Method to save given data to a sheet
  function save_data(car_enter, car_exit, date, time, total_cars){
    Logger.log("--- save_data ---"); 
   
     try 
     {
       var dateTime = new Date();
       
       // Paste the URL of the Google Sheets starting from https thru /edit
       // For e.g.: https://docs.google.com/..../edit 
       var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1Q1O_vjp0bDg3PRkkk224PkvbLb02kclj5ltx32WcPhQ/edit");
       var dataLoggerSheet = ss.getSheetByName("Sheet2");
            
       // Get last edited row from DataLogger sheet
       var row = dataLoggerSheet.getLastRow() + 1;
      
       // Start populating the data
       dataLoggerSheet.getRange("A" + row).setValue(car_enter);
       dataLoggerSheet.getRange("B" + row).setValue(car_exit);
       dataLoggerSheet.getRange("C" + row).setValue(date);
       dataLoggerSheet.getRange("D" + row).setValue(time);
       dataLoggerSheet.getRange("E" + row).setValue(total_cars); 
       
        
       // Update summary sheet
       summarySheet.getRange("B1").setValue(dateTime); // Last modified date
    }
   
    catch(error) 
    {
      Logger.log(JSON.stringify(error));
    }
   
    Logger.log("--- save_data end---"); 
  }