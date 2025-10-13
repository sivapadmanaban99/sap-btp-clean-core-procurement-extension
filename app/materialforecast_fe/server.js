// server.js - improved static server for UI5 / Fiori apps
const express = require('express');
const path = require('path');
const app = express();

const port = process.env.PORT || process.env.VCAP_APP_PORT || 8080;
const distPath = path.join(__dirname, 'dist');

// Serve static files (do not auto-serve index for folders)
app.use(express.static(distPath, { index: false }));

// Optional: if you have API endpoints proxied here, add routes before the SPA fallback.
// e.g. app.use('/odata', proxy(...))  OR handle static JSON endpoints.
//
// --- SPA fallback for navigation requests only ---
// Only return index.html for requests that accept HTML (typical browser nav).
app.get('*', (req, res, next) => {
  // Only handle GET
  if (req.method !== 'GET') return next();

  // If client explicitly wants HTML, return index.html (SPA navigation)
  const accept = req.headers.accept || '';
  if (accept.indexOf('text/html') !== -1) {
    return res.sendFile(path.join(distPath, 'index.html'));
  }

  // Otherwise, respond with 404 for missing static assets / API calls
  res.status(404).end();
});

// Start server
app.listen(port, () => {
  console.log(`MaterialForecast UI listening on port ${port}`);
});
