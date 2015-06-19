/// <reference path="../imports.ts" />

module App {
    'use strict';

    export class PanelController {

        public static $inject = [
            'apiService'
        ];

        private list: Array<Object> = [];

        constructor(
            private apiService: IApiService
            ) {

            this.getHelper();
        }

        private getHelper(): void{
            this.apiService.getHelper().then(results => {
                var data = results.data.data.links;
                for (var key in data) {
                    this.list.push({
                        name: key,
                        link: data[key]
                    });
                }
            });
        }
    }
} 

