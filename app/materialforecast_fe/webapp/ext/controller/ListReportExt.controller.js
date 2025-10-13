sap.ui.define([
  "sap/ui/core/mvc/ControllerExtension"
], function (ControllerExtension) {
  "use strict";

  return ControllerExtension.extend("sap.ai.clean.core.ui.materialforecastfe.ext.controller.ListReportExt", {
    override: {
      onAfterRendering: function () {
        this._setupSelectionHandler();
      }
    },

    _setupSelectionHandler: function () {
      const oView = this.base.getView();
      
      setTimeout(() => {
        const oTable = oView.getContent()[0].getContent()[0];
        if (oTable && oTable.attachSelectionChange) {
          oTable.attachSelectionChange(this._onSelectionChange.bind(this));
        }
      }, 2000);
    },

    _onSelectionChange: function (oEvent) {
      const oTable = oEvent.getSource();
      const aSelectedItems = oTable.getSelectedItems();
      
      // Find SuggestPR button in toolbar
      const oToolbar = oTable.getHeaderToolbar();
      if (!oToolbar) return;
      
      const aSuggestPRBtn = oToolbar.getContent().filter(oControl => 
        oControl.getText && oControl.getText() === "Suggest PR"
      );
      
      if (aSuggestPRBtn.length === 0) return;
      const oSuggestPRBtn = aSuggestPRBtn[0];
      
      // Check if any selected item has HIGH risk
      const bHasHighRisk = aSelectedItems.some(oItem => {
        const oContext = oItem.getBindingContext();
        return oContext && oContext.getObject().RiskFlag === 'HIGH';
      });
      
      oSuggestPRBtn.setEnabled(aSelectedItems.length > 0 && bHasHighRisk);
    }
  });
});