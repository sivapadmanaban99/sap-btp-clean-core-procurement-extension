sap.ui.define([
  "sap/m/MessageBox",
  "sap/m/MessageToast"
], function (MessageBox, MessageToast) {
  "use strict";

  return {
    // helper to collect Material/Plant pairs
    _getSelectedMatPlant: function(aCtx) {
      return aCtx.map(function(c) {
        const o = c.getObject();
        return { Material: o.Material, Plant: o.Plant };
      });
    },

    // Triggered when user clicks "Suggest PR"
    onSuggestPR: function (oBindingContext, aSelectedContexts) {
      try {
        const aCtx = aSelectedContexts || [];
        if (!aCtx.length) {
          return MessageToast.show("Select at least one row");
        }

        // Filter only HIGH risk items
        const aHighRiskCtx = aCtx.filter(function(c) {
          return c.getObject().RiskFlag === 'HIGH';
        });
        
        if (aHighRiskCtx.length === 0) {
          return MessageToast.show("Please select items with HIGH risk flag");
        }

        const oModel = oBindingContext ? oBindingContext.getModel() : aCtx[0].getModel();
        const items = aHighRiskCtx.map(function(c) {
          const o = c.getObject();
          return { Material: o.Material, Plant: o.Plant };
        });

        const oBind = oModel.bindContext("/SuggestPR(...)");
        oBind.setParameter("items", items);
        oBind.execute().then(function() {
          const res = oBind.getBoundContext().getObject();
          const list = (res?.value ?? [])
            .map(x => `${x.Material}/${x.Plant} → ${x.PRDraftID || "-"}`)
            .join("\n");

          MessageBox.success(`PR suggestions:\n\n${list}`);
        }).catch(function(error) {
          MessageToast.show("Error: " + error.message);
        });
      } catch (error) {
        MessageToast.show("Error: " + error.message);
      }
    },

    // Triggered when user clicks "Run Forecast"
    onRunForecast: function (oBindingContext, aSelectedContexts) {
      try {
        const aCtx = aSelectedContexts || [];
        if (!aCtx.length) {
          return MessageToast.show("Select at least one row");
        }

        const oModel = oBindingContext ? oBindingContext.getModel() : aCtx[0].getModel();
        const items = aCtx.map(function(c) {
          const o = c.getObject();
          return { Material: o.Material, Plant: o.Plant };
        });

        const oBind = oModel.bindContext("/RunForecast(...)");
        oBind.setParameter("items", items);
        oBind.execute().then(function() {
          MessageToast.show("Forecast updated");
          oModel.refresh();
        }).catch(function(error) {
          MessageToast.show("Error: " + error.message);
        });
      } catch (error) {
        MessageToast.show("Error: " + error.message);
      }
    }
  };
});