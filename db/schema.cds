namespace sap.ai.clean.core;

/* MM: monthly consumption + forecast */
entity MaterialForecast {
  key Material       : String(40);
  key Plant          : String(4);
  key HistPeriod     : String(6);   // YYYYMM
      QtyIssued      : Decimal(15,3);
      ForecastQty    : Decimal(15,3);
      StockOnHand    : Decimal(15,3);
      SuggestedReorder: Decimal(15,3);
      RiskFlag       : String(10);
}

/* FI/CO: simple variance flags (placeholder for later) */
entity InvoiceVariance {
  key CompanyCode    : String(4);
  key Supplier       : String(10);
  key Invoice        : String(20);
      PO             : String(20);
      GRIRDelta      : Decimal(15,2);
      PriceVarPct    : Decimal(5,2);
      Flag           : String(10);
}
