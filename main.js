const sp = require('./smartPrice');

sp.updatePrice.then(function() {
  console.log(sp.priceObj);
});
