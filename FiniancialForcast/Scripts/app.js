var myApp = angular.module('myApp', ['ngRoute', 'ui.bootstrap', 'chart.js']);

myApp.config([
    '$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'AngularTemplates/CalculatorPage.html',
                controller: 'CalculatorPageController'
            }).
            otherwise({
                redirectTo: '/'
            });
    }
]);
myApp.config([
    '$httpProvider', function($httpProvider) {
        $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
    }
]);

myApp.
    factory('scenarioData', function($http, $q) {
        return{
            apiPath: '/api/scenarios/',
            getAllItems: function() {
                //Creating a deferred object
                var deferred = $q.defer();

                //Calling Web API to fetch shopping cart items
                $http.get(this.apiPath).success(function(data) {
                    //Passing data to deferred's resolve function on successful completion
                    deferred.resolve(data);
                }).error(function() {

                    //Sending a friendly error message in case of failure
                    deferred.reject("An error occured while fetching items");
                });

                //Returning the promise object
                return deferred.promise;
            }
        };
    });

myApp.controller('CalculatorPageController', [
    '$scope', 'scenarioData', function($scope, scenarioData) {
        

        scenarioData.getAllItems().then(function(data) {
            $scope.calculators =  _.map(data, function(s) { return new Calc(s)});
            },
            function(errorMessage) {
                $scope.error = errorMessage;
            });

        $scope.addCalc = function() {
            $scope.calculators.push(new Calc({
                name: 'test2-client',
                dayRate: 325,
                weeksPerYear: 40,
                payeSalary: 10000,
                vatFlatRatePercentage: 14.5,
                vatFirstYear: false,
                dividendPercentage: 50,
                yearlyCosts: 2000,
                dailyExpenses: 0,
                yearlyExpenses: 0,
                pensionPercentage: 15
            }));
        };
        $scope.refreshScenarios = function() {
            scenarioData.getAllItems().then(function(data) {
                    $scope.scenarios = data;
                },
                function(errorMessage) {
                    $scope.error = errorMessage;
                });
        };

        $scope.refreshScenarios();
    }
]);

myApp.controller('CalculatorController', [
    '$scope', function ($scope) {
        var calc = $scope.calc;
        $scope.updateGraph = function() {
            $scope.breakdownData = [
                calc.profitLeftInCompany(), calc.pension(), calc.takeHomePay(), calc.totalTax() - calc.vatFlatRateSaving(), calc.adminCosts()
            ];
            $scope.breakdownLabels = ['Company', 'Pension', 'Salary', 'Tax', 'Admin'];
            $scope.breakdownTotal = _.reduce($scope.breakdownData, function(a, b) { return a + b; }, 0);
        };
        $scope.updateGraph();
    }
]);

myApp.directive('calculatorform', function () {
    return {
        restrict: 'E',
        controller: 'CalculatorController',
        templateUrl: 'AngularTemplates/CalculatorForm.html'
    }
});

function Calc(data) {
    this.data = data;

    this.grossIncome = function() { return this.data.dayRate * this.data.weeksPerYear * 5; };

    this.totalExpenses = function() { return (5 * this.data.weeksPerYear * this.data.dailyExpenses) + this.data.yearlyExpenses; };

    this.vatFlatRateSaving = function() {
        return (this.grossIncome() * 0.20) -
        (this.grossIncome() * 1.20 *
        (this.data.vatFlatRatePercentage - (this.data.vatFirstYear ? 1 : 0)) / 100);
    };

    this.turnover = function () { return this.grossIncome() + this.vatFlatRateSaving(); };
    this.pension = function () { return this.grossIncome() * this.data.pensionPercentage / 100; }
    this.preTaxProfit = function() { return this.turnover() - this.data.payeSalary - this.data.yearlyCosts - this.pension() - this.totalExpenses(); };
    this.corporationTax = function() { return this.preTaxProfit() * 0.20; };
    this.employersNics = function() {
        var nics = (this.data.payeSalary > 7956 ? (this.data.payeSalary - 7956) * 0.138 : 0);
        var nicsLessEmploymentAllowance = nics - 2000;
        if (nicsLessEmploymentAllowance <= 0) return 0;
        return nicsLessEmploymentAllowance;
    };


    this.postTaxProfit = function() { return this.preTaxProfit() - this.corporationTax() - this.employersNics(); };

    this.payeTax = function() {
        return (
        (this.data.payeSalary > 10000 ? (this.data.payeSalary - 10000) * 0.2 : 0) +
        (this.data.payeSalary > 41865 ? (this.data.payeSalary - 41865) * (0.4 - 0.2) : 0) +
        (this.data.payeSalary > 150000 ? (this.data.payeSalary - 150000) * (0.44 - 0.4) : 0));
    };

    this.employeesNics = function() {
        return (
        (this.data.payeSalary > 7956 ? (this.data.payeSalary - 7956) * 0.12 : 0) +
        (this.data.payeSalary > 41865 ? (this.data.payeSalary - 41865) * (0.02 - 0.12) : 0));
    };

    this.dividendNet = function() { return this.postTaxProfit() * this.data.dividendPercentage / 100; };
    this.dividendGross = function() { return this.dividendNet() * 10 / 9; };
    this.taxableGrossIncome = function() { return this.dividendGross() + this.data.payeSalary - 10000; };

    this.dividendTax = function() {
        if (this.dividendGross === 0) return 0;
        var grossIncomeAboveHigherRate = this.taxableGrossIncome() - 31865;
        if (grossIncomeAboveHigherRate <= 0) return 0;
        var taxabledGrossDividend = grossIncomeAboveHigherRate < this.dividendGross() ? grossIncomeAboveHigherRate : this.dividendGross();
        return taxabledGrossDividend * (32.5 - 10) / 100;
    };

    this.adminCosts = function() { return this.data.yearlyCosts + this.totalExpenses(); };
    this.takeHomePay = function() { return this.data.payeSalary + this.dividendNet() - this.payeTax() - this.employeesNics() - this.dividendTax(); };
    this.profitLeftInCompany = function() { return this.postTaxProfit() - this.dividendNet(); };
    this.totalTax = function() {
        return this.corporationTax() +
            this.employersNics() +
            this.payeTax() +
            this.employeesNics() +
            this.dividendTax();
    }
}