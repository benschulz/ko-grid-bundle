'use strict';

define(['require', 'ko-data-source', 'ko-grid', 'ko-grid-aggregate', 'ko-grid-links', 'ko-grid-sorting', 'ko-indexed-repeat'],
    function (require) {
        return {
            'dataSource': require('ko-data-source'),
            'grid': require('ko-grid'),
            'extensions': {
                'aggregate': require('ko-grid-aggregate'),
                'links': require('ko-grid-links'),
                'sorting': require('ko-grid-sorting')
            }
        };
    });