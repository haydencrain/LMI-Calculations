import { expect } from 'chai';
import {
  getlmiStampDuty,
  calculateLMI,
} from '../src/lmiCalculations.js';
import lmiList from './lmiTestFlattened';

describe("LMI Calculations", () => {
  // test the stamp duty function
  it("should return correct stamp duty", function() {
    const state = 'WA';
    const premium = 10;
    const answer = 1;
    expect(getlmiStampDuty(state, premium)).to.equal(answer);
  });

  it("should return the correct lmi", function() {
    const ID = 'ADE';
    const loan = 170000;
    const value = 200000;
    const state = 'ACT';
    const answer = '1700';
    const lmiAnswer = calculateLMI(ID, loan, value, state, lmiList);
    const lmi = lmiAnswer.lmi;
    expect(lmi).to.equal(answer);
  });

  it("should return an undefined string", function() {
    const ID = 'ADE';
    const loan = 170000;
    const value = 200000;
    const state = 'ACT';
    const answer = undefined;
    const lmiAnswer = calculateLMI(ID, loan, value, state, lmiList);
    const lmiString = lmiAnswer.lmiString;
    expect(lmiString).to.equal(answer);
  });

  it("should return a message in the string", function() {
    const ID = 'AAA';
    const loan = 170000;
    const value = 200000;
    const state = 'ACT';
    const lmiAnswer = calculateLMI(ID, loan, value, state, lmiList);
    const lmiString = lmiAnswer.lmiString;
    expect(lmiString).to.be.a('string');
  });
});
