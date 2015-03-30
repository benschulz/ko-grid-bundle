'use strict';

define(function (require) {
    return {
        'dataSource': require('ko-data-source'),
        'grid': require('ko-grid'),
        'extensions': {
            'aggregate': require('ko-grid-aggregate'),
            'columnResizing': require('ko-grid-column-resizing'),
            'columnScaling': require('ko-grid-column-scaling'),
            'columnSizing': require('ko-grid-column-sizing'),
            'columnWidthPersistence': require('ko-grid-column-width-persistence'),
            'export': require('ko-grid-export'),
            'filtering': require('ko-grid-filtering'),
            'fullScreen': require('ko-grid-full-screen'),
            'links': require('ko-grid-links'),
            'resizeDetection': require('ko-grid-resize-detection'),
            'sorting': require('ko-grid-sorting'),
            'toolbar': require('ko-grid-toolbar'),
            'viewModes': require('ko-grid-view-modes'),
            'viewStateStorage': require('ko-grid-view-state-storage'),
            'virtualization': require('ko-grid-virtualization')
        }
    };
});
