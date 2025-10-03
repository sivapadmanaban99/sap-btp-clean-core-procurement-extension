sap.ui.define([], function () {
  "use strict";
  return {
    riskToState: function (sRisk) {
      switch ((sRisk || "").toUpperCase()) {
        case "HIGH": return "Error";    // red
        case "MED":  return "Warning";  // orange
        case "LOW":  return "Success";  // green
        default:     return "None";
      }
    }
  };
});
