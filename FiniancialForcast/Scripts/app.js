var myApp = angular.module('myApp',['ngRoute']);

myApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'AngularTemplates/calculator.html',
        controller: 'CalculatorController'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);

myApp.controller('CalculatorController', ['$scope', function($scope) {
  $scope.calculators = [new Calc({
    dayRate: 350,
    weeksPerYear: 40,
    agencyPercentage: 15,
    payeSalary: 10000,
    vatFlatRatePercentage: 14.5,
    vatFirstYear: true,
    dividendPercentage: 50,
    yearlyCosts: 2000,
    dailyExpenses: 0,
    yearlyExpenses: 0,
    pension: 10000
  })];

  $scope.addCalc = function(){
    $scope.calculators.push(new Calc({
      dayRate: 350,
      weeksPerYear: 40,
      agencyPercentage: 15,
      payeSalary: 10000,
      vatFlatRatePercentage: 14.5,
      vatFirstYear: true,
      dividendPercentage: 50,
      yearlyCosts: 2000,
      dailyExpenses: 0,
      yearlyExpenses: 0,
      pension: 10000
    }));
  }
}]);

function Calc(data){
  this.data = data;

  this.grossIncome = function(){return this.data.dayRate * this.data.weeksPerYear * 5 * ((100 - this.data.agencyPercentage) / 100)};

  this.totalExpenses = function(){return (5 * this.data.weeksPerYear * this.data.dailyExpenses) + this.data.yearlyExpenses};

  this.vatFlatRateSaving = function(){return (this.grossIncome() * 0.20) -
  (this.grossIncome() * 1.20 *
    (this.data.vatFlatRatePercentage - (this.data.vatFirstYear ? 1 : 0 )) / 100)};

  this.turnover = function(){return this.grossIncome() + this.vatFlatRateSaving()};
  this.preTaxProfit = function(){return this.turnover() - this.data.payeSalary - this.data.yearlyCosts - this.data.pension - this.totalExpenses()};
  this.corporationTax = function(){return this.preTaxProfit() * 0.20 };
  this.employersNics = function(){
    var nics = (this.data.payeSalary > 7956 ? (this.data.payeSalary - 7956) * 0.138 : 0);
    var nicsLessEmploymentAllowance = nics - 2000;
    if(nicsLessEmploymentAllowance <= 0) return 0;
    return nicsLessEmploymentAllowance;
  };


  this.postTaxProfit = function(){return this.preTaxProfit() - this.corporationTax() - this.employersNics()};

  this.payeTax = function(){return (
            (this.data.payeSalary > 10000 ? (this.data.payeSalary - 10000) * 0.2 : 0) +
            (this.data.payeSalary > 41865 ? (this.data.payeSalary - 41865) * (0.4 - 0.2) : 0) +
            (this.data.payeSalary > 150000 ? (this.data.payeSalary - 150000) * (0.44 - 0.4) : 0))};

  this.employeesNics= function(){return (
            (this.data.payeSalary > 7956 ? (this.data.payeSalary - 7956) * 0.12 : 0) +
            (this.data.payeSalary > 41865 ? (this.data.payeSalary - 41865) * (0.02 - 0.12) : 0))};

  this.dividendNet = function(){return this.postTaxProfit() * this.data.dividendPercentage / 100};
  this.dividendGross = function(){return this.dividendNet() * 10 / 9};
  this.taxableGrossIncome = function(){return this.dividendGross() + this.data.payeSalary - 10000};

  this.dividendTax = function(){if(this.dividendGross === 0) return 0;
                              var grossIncomeAboveHigherRate = this.taxableGrossIncome() - 31865;
                              if(grossIncomeAboveHigherRate <= 0) return 0;
                              var taxabledGrossDividend = grossIncomeAboveHigherRate < this.dividendGross() ? grossIncomeAboveHigherRate : this.dividendGross();
                              return taxabledGrossDividend * (32.5 - 10) / 100 };

  this.takeHomePay = function(){return this.data.payeSalary + this.dividendNet() + this.totalExpenses() - this.payeTax() - this.employeesNics() - this.dividendTax()};
  this.profitLeftInCompany = function(){return this.postTaxProfit() - this.dividendNet()};
}
