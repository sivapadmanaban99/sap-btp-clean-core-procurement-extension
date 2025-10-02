using { sap.ai.clean.core as model } from '../db/schema';
using from './annotations';

@path : '/odata/v4'
@impl : './forecast-service.js'
service ForecastService {

  entity MaterialForecast as projection on model.MaterialForecast;
  entity InvoiceVariance  as projection on model.InvoiceVariance;

  // Reusable type for (Material, Plant) tuples
  type MatPlant : {
    Material : String(40);
    Plant    : String(4);
  };

  // Unbound action
  @Common.SideEffects.TargetEntities: ['MaterialForecast']
  action RunForecast( items : array of MatPlant ) returns Boolean;
}
