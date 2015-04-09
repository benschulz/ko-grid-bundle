'use strict';

define(function (require) {
    return {
        'dataSource': require('ko-data-source'),
        'entry': require('ko-entry'),
        'grid': require('ko-grid'),
        'extensions': {
            'aggregate': require('ko-grid-aggregate'),
            'cellNavigation': require('ko-grid-cell-navigation'),
            'columnResizing': require('ko-grid-column-resizing'),
            'columnScaling': require('ko-grid-column-scaling'),
            'columnSizing': require('ko-grid-column-sizing'),
            'columnWidthPersistence': require('ko-grid-column-width-persistence'),
            'editing': require('ko-grid-editing'),
            'export': require('ko-grid-export'),
            'filtering': require('ko-grid-filtering'),
            'fullScreen': require('ko-grid-full-screen'),
            'links': require('ko-grid-links'),
            'resizeDetection': require('ko-grid-resize-detection'),
            'selection': require('ko-grid-selection'),
            'sorting': require('ko-grid-sorting'),
            'toolbar': require('ko-grid-toolbar'),
            'viewModes': require('ko-grid-view-modes'),
            'viewStateStorage': require('ko-grid-view-state-storage'),
            'virtualization': require('ko-grid-virtualization')
        }
    };
});
