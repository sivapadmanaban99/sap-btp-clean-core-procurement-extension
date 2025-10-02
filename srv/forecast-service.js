module.exports = (srv) => {
  const { MaterialForecast } = srv.entities;

  srv.on('READ', 'MaterialForecast', async (req) => {
    console.log('Fetching MaterialForecast data...');
    const result = await SELECT.from(MaterialForecast);
    console.log(`Retrieved ${result.length} MaterialForecast records`);
    return result;
  });

  srv.on('RunForecast', async (req) => {
    const items = req.data.items || [];
    if (!Array.isArray(items) || items.length === 0) return true;

    for (const it of items) {
      const { Material, Plant } = it;

      const rows = await SELECT.from(MaterialForecast)
        .where({ Material, Plant })
        .orderBy({ HistPeriod: 'desc' })
        .limit(3);

      try {
        const avg = rows.reduce((s, r) => s + Number(r.QtyIssued || 0), 0) / (rows.length || 1);
        const latest = rows[0] || {};
        const stock = Number(latest.StockOnHand || 0);
        const forecastQty = Math.max(0, avg);
        const suggested = Math.max(0, forecastQty - stock);
        const risk = suggested > 0 ? 'HIGH' : 'LOW';

        await UPDATE(MaterialForecast)
          .set({ ForecastQty: forecastQty, SuggestedReorder: suggested, RiskFlag: risk })
          .where({ Material, Plant });
      } catch (error) {
        console.error(`Error updating forecast for Material: ${Material}, Plant: ${Plant}`, error);
        throw error;
      }
    }
    return true;
  });
};
