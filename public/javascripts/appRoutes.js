angular.module('appRoutes', []).config(function($routeProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'views/rsvps.html',
      controller: 'rsvpCtrl'
    }).
    when('/advice', {
      templateUrl: 'views/advice.html',
      controller: 'adviceCtrl'
    }).
    otherwise({
      redirectTo: '/'
    });    
});

