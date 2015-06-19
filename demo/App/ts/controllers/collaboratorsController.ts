/// <reference path="../imports.ts" />

module App {
    'use strict';

    export class CollaboratorsController {

        public static $inject = [
            'apiService'
        ];

        private list: Array<Collaborator>;

        constructor(
            private apiService: IApiService
            ) {

            this.getCollaboratos();
        }

        private getCollaboratos(): void{
            this.apiService.getCollaborators().then(results => {
                this.list = results.data.data;
            });
        }
    }
} 

