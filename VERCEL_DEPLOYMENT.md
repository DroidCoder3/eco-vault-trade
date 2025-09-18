# Vercel Deployment Guide for Eco Vault Trade

## Prerequisites
- GitHub account with the project repository
- Vercel account
- Node.js 18+ installed locally

## Step-by-Step Deployment Instructions

### 1. Prepare the Repository
```bash
# Ensure all files are committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Connect to Vercel

#### Option A: Import from GitHub
1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"
4. Import your repository: `DroidCoder3/eco-vault-trade-v2`
5. Click "Import"

#### Option B: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
cd /path/to/eco-vault-trade
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name: eco-vault-trade
# - Directory: ./
# - Override settings? No
```

### 3. Configure Environment Variables

In Vercel Dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the following variables:

```
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=2ec9743d0d0cd7fb94dee1a7e6d33475
NEXT_PUBLIC_INFURA_API_KEY=b18fb7e6ca7045ac83c41157ab93f990
NEXT_PUBLIC_RPC_URL=https://1rpc.io/sepolia
```

### 4. Configure Build Settings

In Vercel Dashboard:
1. Go to "Settings" → "General"
2. Set Framework Preset: "Vite"
3. Set Build Command: `npm run build`
4. Set Output Directory: `dist`
5. Set Install Command: `npm install`

### 5. Deploy

#### Automatic Deployment
- Push to main branch triggers automatic deployment
- Vercel will build and deploy automatically

#### Manual Deployment
```bash
# Deploy to production
vercel --prod

# Or deploy preview
vercel
```

### 6. Custom Domain (Optional)

1. Go to "Settings" → "Domains"
2. Add your custom domain
3. Configure DNS records as instructed
4. SSL certificate will be automatically provisioned

### 7. Environment-Specific Configuration

#### Development
```bash
# Deploy to preview
vercel

# Set environment variables for preview
vercel env add NEXT_PUBLIC_CHAIN_ID preview
# Enter: 11155111
```

#### Production
```bash
# Deploy to production
vercel --prod

# Set environment variables for production
vercel env add NEXT_PUBLIC_CHAIN_ID production
# Enter: 11155111
```

### 8. Monitoring and Analytics

1. Go to "Analytics" tab in Vercel Dashboard
2. Monitor performance metrics
3. Check deployment logs if issues occur

### 9. Troubleshooting

#### Common Issues:

**Build Failures:**
```bash
# Check build logs in Vercel Dashboard
# Common fixes:
npm install --legacy-peer-deps
```

**Environment Variables:**
- Ensure all required variables are set
- Check variable names match exactly
- Restart deployment after adding variables

**Wallet Connection Issues:**
- Verify WalletConnect Project ID is correct
- Check RPC URL is accessible
- Ensure chain ID matches network

### 10. Post-Deployment Checklist

- [ ] Application loads without errors
- [ ] Wallet connection works
- [ ] All environment variables are set
- [ ] Custom domain (if used) is working
- [ ] SSL certificate is active
- [ ] Analytics are tracking
- [ ] Performance is acceptable

### 11. Continuous Deployment

Set up automatic deployments:
1. Connect GitHub repository
2. Enable "Automatic Deployments"
3. Configure branch protection rules
4. Set up preview deployments for pull requests

### 12. Performance Optimization

```bash
# Enable Vercel Analytics
npm install @vercel/analytics

# Add to your app
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  return (
    <>
      {/* Your app */}
      <Analytics />
    </>
  );
}
```

### 13. Security Considerations

- Environment variables are encrypted
- API keys are not exposed to client-side
- HTTPS is enforced automatically
- DDoS protection is included

### 14. Backup and Recovery

- Code is backed up in GitHub
- Environment variables can be exported
- Deployment history is maintained
- Rollback to previous deployments is possible

## Support

For issues with deployment:
1. Check Vercel documentation
2. Review build logs
3. Contact Vercel support
4. Check GitHub repository status

## Cost Considerations

- Vercel offers free tier for personal projects
- Pro plan for production applications
- Bandwidth and build minutes included
- Custom domains supported on all plans
