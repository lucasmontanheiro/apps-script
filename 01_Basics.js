function toCelsius(temperature) {
    return Math.round((temperature-32)/9*5);
 }


function sumToNine() {
    var sum=0;
    for (var i = 0; i < 10; i++) {
    sum = sum + i;
    }

    Logger.log(sum);
}

  // Loops

var text = "";
for (var i = 0; i < 5; i++)  {
	text = text + "The number is " + i + "\n";
}
Logger.log(text);

function sumToN(n) {
    var sum = 0;
    for (var i = 1; i <= n; i++) {
      sum = sum + i;
    }
  
    return sum;
  }
  
