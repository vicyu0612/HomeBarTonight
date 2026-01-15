---
description: Sync code changes to iOS app after modifications
---

# Sync to iOS App Workflow

Use this workflow after making code changes to ensure they are reflected in the iOS app.

## When to Use

Run this workflow after:
- Making changes to React components
- Updating styles or assets
- Modifying app logic
- Adding new features

**Note**: This workflow is automatic unless you explicitly specify not to sync.

## Steps

### 1. Build Production Version

// turbo
```bash
npm run build
```

This compiles TypeScript and creates optimized production files in `dist/`.

### 2. Sync to iOS

// turbo
```bash
npx cap sync ios
```

This copies the built files to the iOS app and updates Capacitor plugins.

### 3. Verify Sync (Optional)

Check the output for:
- ✓ Copying web assets
- ✓ Creating capacitor.config.json
- ✓ Updating iOS plugins
- [info] Sync finished

### 4. Test in Xcode (When Needed)

Open in Xcode to test on simulator or device:
```bash
npx cap open ios
```

## Quick Command

For convenience, use the combined command:

// turbo
```bash
npm run build:ios
```

This runs both `npm run build` and `npx cap sync ios` in one step.

## Notes

- **Automatic by default**: Unless you specify "don't sync", changes will be synced to iOS
- **Development mode**: `npm run dev` is for web development only, not for iOS testing
- **Testing**: Always test critical changes in Xcode before submitting to App Store
- **Build time**: Typical sync takes ~0.5-2 seconds

## Troubleshooting

If sync fails:
1. Check that `dist/` folder exists and has content
2. Verify Capacitor is installed: `npm list @capacitor/cli`
3. Try cleaning: `rm -rf ios/App/App/public && npx cap sync ios`
4. Rebuild: `npm run build:ios`
