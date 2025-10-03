sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'sap.ai.clean.core.ui.materialforecastfe',
            componentId: 'MaterialForecastObjectPage',
            contextPath: '/MaterialForecast'
        },
        CustomPageDefinitions
    );
});