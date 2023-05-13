function myFunction() {
    var sheet = SpreadsheetApp.getActive().getSheetByName('Alpha');
    var data = sheet.getDataRange().getValues();
    const row_tasks = [];
   
    data.forEach(function (row) {
   
      if(row[5]>0&&row[1]!="COMPLETED"){
        //Logger.log(row[2]+" - "+row[1]);
   
        const info = [];
        info.push(row[5]);
        info.push(row[1]);
        info.push(row[2]);
        row_tasks.push(info);
      }
    });
   
     row_tasks.sort(function(a, b){return a[0] - b[0]});
   
     var message = 'Heres the list of tasks: (days, task)\r';
     
     row_tasks.forEach(function (row2) {
       message = message.concat(row2+"\r");
     });
   
     var emailAddress = 'email@email.com';
     subject = 'Daily Open Tasks';
     Logger.log(message);
   
     MailApp.sendEmail(emailAddress, subject, message);
   
   }