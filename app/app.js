'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/view1'});
}])
.controller("ticketCtrl", function($scope, $http) {

    $scope.count = null;
    $scope.tickets = [];
    $scope.previous = "";
    $scope.next = "";
    $scope.errorMsg = null;

    function fetchTickets(page) {
        var req = {
            method: 'GET',
            url: 'http://localhost:9000/tickets'+page+'&jsonType=true',
            headers: {
              'Content-Type': "application/json",
            }
         }
         $http(req).then(function(response) {
             if (response.statusText == "OK") {
                 $scope.count = response.data.count;
                 $scope.tickets = response.data.tickets;
                 $scope.previous = response.data.previous ? response.data.previous : "";
                 $scope.next = response.data.next ? response.data.next : "";
                 $scope.errorMsg = null;
             } else {
                $scope.errorMsg = "Opps, something wrong in fetching tickets";
             }
         }, function(response) {
             $scope.errorMsg = response.statusText;
             $scope.errorMsg += (response.data && response.data.message) ? response.data.message : "";
             $scope.errorMsg = ($scope.errorMsg == "") ? "Opps, something wrong in fetching tickets" : $scope.errorMsg; 
        });
    };

    $scope.fetchTickets = function(page) {
        fetchTickets(page);
    };
    $scope.previousPage = function(){fetchTickets($scope.previous);};
    $scope.nextPage = function(){fetchTickets($scope.next);};
    
});
