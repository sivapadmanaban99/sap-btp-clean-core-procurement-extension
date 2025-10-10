sap.ui.define(["sap/m/MessageToast"], function (MessageToast) {
  "use strict";
  return {
    execute: async function (oBindingContext, aSelectedContexts) {
      const ext = this.getExtensionAPI ? this.getExtensionAPI() : this;

      // collect selected rows from the LR table
      const aCtx = aSelectedContexts || [];
      if (!aCtx.length) {
        MessageToast.show("Select at least one row");
        return;
      }

      const items = aCtx.map(c => {
        const o = c.getObject();
        return { Material: o.Material, Plant: o.Plant };
      });

      try {
        const oModel = ext.getModel();
        console.log("Model type:", oModel.getMetadata().getName());
        
        const oBinding = oModel.bindContext("/SuggestPR(...)");
        oBinding.setParameter("items", items);
        await oBinding.invoke();
        const res = oBinding.getBoundContext().getObject();
        
        const ids = (res.value || []).map(x => x.PRDraftID).join(", ");
        MessageToast.show(ids ? `PR drafts: ${ids}` : "No PR drafts created");
      } catch (e) {
        MessageToast.show("Suggest PR failed: " + (e.message || e));
        console.error("SuggestPR error:", e);
        console.error("Model:", ext.getModel());
      }
    }
  };
});
