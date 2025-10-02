sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/core/mvc/XMLView"
], function (UIComponent, XMLView) {
    "use strict";

    return UIComponent.extend("materialforecast.Component", {
        metadata: {
            manifest: "json",
            interfaces: ["sap.ui.core.IAsyncContentCreation"]
        },
        
        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
            
            // Ensure models are initialized
            const oModel = this.getModel();
            console.log("Component model initialized:", oModel);
            if (oModel) {
                console.log("Service URL:", oModel.getServiceUrl());
            }
        },
        
        createContent: function () {
            return XMLView.create({
                viewName: "materialforecast.view.Main"
            });
        }
    });
});