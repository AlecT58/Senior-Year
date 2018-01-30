const readline = require('readline');
const math = require('mathjs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter an upper bound value > ', (answer) => {
    const upper = answer;

    console.log('Calculating prime numbers...');
    const start = new Date();

    range(2, upper).forEach(function(x) {
        if(math.isPrime(x)) {
            console.log(x + " is prime");
        }
    });
    
    const now = new Date();
    console.log(`Took ${(now - start)/1000} s to test ${upper} values`);

    rl.close();
});

function range(start, end, step, offset) {
  
    var len = (Math.abs(end - start) + ((offset || 0) * 2)) / (step || 1) + 1;
    var direction = start < end ? 1 : -1;
    var startingPoint = start - (direction * (offset || 0));
    var stepSize = direction * (step || 1);
    
    return Array(len).fill(0).map(function(_, index) {
      return startingPoint + (stepSize * index);
    });
    
  }
