const { Spot } = require('@binance/connector')
const moment = require('moment')

const fs = require('fs')

const apiKey = process.env.BINANCE_API_KEY; 
const apiSecret = process.env.BINANCE_API_SECRET;

const client = new Spot(apiKey, apiSecret);

client.account({ recvWindow: 20000 }).then(response => {
    var data = response.data;
    var balances = data.balances;

    if (!fs.existsSync("/crypto")) {
        fs.mkdirSync("/crypto", 0777);
    }

    const current = moment().utc().format('YYYYMMDD_HHmmss_SSS')

    for(var index = 0; index < balances.length; index++){
        if(balances[index].free > 0){
            var balance = JSON.stringify(balances[index]);

            console.log(balance);

            var fileName = '/crypto/balance_' + current + '.json';

            fs.appendFileSync(fileName, balance, function (err,data) {
                if (err) {
                  return console.log(err);
                }
                console.log(data);
              });
        }
    }    
});
