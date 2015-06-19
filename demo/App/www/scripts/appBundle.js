/// <reference path="lib/typings/definitelytyped/angularjs/angular.d.ts" />
/// <reference path="lib/typings/definitelytyped/cordova/cordova.d.ts" />
/// <reference path="lib/typings/definitelytyped/cordova-ionic/cordova-ionic.d.ts" />
/// <reference path="lib/typings/definitelytyped/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="lib/typings/ionic-typescript-definitions/beta14/ionic.d.ts" />
/// <reference path="imports.ts" />
var App;
(function (App) {
    'use strict';
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        angular.module('App', ['ionic']).controller('navigationController', App.NavigationController).controller('searchController', App.SearchController).controller('collaboratorsController', App.CollaboratorsController).controller('panelController', App.PanelController).service('apiService', App.ApiService).config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', statesConfiguration]).config(['$httpProvider', httpLoadingInterceptor]).run(['$rootScope', '$ionicLoading', httpLoadingInterceptorActions]).config(['$compileProvider', function ($compileProvider) {
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|file|mailto|ms-appx):/);
        }]);
        angular.bootstrap(document.querySelector('body'), ['App']);
    }
    // Configure routes
    function statesConfiguration($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        // force native scroll
        var configProvider = $ionicConfigProvider;
        configProvider.scrolling.jsScrolling(false);
        $stateProvider.state('tabs', {
            url: "/tab",
            abstract: true,
            templateUrl: "templates/partials/tabs.html"
        }).state('tabs.left', {
            url: "/left",
            views: {
                'left-tab': {
                    templateUrl: "templates/pages/left.html"
                }
            }
        }).state('tabs.search', {
            url: "/search",
            views: {
                'search-tab': {
                    controller: 'searchController as search',
                    templateUrl: "templates/pages/search.html"
                }
            }
        }).state('tabs.collaborators', {
            url: "/collaborators",
            views: {
                'collaborators-tab': {
                    controller: 'collaboratorsController as collaborators',
                    templateUrl: "templates/pages/collaborators.html"
                }
            }
        });
        $urlRouterProvider.otherwise("/tab/search");
    }
    // Configure interceptor
    function httpLoadingInterceptor($httpProvider) {
        $httpProvider.interceptors.push(['$rootScope', function ($rootScope) {
            return {
                request: function (config) {
                    $rootScope.$broadcast('loading:show');
                    return config;
                },
                response: function (response) {
                    $rootScope.$broadcast('loading:hide');
                    return response;
                }
            };
        }]);
    }
    // Configure interceptor actions
    function httpLoadingInterceptorActions($rootScope, $ionicLoading) {
        $rootScope.$on('loading:show', function () {
            $ionicLoading.show({ templateUrl: "templates/partials/loading.html" });
        });
        $rootScope.$on('loading:hide', function () {
            $ionicLoading.hide();
        });
    }
})(App || (App = {}));
/// <reference path="imports.ts" />
var App;
(function (App) {
    var Config = (function () {
        function Config() {
        }
        Config.api = {
            base: 'http://apis.io/api',
            search: '/search',
            collaborators: '/maintainers'
        };
        return Config;
    })();
    App.Config = Config;
})(App || (App = {}));
// Platform specific overrides will be placed in the merges folder versions of this file 
/// <reference path="../imports.ts" />
var App;
(function (App) {
    'use strict';
    var CollaboratorsController = (function () {
        function CollaboratorsController(apiService) {
            this.apiService = apiService;
            this.getCollaboratos();
        }
        CollaboratorsController.prototype.getCollaboratos = function () {
            var _this = this;
            this.apiService.getCollaborators().then(function (results) {
                _this.list = results.data.data;
            });
        };
        CollaboratorsController.$inject = [
            'apiService'
        ];
        return CollaboratorsController;
    })();
    App.CollaboratorsController = CollaboratorsController;
})(App || (App = {}));
/// <reference path="../imports.ts" />
var App;
(function (App) {
    'use strict';
    var NavigationController = (function () {
        function NavigationController($scope /*&ng.IScope*/, $ionicHistory, $ionicTabsDelegate) {
            var _this = this;
            this.$scope = $scope;
            this.$ionicHistory = $ionicHistory;
            this.$ionicTabsDelegate = $ionicTabsDelegate;
            document.addEventListener('backbutton', function (e) { return _this.checkBack(e); }, false);
            this.$scope.onSwipeLeft = function () { return _this.onSwipeLeft(); };
            this.$scope.onSwipeRight = function () { return _this.onSwipeRight(); };
        }
        NavigationController.prototype.goBack = function () {
            this.$ionicHistory.goBack();
        };
        NavigationController.prototype.checkBack = function (e) {
            var page = this.$ionicHistory.currentStateName();
            if (page === 'tabs.home') {
                var nav = navigator;
                if (nav.app && nav.app.exitApp) {
                    nav.app.exitApp();
                }
                else {
                    window.close();
                }
            }
            else {
                this.goBack();
            }
        };
        NavigationController.prototype.onSwipeLeft = function () {
            this.$ionicTabsDelegate.select(this.$ionicTabsDelegate.selectedIndex() + 1);
        };
        NavigationController.prototype.onSwipeRight = function () {
            this.$ionicTabsDelegate.select(this.$ionicTabsDelegate.selectedIndex() - 1);
        };
        NavigationController.$inject = [
            '$scope',
            '$ionicHistory',
            '$ionicTabsDelegate'
        ];
        return NavigationController;
    })();
    App.NavigationController = NavigationController;
})(App || (App = {}));
/// <reference path="../imports.ts" />
var App;
(function (App) {
    'use strict';
    var PanelController = (function () {
        function PanelController(apiService) {
            this.apiService = apiService;
            this.list = [];
            this.getHelper();
        }
        PanelController.prototype.getHelper = function () {
            var _this = this;
            this.apiService.getHelper().then(function (results) {
                var data = results.data.data.links;
                for (var key in data) {
                    _this.list.push({
                        name: key,
                        link: data[key]
                    });
                }
            });
        };
        PanelController.$inject = [
            'apiService'
        ];
        return PanelController;
    })();
    App.PanelController = PanelController;
})(App || (App = {}));
/// <reference path="../imports.ts" />
var App;
(function (App) {
    'use strict';
    var SearchController = (function () {
        function SearchController($scope, apiService, $ionicScrollDelegate) {
            this.$scope = $scope;
            this.apiService = apiService;
            this.$ionicScrollDelegate = $ionicScrollDelegate;
            this.list = [];
            this.query = "";
            this.limit = 10;
            this.skip = 0;
        }
        SearchController.prototype.formatQuery = function () {
            return this.query + '&skip=' + this.skip + '&limit=' + this.limit;
        };
        SearchController.prototype.sendQuery = function () {
            var _this = this;
            if (this.query.length > 2) {
                this.apiService.search(this.formatQuery()).then(function (results) {
                    var data = results.data.data;
                    _this.loadMore = data.length > 0;
                    _this.list = _this.list.concat(data);
                    _this.skip += _this.limit;
                    _this.$scope.$broadcast('scroll.infiniteScrollComplete');
                    _this.$ionicScrollDelegate.scrollTop();
                });
            }
            else {
                this.list = [];
            }
        };
        SearchController.prototype.hasQuery = function () {
            return this.query.length > 2 && this.skip > 0 && this.loadMore;
        };
        SearchController.$inject = [
            '$scope',
            'apiService',
            '$ionicScrollDelegate'
        ];
        return SearchController;
    })();
    App.SearchController = SearchController;
})(App || (App = {}));
/// <reference path="../imports.ts" />
var App;
(function (App) {
    var ApiItem = (function () {
        function ApiItem() {
        }
        return ApiItem;
    })();
    App.ApiItem = ApiItem;
})(App || (App = {}));
var App;
(function (App) {
    var Collaborator = (function () {
        function Collaborator() {
        }
        return Collaborator;
    })();
    App.Collaborator = Collaborator;
})(App || (App = {}));
/// <reference path="../imports.ts" />
var App;
(function (App) {
    var ApiService = (function () {
        function ApiService($http, $q) {
            this.$http = $http;
            this.$q = $q;
        }
        ApiService.prototype.search = function (query) {
            return this.$http.get(App.Config.api.base + App.Config.api.search + '?q=' + query);
        };
        ApiService.prototype.getCollaborators = function () {
            return this.$http.get(App.Config.api.base + App.Config.api.collaborators);
        };
        ApiService.prototype.getHelper = function () {
            return this.$http.get(App.Config.api.base);
        };
        ApiService.$inject = [
            '$http',
            '$q',
        ];
        return ApiService;
    })();
    App.ApiService = ApiService;
})(App || (App = {}));
//# sourceMappingURL=appBundle.js.map