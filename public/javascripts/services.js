angular.module('weddingAppServices', []).factory('weddingStorage', ['$http', 
    function($http) {
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
