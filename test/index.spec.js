var expect = require('chai').expect;
var server = require('../index');

describe('main()', function () {
  it('should launch without problem', function () {
    
    // 1. ARRANGE
    var x = 5;
    var y = 1;
    var sum1 = x + y;

    // 2. ACT
    var sum2 = addTwoNumbers(x, y);

    // 3. ASSERT
    expect(sum2).to.be.equal(sum1);

  });
});
view rawaddTwoNumbersTest.js hosted with ❤ by GitHub