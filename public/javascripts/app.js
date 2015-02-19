var weddingApp = angular.module('weddingApp', [
  'angular-flash.service', 
  'angular-flash.flash-alert-directive',
  'angularFileUpload',
  'weddingAppServices',    
  'weddingAppControllers'    
]).config(function(flashProvider){
  flashProvider.successClassnames.push('alert-success');
  flashProvider.errorClassnames.push('alert-danger');
});
