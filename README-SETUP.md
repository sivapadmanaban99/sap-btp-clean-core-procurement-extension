# Setup Instructions

## Prerequisites
- SAP BTP account with HANA Cloud
- Cloud Foundry CLI
- Node.js 18+

## Configuration

### 1. HANA Cloud Setup
```bash
# Create HDI container
cf create-service hana hdi-shared your-hdi-container-name

# Create service key
cf create-service-key your-hdi-container-name dev-key

# Get credentials
cf service-key your-hdi-container-name dev-key
```

### 2. Local Development
```bash
# Copy template and add your credentials
cp default-env.json.template default-env.json

# Edit default-env.json with your HANA credentials
# Replace all YOUR_* placeholders with actual values
```

### 3. Environment Variables
Set these for BPA integration:
```bash
export BPA_BASE_URL=https://your-bpa-service.cfapps.sap.hana.ondemand.com
export BPA_TOKEN=your-bpa-token
```

## Deployment
```bash
# Build and deploy
mbt build
cf deploy mta_archives/*.mtar
```

## Security Notes
- Never commit `default-env.json` to Git
- Use service bindings in production
- Rotate credentials regularly