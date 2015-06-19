/// <reference path="../imports.ts" />

module App {
    'use strict';

    export class SearchController {


        public static $inject = [
            '$scope',
            'apiService',
            '$ionicScrollDelegate'
        ];

        private list: Array<ApiItem> = [];
        private query: string = "";
        private limit: number = 10;
        private skip: number = 0;
        private loadMore: boolean;

        constructor(
            private $scope: ng.IScope,
            private apiService: IApiService,
            private $ionicScrollDelegate: Ionic.IScrollDelegate
            ) {
        }

        private formatQuery(): string {
            return this.query + '&skip=' + this.skip + '&limit=' + this.limit;
        }

        private sendQuery(): void {
            if (this.query.length > 2) {
                this.apiService.search(this.formatQuery()).then(results => {
                    var data = results.data.data;
                    this.loadMore = data.length > 0;
                    this.list = this.list.concat(data);
                    this.skip += this.limit;
                    this.$scope.$broadcast('scroll.infiniteScrollComplete');
                    this.$ionicScrollDelegate.scrollTop();
                });
            } else {
                this.list = [];
            }
        }

        private hasQuery(): boolean {
            return this.query.length > 2 && this.skip > 0 && this.loadMore
        }
    }
} 

