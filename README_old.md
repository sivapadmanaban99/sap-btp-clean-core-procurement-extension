# AI Clean Core - Material Forecast Application

AI-powered material forecast application built with SAP's Clean Core architecture.

## Architecture
- **Backend**: SAP CAP (Cloud Application Programming) with Node.js
- **Frontend**: UI5 with OData v4
- **Database**: SQLite (dev) / HANA (prod)
- **Deployment**: Multi-Target Application (MTA)

## Features
- Material consumption tracking
- AI-powered forecast calculations
- Risk assessment (HIGH/LOW)
- Multi-selection for batch processing
- Responsive UI5 interface

## Quick Start
```bash
npm install
npm start
```

Access the app at: http://localhost:4004/materialforecast/webapp/index.html

## Project Structure
```
├── app/materialforecast/webapp/    # UI5 Frontend
├── srv/                           # CAP Services
├── db/                           # Data Models
└── mta.yaml                      # Deployment Config
```

## Technologies
- SAP CAP Framework
- UI5 (sap_horizon theme)
- OData v4
- SQLite/HANA
- Node.js
