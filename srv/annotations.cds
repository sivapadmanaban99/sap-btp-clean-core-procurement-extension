using ForecastService from './service';

annotate ForecastService.MaterialForecast with @(
  UI.LineItem: [
    { Value: Material, Label: 'Material' },
    { Value: Plant, Label: 'Plant' },
    { Value: HistPeriod, Label: 'Period' },
    { Value: QtyIssued, Label: 'Qty Issued' },
    { Value: ForecastQty, Label: 'Forecast Qty' },
    { Value: StockOnHand, Label: 'Stock on Hand' },
    { Value: SuggestedReorder, Label: 'Suggested Reorder' },
    { Value: RiskFlag, Label: 'Risk Flag' }
  ],
  UI.SelectionFields: [
    Material,
    Plant,
    RiskFlag
  ],
  UI.HeaderInfo: {
    TypeName: 'Material Forecast',
    TypeNamePlural: 'Material Forecasts',
    Title: { Value: Material }
  },
  UI.Identification: [
    { Value: Material },
    { Value: Plant }
  ]
);

// Annotate the RunForecast action
annotate ForecastService.RunForecast with @(
  Common.SideEffects.TargetEntities: ['ForecastService.MaterialForecast']
);