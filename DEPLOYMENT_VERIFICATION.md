# Deployment Verification Guide

This document provides instructions for verifying the deployed site on Cloudflare Pages.

## Prerequisites Completed ✅

- [x] Cloudflare Pages configuration (`wrangler.toml`) created
- [x] GitHub Actions CI workflow configured
- [x] GitHub Actions deployment workflow configured
- [x] Deployment documentation added to README
- [x] Deployment badge added to README
- [x] Production build tested locally and working
- [x] TypeScript type checking passes
- [x] All 522 unit tests pass

## Required: Configure GitHub Secrets

Before the site can be deployed, you must add the following secrets to your GitHub repository:

1. Go to your GitHub repository: https://github.com/mverdon/algorithm-playbook
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add:
   - **Name**: `CLOUDFLARE_API_TOKEN`
   - **Value**: Your Cloudflare API token (create at https://dash.cloudflare.com/profile/api-tokens)
     - Use "Edit Cloudflare Workers" template or custom token with "Account:Cloudflare Pages:Edit" permission
   
4. Click **New repository secret** again and add:
   - **Name**: `CLOUDFLARE_ACCOUNT_ID`
   - **Value**: Your Cloudflare Account ID (find at https://dash.cloudflare.com/ in right sidebar)

## Triggering Deployment

Once secrets are configured, deployment will happen automatically:

### Option 1: Automatic Deployment (Recommended)
- Push any commit to the `main` branch
- GitHub Actions will automatically build and deploy

### Option 2: Manual Deployment
1. Go to https://github.com/mverdon/algorithm-playbook/actions/workflows/deploy.yml
2. Click "Run workflow"
3. Select branch: `main`
4. Click "Run workflow"

### Option 3: Local Deployment via Wrangler CLI
```bash
# Install wrangler globally
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
wrangler pages deploy dist --project-name=algorithm-playbook
```

## Post-Deployment Verification Checklist

Once deployed successfully, verify the following on your Cloudflare Pages URL:

### Basic Functionality
- [ ] Site loads without errors
- [ ] Page title is "Algorithm Visualizer Playground"
- [ ] Favicon loads correctly
- [ ] All CSS styles apply correctly

### Sorting Algorithms Tab
- [ ] Tab switches to Sorting view
- [ ] Array visualization displays correctly
- [ ] Speed control (Slow/Normal/Fast) changes animation speed
- [ ] Array size slider (5-100) adjusts array length
- [ ] "Generate Random Array" button creates new array
- [ ] "Shuffle" button randomizes current array
- [ ] All sorting algorithms work:
  - [ ] Bubble Sort
  - [ ] Quick Sort
  - [ ] Merge Sort
  - [ ] Heap Sort
- [ ] Color-coded states during sorting (comparing, swapping, sorted)
- [ ] Animations are smooth and visible

### Pathfinding Algorithms Tab
- [ ] Tab switches to Pathfinding view
- [ ] Grid displays correctly
- [ ] Start node (green) is visible and draggable
- [ ] End node (red) is visible and draggable
- [ ] Click/drag on grid cells creates walls (black)
- [ ] "Clear Walls" button removes all walls
- [ ] "Clear Path" button removes algorithm visualization but keeps walls
- [ ] Maze generation patterns work:
  - [ ] Recursive Division
  - [ ] Random Maze
- [ ] All pathfinding algorithms work:
  - [ ] A* (A-Star)
  - [ ] Dijkstra's Algorithm
  - [ ] Breadth-First Search (BFS)
  - [ ] Depth-First Search (DFS)
- [ ] Path discovery animation shows visited cells (light blue)
- [ ] Final path highlights in yellow
- [ ] "No path found" message appears when path is blocked

### Theme Toggle
- [ ] Theme toggle button visible in header
- [ ] Clicking toggle switches between light and dark mode
- [ ] Theme preference persists after page reload
- [ ] All colors and contrasts work in both themes
- [ ] Icons and text remain readable in both themes

### Responsive Design
- [ ] Site works on desktop (1920x1080, 1366x768)
- [ ] Site works on tablet (768x1024)
- [ ] Layout adjusts appropriately for different screen sizes
- [ ] Touch interactions work on mobile/tablet devices
- [ ] No horizontal scrolling on smaller screens

### Performance
- [ ] Initial page load is fast (< 3 seconds)
- [ ] No console errors in browser DevTools
- [ ] Animations run smoothly without lag
- [ ] Bundle sizes are reasonable:
  - HTML: ~0.81 KB
  - CSS: ~36 KB (6.78 KB gzipped)
  - Main JS: ~42 KB (12.79 KB gzipped)
  - Vendor JS: ~67 KB (26.58 KB gzipped)

## Troubleshooting

### Deployment Fails
- Verify GitHub secrets are correctly set
- Check GitHub Actions logs: https://github.com/mverdon/algorithm-playbook/actions
- Ensure Cloudflare account has permissions for Pages

### Site Doesn't Load
- Check Cloudflare Pages dashboard for deployment status
- Verify DNS settings if using custom domain
- Clear browser cache and try incognito mode

### Functionality Issues
- Open browser DevTools Console (F12) and check for errors
- Verify all assets loaded correctly in Network tab
- Compare behavior with local preview: `npm run preview`

## Expected Cloudflare Pages URL

After successful deployment, your site will be available at:
- **Production**: `https://algorithm-playbook.pages.dev`
- Or custom domain if configured

## Verification Complete

Once you've verified all checklist items above, the deployment task can be marked as complete!

## Local Testing (No Deployment Required)

To test locally without deploying:
```bash
npm run build
npm run preview
# Visit http://localhost:4173/
```

This allows you to verify all functionality works before deploying to production.
