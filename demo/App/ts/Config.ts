/// <reference path="imports.ts" />

module App {
    export  class Config {
        constructor() { }

        public static api = {
            base: 'http://apis.io/api',
            search: '/search',
            collaborators: '/maintainers'
        }

    }
}