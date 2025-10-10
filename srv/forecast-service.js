/* eslint-disable no-console */
const cds = require('@sap/cds');
const { SELECT, UPDATE } = cds.ql;

// Use global fetch on Node 18+; otherwise fallback to node-fetch
const fetch = globalThis.fetch || require('node-fetch');

const BPA_BASE_URL = process.env.BPA_BASE_URL || '';
const BPA_INSTANCES_URL = process.env.BPA_INSTANCES_URL || `${BPA_BASE_URL}/workflow/rest/v1/workflow-instances`;
const BPA_DEFINITION_NAME = process.env.BPA_DEFINITION_NAME || 'SuggestPRWorkflow';
const BPA_TOKEN           = process.env.BPA_TOKEN || '';                 // optional for now

function bpaHeaders() {
  const h = { 'Content-Type': 'application/json' };
  // Skip auth for trial accounts - BPA service not available
  // if (BPA_TOKEN) h.Authorization = `Bearer ${BPA_TOKEN}`;
  return h;
}

/** Poll a BPA workflow instance until Completed or timeout */
async function pollInstanceUntilDone(instanceId, timeoutMs = 15000, intervalMs = 1000) {
  const url = `${BPA_INSTANCES_URL}/${encodeURIComponent(instanceId)}?includeContext=true`;
  const end = Date.now() + timeoutMs;

  while (Date.now() < end) {
    const r = await fetch(url, { headers: bpaHeaders() });
    if (!r.ok) {
      const t = await r.text();
      throw new Error(`Poll failed (${r.status}): ${t}`);
    }
    const data = await r.json();
    if (data.status === 'COMPLETED') return data;
    if (data.status === 'ERROR') throw new Error(`BPA instance error: ${JSON.stringify(data.errors || data)}`);
    await new Promise(res => setTimeout(res, intervalMs));
  }
  throw new Error(`BPA instance ${instanceId} did not complete within ${timeoutMs} ms`);
}

/** Start BPA by definitionName and return { draftId, status } from context */
async function startWorkflowAndGetResult(Material, Plant) {
  if (!BPA_INSTANCES_URL || BPA_INSTANCES_URL.includes('${') || !BPA_TOKEN) {
    // Mock BPA response for POC/trial accounts
    return { draftId: `PR-${Material}-${Date.now()}`, status: 'COMPLETED' };
  }
  
  const payload = {
    definitionName: BPA_DEFINITION_NAME,       // or use definitionId
    context: {
      startEvent: { material: Material, plant: Plant }
    }
  };

  const res = await fetch(BPA_INSTANCES_URL, {
    method: 'POST',
    headers: bpaHeaders(),
    body: JSON.stringify(payload)
  });

  const text = await res.text();
  if (!res.ok) throw new Error(`BPA start failed (${res.status}): ${text}`);

  let json = {};
  try { json = JSON.parse(text || '{}'); } catch { /* ignore */ }

  // id may be in body or only in Location header
  let instanceId = json.id || json.instanceId || json.workflowInstanceId;
  if (!instanceId) {
    const loc = res.headers.get('location') || res.headers.get('Location');
    if (loc) instanceId = loc.split('/').pop();
  }
  if (!instanceId) throw new Error(`Cannot determine instance id from response: ${text}`);

  const inst = await pollInstanceUntilDone(instanceId);
  const draftId = inst.context?.custom?.draftId || inst.context?.draftId || null;
  const status  = inst.context?.custom?.status  || inst.context?.status  || null;
  return { draftId, status };
}

module.exports = (srv) => {
  const { MaterialForecast } = srv.entities;

  srv.on('READ', 'MaterialForecast', async (req) => {
    console.log('Fetching MaterialForecast data...');
    const result = await SELECT.from(MaterialForecast);
    console.log(`Retrieved ${result.length} MaterialForecast records`);
    return result;
  });

  // ---- RunForecast: keep Boolean return (as in your CDS) ----
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

    // (Optional) Kick BPA for the first item to show integration,
    // but still return Boolean to match your CDS signature.
    try {
      const { Material, Plant } = items[0];
      const result = await startWorkflowAndGetResult(Material, Plant);
      req.info(`BPA completed: draftId=${result.draftId}, status=${result.status}`);
    } catch (e) {
      req.warn(`BPA call skipped/failed: ${e.message}`);
    }

    return true;
  });

  // ---- SuggestPR: call BPA for each selected Mat/Plant and return PRDraftID ----
  srv.on('SuggestPR', async (req) => {
    const items = req.data.items || [];
    const results = [];

    for (const it of items) {
      const { Material, Plant } = it;

      // optional guard: suggest only when HIGH risk
      const rows = await SELECT.from(MaterialForecast).where({ Material, Plant }).limit(1);
      const row = rows[0];
      if (!row) continue;
      // if (row.RiskFlag !== 'HIGH') continue;

      try {
        const { draftId } = await startWorkflowAndGetResult(Material, Plant);
        results.push({ Material, Plant, PRDraftID: draftId || '' });
      } catch (e) {
        req.warn(`SuggestPR failed for ${Material}/${Plant}: ${e.message}`);
        console.warn(`[BPA] SuggestPR failed for ${Material}/${Plant}:`, e.message);
        results.push({ Material, Plant, PRDraftID: '' });
      }
    }
    return results;
  });
};
