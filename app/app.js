'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/'});
}])
.controller("ticketCtrl", function($scope, $http) {

    $scope.count = null;
    $scope.tickets = [];
    $scope.previous = "";
    $scope.next = "";
    $scope.errorMsg = null;
    $scope.singleView = false;
    $scope.ticket = null;

    function fetchTickets(page) {
        $scope.singleView = false;
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

    $scope.selectSingleTicket = function(id) {
        $scope.singleView = true;
        var req = {
            method: 'GET',
            url: 'http://localhost:9000/tickets/'+id+'?jsonType=true',
            headers: {
              'Content-Type': "application/json",
            }
         }
         $http(req).then(function(response) {
             if (response.statusText == "OK") {
                 $scope.errorMsg = null;
                 $scope.ticket = response.data.ticket;
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
