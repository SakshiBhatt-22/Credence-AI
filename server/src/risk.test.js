import test from 'node:test';import assert from 'node:assert/strict';import {scoreApplication} from './risk.js';
const base={annualIncome:80000,monthlyDebt:300,loanAmount:20000,termMonths:36,creditScore:760,employmentYears:6};
test('scores are bounded',()=>{assert.ok(scoreApplication(base).risk>=4);assert.ok(scoreApplication(base).risk<=96)});
test('risk rises when debt burden and credit history deteriorate',()=>{assert.ok(scoreApplication({...base,creditScore:540,monthlyDebt:3000}).risk>scoreApplication(base).risk)});
