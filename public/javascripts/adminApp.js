var weddingApp = angular.module('weddingApp', [
  'ngRoute',
  'angular-flash.service', 
  'angular-flash.flash-alert-directive',
  'ngDialog',
  'weddingAppServices',    
  'weddingAppControllers',
  'appRoutes'  
]).config(function(flashProvider){
  flashProvider.successClassnames.push('alert-success');
  flashProvider.errorClassnames.push('alert-danger');
});
