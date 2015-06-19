/// <reference path="../imports.ts" />

module App {
    export interface IApiService {
        search(query: string): ng.IHttpPromise<any>;
        getCollaborators(): ng.IHttpPromise<any>;
        getHelper(): ng.IHttpPromise<any>;
    }
} 
