// Transparent, illustrative heuristic. NOT a trained ML model and NOT suitable for real lending.
export function scoreApplication(a) {
  const income = Number(a.annualIncome), debt = Number(a.monthlyDebt), amount = Number(a.loanAmount), term = Number(a.termMonths);
  const dti = income > 0 ? debt / (income / 12) : 1;
  const installment = amount / Math.max(term, 1);
  const projectedDti = income > 0 ? (debt + installment) / (income / 12) : 1;
  const credit = Number(a.creditScore);
  const factors = [
    {label:'Credit history',impact: credit >= 740 ? -19 : credit >= 680 ? -8 : credit >= 620 ? 9 : 25,detail:`Reported credit score: ${credit}`},
    {label:'Debt-to-income ratio',impact: projectedDti < .28 ? -15 : projectedDti < .4 ? 0 : projectedDti < .55 ? 17 : 29,detail:`Projected DTI: ${(projectedDti*100).toFixed(1)}%`},
    {label:'Loan exposure',impact: amount / Math.max(income,1) < .3 ? -8 : amount / Math.max(income,1) < .8 ? 3 : 15,detail:`Loan / annual income: ${(amount/Math.max(income,1)*100).toFixed(0)}%`},
    {label:'Employment tenure',impact: Number(a.employmentYears) >= 5 ? -8 : Number(a.employmentYears) >= 2 ? 0 : 11,detail:`${a.employmentYears} years employed`},
  ];
  const risk = Math.min(96, Math.max(4, Math.round(31 + factors.reduce((s,f)=>s+f.impact,0))));
  const band = risk < 30 ? 'Low' : risk < 60 ? 'Moderate' : 'High';
  return {risk,band,estimatedMonthlyPayment:Math.round(installment),dti:Math.round(dti*1000)/10,projectedDti:Math.round(projectedDti*1000)/10,factors,model:'Illustrative rules v1',recommendation:risk < 30 ? 'Eligible for review' : risk < 60 ? 'Manual review recommended' : 'Enhanced review required'};
}
