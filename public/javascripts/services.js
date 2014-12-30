var weddingAppServices = angular.module('weddingAppServices', []);

weddingAppServices.factory('rsvpStorage', ['$http', function($http) {
  var service = {};
  service.get = function() {
    return $http.get('/api/rsvps');
  }
  
  service.post = function(rsvp) {
    return $http.post('/api/rsvps', rsvp);
  }

  service.delete = function(itemId) {
    return $http.delete('/api/rsvps/' + itemId);
  }
  
  return service;
}]);

weddingAppServices.factory('adviceStorage', ['$http', function($http) {
  var service = {};
  service.get = function() {
    return $http.get('/api/advice');
  }
  
  service.post = function(advice) {
    return $http.post('/api/advice', advice);
  }

  service.delete = function(itemId) {
    return $http.delete('/api/advice/' + itemId);
  }
  
  return service;
}]);
