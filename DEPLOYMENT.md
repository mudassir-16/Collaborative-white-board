# Collaborative Whiteboard - Vercel Deployment Guide

## Project Overview
This is a real-time collaborative whiteboard application built with Express.js and Socket.IO that allows multiple users to draw together on a shared canvas.

## Files Created/Modified for Vercel Deployment

### 1. `vercel.json` - Vercel Configuration
- Configures the deployment settings
- Routes all traffic to the API handler
- Specifies Node.js 18.x runtime

### 2. `api/index.js` - Serverless Function Handler
- Contains the Express server and Socket.IO logic
- Adapted for Vercel's serverless environment
- Handles all routes and WebSocket connections

### 3. `package.json` - Updated Dependencies
- Added build scripts for Vercel
- Specified Node.js engine requirement
- Maintained all necessary dependencies

## Deployment Steps

### Prerequisites
1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com) if you don't have one
2. **Git Repository**: Your project should be in a Git repository (GitHub, GitLab, or Bitbucket)
3. **Vercel CLI** (Optional): Install with `npm i -g vercel`

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to Git Repository**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Import Project in Vercel**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your Git repository
   - Vercel will automatically detect it's a Node.js project

3. **Configure Deployment**
   - **Framework Preset**: Other
   - **Root Directory**: `./` (default)
   - **Build Command**: Leave empty (no build step required)
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be available at `https://your-project-name.vercel.app`

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from Project Directory**
   ```bash
   vercel
   ```

4. **Follow the Prompts**
   - Link to existing project or create new
   - Confirm settings
   - Deploy

## Important Notes

### Socket.IO Considerations
- **WebSocket Support**: Vercel supports WebSockets through serverless functions
- **Session Persistence**: Sessions are stored in memory and will reset when the serverless function cold starts
- **Scaling**: Each session will be handled by a separate serverless function instance

### Environment Variables
- No additional environment variables are required for basic functionality
- The app uses `process.env.PORT` which Vercel provides automatically

### Custom Domain (Optional)
1. Go to your project dashboard in Vercel
2. Navigate to "Settings" → "Domains"
3. Add your custom domain
4. Configure DNS records as instructed

## Testing Your Deployment

1. **Visit Your App**: Go to your Vercel URL
2. **Create Session**: You'll be redirected to a unique board URL
3. **Share Link**: Copy the session link and open it in another browser tab
4. **Test Collaboration**: Draw on one tab and verify it appears in the other

## Troubleshooting

### Common Issues

1. **Socket.IO Connection Errors**
   - Ensure your `vercel.json` routes are correctly configured
   - Check that the API handler exports the Express app properly

2. **Static Files Not Loading**
   - Verify the `public` directory structure
   - Check that static file serving is configured correctly

3. **Deployment Failures**
   - Check the build logs in Vercel dashboard
   - Ensure all dependencies are in `package.json`
   - Verify Node.js version compatibility

### Debugging Steps

1. **Check Function Logs**
   - Go to Vercel dashboard → Functions tab
   - View logs for any errors

2. **Test Locally**
   ```bash
   npm start
   ```
   - Verify the app works locally before deploying

3. **Verify Configuration**
   - Double-check `vercel.json` syntax
   - Ensure all file paths are correct

## Performance Considerations

- **Cold Starts**: First request to a session may be slower due to serverless cold starts
- **Memory Usage**: Sessions are stored in memory, so they'll reset on cold starts
- **Concurrent Users**: Each session can handle multiple users, but very high concurrency may require optimization

## Next Steps

After successful deployment:
1. **Monitor Usage**: Check Vercel dashboard for usage metrics
2. **Set Up Monitoring**: Consider adding error tracking (Sentry, etc.)
3. **Optimize**: Monitor performance and optimize as needed
4. **Scale**: If you need persistent sessions, consider adding a database

## Support

If you encounter issues:
1. Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
2. Review Socket.IO serverless documentation
3. Check the project's GitHub issues (if applicable)

Your collaborative whiteboard should now be live and accessible to users worldwide! 🎨
