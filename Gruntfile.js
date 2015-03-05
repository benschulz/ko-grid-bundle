'use strict';

module.exports = function (grunt) {
    require('grunt-commons')(grunt, {
        name: 'ko-grid-bundle',
        main: 'bundle',

        shims: {
            knockout: 'window.ko',
            require: function (configName, handler) {
                if (!Array.isArray(configName) || configName.length !== 1 || typeof configName[0] !== 'string' || typeof handler !== 'function')
                    throw new Error('Assertion error.');

                var store = window.ko.bindingHandlers['grid']['config'] = window.ko.bindingHandlers['grid']['config'] || {};
                handler(store[configName[0]]);
            }
        }
    }).initialize({
        less: [
            'bower_components/ko-grid/dist/ko-grid.debug.css',
            'bower_components/ko-grid-aggregate/dist/ko-grid-aggregate.debug.css',
            'bower_components/ko-grid-sorting/dist/ko-grid-sorting.debug.css'
        ]
    });
};
