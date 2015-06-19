/// <reference path="imports.ts" />

module App {
    'use strict';

    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {
        angular.module('App', ['ionic'])
            .controller('navigationController', App.NavigationController)
            .controller('searchController', App.SearchController)
            .controller('collaboratorsController', App.CollaboratorsController)
            .controller('panelController', App.PanelController)
            .service('apiService', App.ApiService)
            .config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', statesConfiguration])
            .config(['$httpProvider', httpLoadingInterceptor])
            .run(['$rootScope', '$ionicLoading', httpLoadingInterceptorActions])
            .config(['$compileProvider', function ($compileProvider) {
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|file|mailto|ms-appx):/);
        }]);

        angular.bootstrap(document.querySelector('body'), ['App']);
    }

    // Configure routes
    function statesConfiguration(
        $stateProvider: ng.ui.IStateProvider,
        $urlRouterProvider: ng.ui.IUrlRouterProvider,
        $ionicConfigProvider: Ionic.IConfigProvider
        ): void {

        // force native scroll
        var configProvider: any = $ionicConfigProvider;
        configProvider.scrolling.jsScrolling(false);

        $stateProvider
        // Tabs Menu
            .state('tabs', {
            url: "/tab",
            abstract: true,
            templateUrl: "templates/partials/tabs.html"
        })

        // Side Menu Left
            .state('tabs.left', {
            url: "/left",
            views: {
                'left-tab': {
                    templateUrl: "templates/pages/left.html"
                }
            }
        })
        
            .state('tabs.search', {
            url: "/search",
            views: {
                'search-tab': {
                    controller: 'searchController as search',
                    templateUrl: "templates/pages/search.html"
                }
            }
        })

        // actions Views
            .state('tabs.collaborators', {
            url: "/collaborators",
            views: {
                'collaborators-tab': {
                    controller: 'collaboratorsController as collaborators',
                    templateUrl: "templates/pages/collaborators.html"
                }
            }
        })

        $urlRouterProvider.otherwise("/tab/search");
    }

    // Configure interceptor
    function httpLoadingInterceptor($httpProvider: ng.IHttpProvider) {
        $httpProvider.interceptors.push(['$rootScope', function ($rootScope) {
            return {
                request: function (config) {
                    $rootScope.$broadcast('loading:show')
                    return config
                },
                response: function (response) {
                    $rootScope.$broadcast('loading:hide')
                    return response
                }
            }
        }])
    }

    // Configure interceptor actions
    function httpLoadingInterceptorActions($rootScope: ng.IRootScopeService, $ionicLoading: Ionic.ILoading) {
        $rootScope.$on('loading:show', function () {
            $ionicLoading.show({ templateUrl: "templates/partials/loading.html" })
        })

        $rootScope.$on('loading:hide', function () {
            $ionicLoading.hide()
        })
    }
}
