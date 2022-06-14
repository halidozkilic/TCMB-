const axios = require('axios').default;
const convert = require('xml-js');

//BanknoteBuying
async function getCurrencies() {
  // let yesterday = new Date()
  // yesterday.setDate(yesterday.getDate() - 1)
  // yesterday.toDateString()
  //
  // const dd = String(yesterday.getDate()).padStart(2, '0');
  // const mm = String(yesterday.getMonth() + 1).padStart(2, '0'); //January is 0!
  // const yyyy = yesterday.getFullYear();

  const dates = [
    {dd: '14'},
    {dd: '14'},
    {dd: '13'},
    {dd: '14'},
    {dd: '14'},
    {dd: '14'},
    {dd: '14'},
    {dd: '12'},
    {dd: '12'},
    {dd: '14'},
    {dd: '14'},
  ]
  const mm = '12';
  const yyyy = 2021;
  const years = [];

  for (let i = 0; i <= 10; i++) {
    const url = `http://www.tcmb.gov.tr/kurlar/${yyyy - i}${mm}/${dates[i].dd}${mm}${yyyy - i}.xml`;
    const res = await axios.get(url)
    let data = convert.xml2json(res.data, {compact: true, spaces: 4});
    data = JSON.parse(data);
    years.push(data.Tarih_Date.Currency);
  }
  //   2021 2020
  // [ [] , [] , ]
  let result = {};
  let max = 0;
  let maxData;
  let temp = {}
  //
  for (let i = 0; i < 9; i++) {
    for (let k = 0; k < years[i].length; k++) {
      if (years[i][k] && years[i][k].ForexBuying && years[i][k].ForexBuying._text && years[i + 1][k] && years[i + 1][k].ForexBuying && years[i + 1][k].ForexBuying._text) {

        let dif = ((years[i][k].ForexBuying._text - years[i + 1][k].ForexBuying._text) / years[i][k].ForexBuying._text) * 100;
        if (dif > max && years[i][k]._attributes.CurrencyCode !== 'XDR') {
          max = dif;
          temp.rate = dif;
          temp.code = years[i][k]._attributes.CurrencyCode;
          temp.name = years[i][k].CurrencyName._text;
        }
      }
    }
    const data = yyyy - i;
    result[data] = temp;
    temp = {};
    max = 0;
  }
  console.log(result);
}

getCurrencies()



