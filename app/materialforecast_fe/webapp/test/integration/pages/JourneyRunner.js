sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"sap/ai/clean/core/ui/materialforecastfe/test/integration/pages/MaterialForecastList",
	"sap/ai/clean/core/ui/materialforecastfe/test/integration/pages/MaterialForecastObjectPage"
], function (JourneyRunner, MaterialForecastList, MaterialForecastObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('sap/ai/clean/core/ui/materialforecastfe') + '/test/flp.html#app-preview',
        pages: {
			onTheMaterialForecastList: MaterialForecastList,
			onTheMaterialForecastObjectPage: MaterialForecastObjectPage
        },
        async: true
    });

    return runner;
});

