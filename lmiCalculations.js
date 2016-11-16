/**
* Gets a flattened json file and filters results based on the unique ID of the lender, the lvr rate and the property Value.
* @param {String} lenderId - The unique ID of the specific lender.
* @param {number} lvrFloat - The Loan to Valuation Ratio.
* @param {number} loanAmount - the value of the property.
* @param {Object[]} lmiList - The flattened array of objects which contains information regarding lender's lmi rates dependant on loan and lvr ranges.
* @return {Object} returns required values inside an object needed for calcuating the lmi, given the input parameters.
*/
export function filterlmiObj(lenderId, lvrFloat, loanAmount, lmiList) {
  const filteredlmi = lmiList.filter((lmiObj) => {
    return (
      lmiObj.uniqueId === lenderId &&
      lmiObj.incomeVerification === 'Full Doc' &&
      loanAmount >= lmiObj.valueLow &&
      loanAmount < lmiObj.valueHigh &&
      lvrFloat * 100 >= lmiObj.lvrLow &&
      lvrFloat * 100 < lmiObj.lvrHigh
    );
  });
  return filteredlmi[0];
}

export function calculatePremium(lmiObj, loanAmount) {
  let premium = 0;
  if (lmiObj.valueFixed === true && lmiObj.lvrFixed === true) {
    premium = lmiObj.rate;
  } else {
    premium = lmiObj.rate * loanAmount / 100;
  }
  return premium;
}

/**
* calculates the LMI Stamp Duty dependant on const rates per State and the premium.
* @param {String} state - the state in which the property is located.
* @param {Object[]} premium - The flattened object which contains information regarding lender's lmi rates dependant on loan and lvr ranges.
* @return {Object} returns the LMI Stamp Duty.
*/
export function getlmiStampDuty(state, premium) {
  const NSW_RATE = 0.09;
  const VIC_RATE = 0.10;
  const QLD_RATE = 0.09;
  const SA_RATE = 0.11;
  const WA_RATE = 0.10;
  const ACT_RATE = 0;
  const NT_RATE = 0.10;
  const TAS_RATE = 0.10;

  switch (state) {
  case 'NSW':
    return premium * NSW_RATE;
  case 'VIC':
    return premium * VIC_RATE;
  case 'QLD':
    return premium * QLD_RATE;
  case 'SA':
    return premium * SA_RATE;
  case 'WA':
    return premium * WA_RATE;
  case 'ACT':
    return premium * ACT_RATE;
  case 'NT':
    return premium * NT_RATE;
  case 'TAS':
    return premium * TAS_RATE;
  default:
    break;
  }
}

/**
* calculates the LMI (Lenders Morgage Insurance) for when the lvr of a home loan is over 80 percent.
* @param {String} lenderId - The unique ID of the specific lender.
* @param {number} loanAmount - The amount of the loan required.
* @param {number} propertyValue - the value of the property.
* @param {String} propertyState - the state in which the property is located.
* @param {Object[]} lmiList - The flattened object which contains information regarding lender's lmi rates dependant on loan and lvr ranges.
* @return {Object} returns the lmi {number} as well as the lmiString {String}. The lmiString will contain a message if the object did not contain the relevant data required for the input paramters, and will be undefined in any other situation.
*/
export function calculateLMI(lenderId, loanAmount, propertyValue, propertyState, lmiList) {
  const lvrFloat = loanAmount / propertyValue;
  let premium = 0;
  let lmiStampDuty = 0;
  let lmi = 0;
  let lmiString = undefined;

  if (lvrFloat > 0.8) {
    const lmiObj = filterlmiObj(lenderId, lvrFloat, loanAmount, lmiList);
    if (lmiObj !== undefined) {
      premium = calculatePremium(lmiObj, loanAmount);
      lmiStampDuty = getlmiStampDuty(propertyState, premium);
      const lmiTotal = premium + lmiStampDuty;
      lmi = premium !== 0 ? lmiTotal.toFixed(0) : 0;
    } else {
      lmi = 0;
      lmiString = "You may need to pay LMI as your LVR exceeds 80%; however, we do not have adequate data from the lender to calculate your premium. Please use a rough estimate in the meantime - we will get back to you with an exact quote once we receive your application.";
    }
  } else {
    lmi = 0;
  }
  return {
    lmi,
    lmiString,
  };
}
