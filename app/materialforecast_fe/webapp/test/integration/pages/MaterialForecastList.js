sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'sap.ai.clean.core.ui.materialforecastfe',
            componentId: 'MaterialForecastList',
            contextPath: '/MaterialForecast'
        },
        CustomPageDefinitions
    );
});