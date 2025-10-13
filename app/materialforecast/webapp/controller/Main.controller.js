sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "../util/formatter"
], function (Controller, MessageToast,formatter) {
    formatter: formatter,
    "use strict";
    return Controller.extend("materialforecast.controller.Main", {
        formatRiskState: function(sRisk) {
            return sRisk === "HIGH" ? "Error" : "Success";
        },
        
        onInit: function () {
            const oComponent = this.getOwnerComponent();
            const oModel = oComponent.getModel();
            const oTable = this.byId("materialTable");
            
            console.log("Controller onInit - Table element:", oTable);
            
            if (oModel) {
                console.log("OData model found, service URL:", oModel.getServiceUrl());
                
                // Set model on view
                this.getView().setModel(oModel);                
                console.log("Model set on view");
                
                // Attach selection change event
                oTable.attachSelectionChange(this.onSelectionChange, this);
                
                // Force manual binding
                setTimeout(() => {
                    console.log("Table should be automatically bound via XML");
                    const oBinding = oTable.getBinding("items");
                    if (oBinding) {
                        console.log("Table binding found, refreshing...");
                        oBinding.refresh();
                    }
                }, 500);
                
            } else {
                console.error("No OData model found");
            }
        },

        onSelectionChange: function() {
            const oTable = this.byId("materialTable");
            const aSelectedItems = oTable.getSelectedItems();
            const oRunForecastBtn = this.byId("runForecastBtn");
            const oSuggestPRBtn = this.byId("suggestPRBtn");
            
            // Enable Run Forecast if items are selected
            oRunForecastBtn.setEnabled(aSelectedItems.length > 0);
            
            // Enable Suggest PR only if selected items have HIGH risk
            const bHasHighRisk = aSelectedItems.some(oItem => {
                const oContext = oItem.getBindingContext();
                return oContext && oContext.getObject().RiskFlag === 'HIGH';
            });
            oSuggestPRBtn.setEnabled(bHasHighRisk);
        },

        onRunForecast: function () {
            const oTable = this.byId("materialTable");
            const aSelectedItems = oTable.getSelectedItems();
            
            if (aSelectedItems.length === 0) {
                MessageToast.show("Please select at least one material forecast item");
                return;
            }

            const oModel = this.getView().getModel();
            
            try {
                const aItems = aSelectedItems.map(oItem => {
                const oContext = oItem.getBindingContext();
                if (!oContext) {
                    throw new Error("Invalid item context");
                }
                const oData = oContext.getObject();
                if (!oData) {
                    throw new Error("No data found for item");
                }
                return {
                    Material: oData.Material,
                    Plant: oData.Plant
                };
            });

                const oAction = oModel.bindContext("/RunForecast(...)");
                oAction.setParameter("items", aItems);
                
                oAction.execute().then(() => {
                    MessageToast.show("Forecast run successfully!");
                    oModel.refresh();
                }).catch((oError) => {
                    MessageToast.show("Error running forecast: " + oError.message);
                });
            } catch (error) {
                MessageToast.show("Error preparing forecast data: " + error.message);
            }
        },

        onSuggestPR: function () {
            const oTable = this.byId("materialTable");
            const aSelectedItems = oTable.getSelectedItems();
            
            if (aSelectedItems.length === 0) {
                MessageToast.show("Please select at least one material forecast item");
                return;
            }

            const oModel = this.getView().getModel();
            
            try {
                const aItems = aSelectedItems.map(oItem => {
                    const oContext = oItem.getBindingContext();
                    const oData = oContext.getObject();
                    return {
                        Material: oData.Material,
                        Plant: oData.Plant
                    };
                });

                const oAction = oModel.bindContext("/SuggestPR(...)");
                oAction.setParameter("items", aItems);
                
                oAction.execute().then(() => {
                    const res = oAction.getBoundContext().getObject();
                    const list = (res?.value ?? [])
                        .map(x => `${x.Material}/${x.Plant} → ${x.PRDraftID || "-"}`)
                        .join("\n");
                    MessageToast.show(`PR suggestions:\n\n${list}`);
                }).catch((oError) => {
                    MessageToast.show("Error suggesting PR: " + oError.message);
                });
            } catch (error) {
                MessageToast.show("Error preparing PR data: " + error.message);
            }
        }
    });
});