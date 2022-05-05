const { Spot } = require('@binance/connector')
const moment = require('moment')
const fs = require('fs')

const apiKey = process.env.BINANCE_API_KEY;
const apiSecret = process.env.BINANCE_API_SECRET;

const client = new Spot(apiKey, apiSecret);
const current = moment().utc().format('YYYYMMDD_HHmmss_SSS');

fs.readFileSync('/crypto/conf/symbols.txt', 'utf8')
    .split(';').forEach(function(symbol){

    client.tickerPrice(symbol)
        .then(response => {
            var price = JSON.stringify(response.data);

            console.log(price);

            var fileName = '/crypto/prices_' + current + '.json';

            fs.appendFileSync(fileName, price + '\r\n', function (err,data) {
                if (err) {
                  return console.log(err);
                }
                console.log(data);
              });
     
            });    
});