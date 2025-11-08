# ExamGuard Deployment Guide

## Prerequisites
- Node.js 18+ 
- npm or yarn
- Vercel account (for cloud deployment)
- Database (Supabase, Neon, or PostgreSQL)
- RF Hardware Detection System (optional)

## Local Development

### 1. Environment Setup
\`\`\`bash
cp .env.example .env.local
\`\`\`

Configure the following in `.env.local`:
- Database credentials
- AI service API keys (Google Vision, Azure, OpenAI)
- RF detector connection settings
- SMTP for email notifications

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Run Development Server
\`\`\`bash
npm run dev
\`\`\`

Visit http://localhost:3000

## Production Deployment

### Option 1: Vercel Deployment (Recommended)

1. **Push to GitHub**
\`\`\`bash
git push origin main
\`\`\`

2. **Connect to Vercel**
- Go to https://vercel.com/new
- Import your GitHub repository
- Add environment variables from Vercel dashboard
- Deploy

3. **Post-Deployment**
- Verify database connection
- Test AI monitoring endpoints
- Configure RF hardware if needed
- Set up SSL certificates

### Option 2: Self-Hosted Deployment

1. **Build Production Bundle**
\`\`\`bash
npm run build
npm start
\`\`\`

2. **Docker Deployment**
\`\`\`bash
docker build -t examguard .
docker run -p 3000:3000 --env-file .env.production examguard
\`\`\`

3. **Nginx Reverse Proxy**
\`\`\`nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
\`\`\`

## Hardware Integration

### RF Detection System Setup

1. **Install RTL-SDR or Compatible Hardware**
   - RTL2832U Software Defined Radio
   - Professional RF Spectrum Analyzer
   - Custom RF Detection System

2. **Configure RF Detector API**
\`\`\`bash
export RF_DETECTOR_API_URL=http://rf-detector-server:8000
export RF_DETECTOR_API_KEY=your-api-key
\`\`\`

3. **Enable RF Monitoring**
\`\`\`bash
export ENABLE_RF_MONITORING=true
\`\`\`

4. **Monitor RF Signals During Tests**
   - Dashboard at `/admin/rf-monitoring`
   - Real-time device detection
   - Threat assessment and alerts

## Monitoring & Maintenance

### Health Checks
- Database connectivity
- API endpoint responsiveness
- RF detection system status
- AI service availability

### Logs
\`\`\`bash
# View application logs
journalctl -u examguard -f

# View error logs
tail -f /var/log/examguard/error.log
\`\`\`

### Backup Strategy
- Daily database backups to S3
- Weekly full system backups
- Test restore procedures monthly

## Security Considerations

1. **SSL/TLS**: Always use HTTPS in production
2. **API Keys**: Store in environment variables, never commit
3. **Database**: Use encrypted connections, enable RLS
4. **Network**: Use firewall rules, limit API access
5. **RF Hardware**: Secure RF detector network, use VPN

## Troubleshooting

### Database Connection Issues
\`\`\`bash
psql $DATABASE_URL -c "SELECT NOW();"
\`\`\`

### AI Service Failures
- Check API keys in environment
- Verify network connectivity
- Check service status pages

### RF Hardware Problems
- Verify device drivers installed
- Check RF detector API connectivity
- Review frequency calibration

## Support

For deployment assistance:
1. Check logs: `/var/log/examguard/`
2. Review environment variables
3. Test connectivity to external services
4. Contact support@examguard.com
