angular.module('weddingAppServices', []).factory('weddingStorage', ['$http', 
    function($http) {
      var service = {};
      service.get = function() {
        return $http.get('/api/rsvps');
      }
      
      service.post = function(rsvp) {
        return $http.post('/api/rsvps', rsvp);
      }

      service.delete = function(id) {
        return $http.delete('/api/rvsps/' + id)
      }
      
      return service;
    }]);
