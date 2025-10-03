sap.ui.define(["sap/m/MessageToast"], function (MessageToast) {
  "use strict";
  return {
    /**
     * Handler for the toolbar action.
     */
    execute: function (oBindingContext, aSelectedContexts) {
      // Get the current view from the binding context
      var oView = oBindingContext ? oBindingContext.getModel().getMetaModel().getMetaContext().getModel().getView() : null;
      
      // Fallback: try to get view from selected contexts
      if (!oView && aSelectedContexts && aSelectedContexts.length > 0) {
        oView = aSelectedContexts[0].getModel().getView ? aSelectedContexts[0].getModel().getView() : null;
      }
      
      // Last fallback: use sap.ui.getCore to find the view
      if (!oView) {
        var aViews = sap.ui.getCore().byFieldGroupId("fe::table::MaterialForecast::LineItem");
        oView = aViews.length > 0 ? aViews[0].getParent() : null;
      }

      // Use selected contexts directly - no need for table access
      var aCtx = aSelectedContexts || [];

      // Build payload from selected rows; fallback to a demo selection if none selected
      var items = aCtx.length
        ? aCtx.map(function(c) {
            var o = c.getObject();
            return { Material: o.Material, Plant: o.Plant };
          })
        : [{ Material: "MAT-100", Plant: "1010" }];

      var oModel = oBindingContext ? oBindingContext.getModel() : (aSelectedContexts && aSelectedContexts.length > 0 ? aSelectedContexts[0].getModel() : null);
      
      if (!oModel) {
        MessageToast.show("Unable to access model");
        return;
      }
      // Call unbound action using OData v4 model
      var oAction = oModel.bindContext("/RunForecast(...)");
      oAction.setParameter("items", items);
      
      oAction.execute().then(function() {
        MessageToast.show("Forecast executed");
        // Model will automatically refresh bound controls
        oModel.refresh();
      }).catch(function(e) {
        MessageToast.show("Run Forecast failed");
        // console.error(e);
      });
    }
  };
});
