// let json = lmi.parse
export function get1stLender() {
  const json = require('./lmi');
  const lenderArray = json.lenderList;
  const lmiList = [];

  // iterate through lenders, get all lenders that offer LMI
  for (let i = 0; i < lenderArray.length; i++) {
    const lender = lenderArray[i];
    const lmiArray = lender.lmi;
    if (lmiArray.length > 0) {
      const uniqueId = lender.uniqueId;
      const name = lender.name;
      const serviceType = lender.serviceType;
      const lmiName = lmiArray[0];
      // go through LMI array and pull out full doc and low doc
      // lmi array has 2 items, 0 = full doc, 1 = low doc
      for (let j = 0; j < lmiArray.length; j++) {
        const lmi = lmiArray[j];
        const lmiName = lmi.name;
        const incomeVerification = lmi.incomeVerification;
        const rateColumn = lmi.rateColumn;

        for (let k = 0; k < rateColumn.length; k++) {
          const rateObj = rateColumn[k];
          const valueLow = rateObj.valueLow;
          const valueHigh = rateObj.valueHigh;
          const lvrLow = rateObj.lvrLow;
          const lvrHigh = rateObj.lvrHigh;
          const rate = rateObj.rate;
          const lvrFixed = rateObj.lvrFixed;
          const valueFixed = rateObj.valueFixed;

          const entry = {
            "uniqueId": uniqueId,
            "name": name,
            "serviceType": serviceType,
            "lmiName": lmiName,
            "incomeVerification": incomeVerification,
            "valueLow": valueLow,
            "valueHigh": valueHigh,
            "lvrLow": lvrLow,
            "lvrHigh": lvrHigh,
            "rate": rate,
            "lvrFixed": lvrFixed,
            "valueFixed": valueFixed,
          }
          lmiList.push(entry)
        }
      }
    }
  }
  console.log(lmiList);
  return 5;
}
