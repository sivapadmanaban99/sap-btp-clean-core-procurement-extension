# SAP Build Work Zone Integration Steps

## 1. Deploy Your App to Cloud Foundry (Required)

First, ensure your app is deployed to CF:
```bash
# Build and deploy
mbt build
cf deploy mta_archives/sapaicleancoreuimaterialforecastfe_0.0.1.mtar
```

## 2. Access SAP Build Work Zone

1. Go to your **SAP BTP Cockpit**
2. Navigate to **Services > Instances and Subscriptions**
3. Find **SAP Build Work Zone, standard edition**
4. Click **Go to Application**

## 3. Create Content Package

In Work Zone Admin:

1. **Content Manager** → **Content Explorer**
2. Click **Create** → **Content Package**
3. Fill details:
   - **Title**: Material Forecast Package
   - **Description**: AI-powered material forecasting application
   - **Version**: 1.0.0

## 4. Add HTML5 Apps

1. In **Content Manager** → **HTML5 Apps**
2. Click **New** → **App**
3. Configure:
   - **App Title**: Material Forecast
   - **App ID**: `sap.ai.clean.core.ui.materialforecastfe`
   - **URL**: Your deployed app URL
   - **Description**: AI-powered supply chain forecasting

## 5. Create App Descriptor

Create this configuration:

```json
{
  "sap.app/id": "sap.ai.clean.core.ui.materialforecastfe",
  "sap.app/title": "Material Forecast",
  "sap.app/subTitle": "AI-Powered Supply Chain Analytics",
  "sap.app/description": "Predictive material forecasting with risk assessment",
  "sap.ui/icons/icon": "sap-icon://supply-chain",
  "sap.flp": {
    "type": "application",
    "appId": "sap.ai.clean.core.ui.materialforecastfe"
  }
}
```

## 6. Configure Tile Properties

**Tile Configuration:**
- **Title**: Material Forecast
- **Subtitle**: AI Supply Chain Analytics  
- **Icon**: sap-icon://supply-chain
- **Info**: Real-time forecasting
- **Keywords**: forecast, supply, chain, AI, analytics

## 7. Create Role and Assign Users

1. **Security** → **Roles**
2. Click **New Role**
3. Configure:
   - **Role Name**: MaterialForecastUser
   - **Description**: Access to Material Forecast App
4. **Assign Apps**: Add your Material Forecast app
5. **Assign Users**: Add yourself and test users

## 8. Create Site

1. **Site Directory** → **Create Site**
2. Configure:
   - **Site Name**: Supply Chain Hub
   - **Description**: AI-powered supply chain applications
   - **Template**: Standard Site

## 9. Add App to Site

1. Open your created site
2. **Content Manager** → **Apps**
3. Find your Material Forecast app
4. Click **Add to My Content**
5. **Assign to Role**: MaterialForecastUser

## 10. Configure Launchpad

1. **Site Manager** → **Edit Site**
2. **Add Section**: Supply Chain Analytics
3. **Add Tile**: Drag Material Forecast app
4. **Configure Tile**:
   - Position in desired location
   - Set tile size (1x1 or 2x1)
   - Add description text

## 11. Test Integration

1. **Preview Site** in Work Zone
2. Verify tile appears correctly
3. Click tile to launch app
4. Test all functionality:
   - Data loading
   - Run Forecast action
   - Suggest PR action
   - Navigation

## 12. Publish Site

1. **Site Manager** → **Publish**
2. **Assign Site to Role**: MaterialForecastUser
3. **Set as Default Site** (optional)

## 13. Access Your App

**Work Zone URL Pattern:**
```
https://[subdomain].dt.launchpad.cfapps.[region].hana.ondemand.com/site/[sitename]#MaterialForecast-Display
```

## 14. Mobile Configuration (Optional)

For mobile access:
1. **Mobile Services** → **Configure**
2. **Enable Mobile App**: Material Forecast
3. **Configure Push Notifications** (if needed)
4. **Test on SAP Mobile Start app**

## 15. Analytics Setup (Optional)

Enable usage analytics:
1. **Analytics** → **Configure**
2. **Enable Tracking**: User interactions
3. **Set KPIs**: App usage, forecast accuracy
4. **Create Dashboards**: Usage reports

## Troubleshooting Tips

**Common Issues:**

1. **App not appearing in Work Zone:**
   - Check CF deployment status
   - Verify manifest.json configuration
   - Ensure proper role assignment

2. **CORS errors:**
   - Verify destination configuration
   - Check service bindings
   - Ensure proper authentication

3. **Tile not loading:**
   - Check app URL accessibility
   - Verify HTML5 app registration
   - Test direct app access

**Verification Commands:**
```bash
# Check CF apps
cf apps

# Check routes
cf routes

# Check service bindings
cf services
```

## Final Result

Your Material Forecast app will be accessible through:
- **Work Zone Launchpad** with custom tile
- **Mobile-responsive** interface
- **Role-based access** control
- **Integrated navigation** with other SAP apps
- **Unified user experience** across SAP landscape

The app will appear as a professional tile in your Work Zone site, providing seamless access to your AI-powered supply chain forecasting capabilities.