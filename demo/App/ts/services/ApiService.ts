/// <reference path="../imports.ts" />

module App {
    export class ApiService implements IApiService {

        public static $inject = [
            '$http',
            '$q',
        ];

        constructor(
            private $http: ng.IHttpService,
            private $q: ng.IQService
            ) {
            
        }

        public search(query: string): ng.IHttpPromise<any> {
            return this.$http.get(Config.api.base + Config.api.search + '?q=' + query);
        }

        public getCollaborators(): ng.IHttpPromise<any> {
            return this.$http.get(Config.api.base + Config.api.collaborators);
        }

        public getHelper(): ng.IHttpPromise<any> {
            return this.$http.get(Config.api.base);
        }

    }
}