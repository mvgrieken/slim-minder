# Incident Runbook: Build Failure Resolution

## Overview
This runbook provides step-by-step procedures for resolving build failures in the Slim Minder application.

## Common Build Failures

### 1. Metro Module Resolution Failure
**Symptoms:**
- Error: `Cannot find module 'metro/src/ModuleGraph/worker/importLocationsPlugin'`
- Build fails during Metro bundler initialization

**Root Cause:**
- Dependency version incompatibility between Expo SDK and Metro
- Multiple Metro versions installed causing conflicts

**Resolution Steps:**
1. **Check current versions:**
   ```bash
   npm ls metro @expo/metro-config expo
   ```

2. **Validate dependencies:**
   ```bash
   npm run validate-deps
   ```

3. **Fix version conflicts:**
   - Update Metro to compatible version
   - Or downgrade Expo to compatible version
   - Clear npm cache: `npm cache clean --force`

4. **Reinstall dependencies:**
   ```bash
   npm install --force
   ```

5. **Test build:**
   ```bash
   npm run build:web
   ```

### 2. Node.js Version Mismatch
**Symptoms:**
- Warnings: `EBADENGINE Unsupported engine`
- Build environment uses different Node.js version

**Resolution Steps:**
1. **Check Node.js version:**
   ```bash
   node --version
   ```

2. **Update netlify.toml:**
   ```toml
   [build.environment]
   NODE_VERSION = "20.17.0"
   NPM_VERSION = "10.8.0"
   CI = ""
   ```

3. **Clear Netlify cache** via dashboard

### 3. Build Script Failures
**Symptoms:**
- Build script returns non-zero exit code
- Missing files or directories

**Resolution Steps:**
1. **Check build output directory:**
   ```bash
   ls apps/mobile/web-build/
   ```

2. **Verify build scripts:**
   ```bash
   npm run build:web --workspace=apps/mobile
   ```

3. **Check for missing files:**
   - Ensure `public/_redirects` exists
   - Verify all required dependencies are installed

## Emergency Procedures

### Immediate Rollback
If a deployment breaks production:

1. **Revert package.json changes:**
   ```bash
   git checkout HEAD~1 -- package.json apps/mobile/package.json
   ```

2. **Restore netlify.toml:**
   ```bash
   git checkout HEAD~1 -- netlify.toml
   ```

3. **Clear dependency cache:**
   ```bash
   npm cache clean --force
   rm -rf node_modules
   npm install
   ```

4. **Trigger new deployment**

### Contact Information
- **Primary On-Call:** [Team Lead]
- **Secondary:** [DevOps Engineer]
- **Escalation:** [CTO]

## Prevention Measures

### Pre-deployment Checklist
- [ ] All dependency compatibility checks pass
- [ ] Local build succeeds
- [ ] Build monitoring shows no issues
- [ ] No critical vulnerabilities detected
- [ ] Environment variables are correctly set

### Monitoring Alerts
- Build failure notifications (GitHub Actions)
- Dependency vulnerability alerts (npm audit)
- Performance degradation warnings
- Environment consistency checks

## Recovery Time Objectives
- **Detection Time:** <5 minutes
- **Response Time:** <15 minutes
- **Resolution Time:** <30 minutes
- **Recovery Time:** <1 hour

## Post-Incident Actions
1. **Document the incident** in this runbook
2. **Update monitoring** if gaps are identified
3. **Review prevention measures** effectiveness
4. **Schedule retrospective** within 24 hours
5. **Implement improvements** based on lessons learned
