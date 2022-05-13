const { Spot } = require('@binance/connector')
const moment = require('moment')

const { Console } = require('console')
const fs = require('fs');
const internal = require('stream');

const apiKey = process.env.BINANCE_API_KEY; 
const apiSecret = process.env.BINANCE_API_SECRET;

const client = new Spot(apiKey, apiSecret);

client.paymentHistory(0)
  .then(response =>{

    if(response.data.message != "success"){
        console.log("Error on try to get payment information");
    }

    console.log(response.data);

    if (!fs.existsSync("/crypto")) {
        fs.mkdirSync("/crypto", 0777);
    }

    const current = moment().utc().format('YYYYMMDD_HHmmss_SSS')
    let amount = 0.0;
    let payments = response.data.data;

    for(var index = 0; index < payments.length; index++){
        amount += payments[index].sourceAmount;

        var payment = payments[index];

        console.log(JSON.stringify(payment));

        var fileName = '/crypto/payments_' + current + '.json';

        fs.appendFileSync(fileName, JSON.stringify(payment) + '\r\n', function (err,data) {
            if (err) {
              return console.log(err);
            }
            console.log(data);
          });
    }

    console.log("Total amount:" + amount);

  }).catch(error => console.log(error))