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
            'bower_components/ko-grid-cell-navigation/dist/ko-grid-cell-navigation.debug.css',
            'bower_components/ko-grid-column-resizing/dist/ko-grid-column-resizing.debug.css',
            'bower_components/ko-grid-editing/dist/ko-grid-editing.debug.css',
            'bower_components/ko-grid-export/dist/ko-grid-export.debug.css',
            'bower_components/ko-grid-filtering/dist/ko-grid-filtering.debug.css',
            'bower_components/ko-grid-full-screen/dist/ko-grid-full-screen.debug.css',
            'bower_components/ko-grid-height-adjuster/dist/ko-grid-height-adjuster.debug.css',
            'bower_components/ko-grid-paging/dist/ko-grid-paging.debug.css',
            'bower_components/ko-grid-selection/dist/ko-grid-selection.debug.css',
            'bower_components/ko-grid-sorting/dist/ko-grid-sorting.debug.css',
            'bower_components/ko-grid-toolbar/dist/ko-grid-toolbar.debug.css',
            'src/bundle.less'
        ]
    });
};
