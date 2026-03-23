import { Topic } from '@/types';

export const electronCrossPlatform: Topic = {
  id: 'electron-cross-platform',
  title: 'Cross-Platform Desktop Apps',
  description: 'Building and distributing Electron apps for Windows and macOS',
  category: 'desktop',
  confidence: 'advanced',
  keyPoints: [
    {
      title: 'Platform-Specific Code',
      description: 'Each OS has unique behaviors, conventions, and APIs that require **platform-specific handling**:\n\n- **`process.platform`**: returns `"darwin"` (macOS), `"win32"` (Windows, including 64-bit), `"linux"`\n- **macOS**: app continues running when all windows are closed (convention); re-create window on dock click (`activate` event); native menus require the first item to be the app name\n- **Windows**: app quits when all windows are closed; uses different path separators (`\\` vs `/`); needs `win.setAppUserModelId()` for taskbar pinning\n- **File paths**: always use `path.join()` or `path.resolve()`, never string concatenation. Use `app.getPath()` for standard directories (`userData`, `downloads`, `temp`)',
    },
    {
      title: 'Code Signing',
      description: 'Code signing **cryptographically verifies** the app\'s identity and integrity. **Required** for a smooth user experience:\n\n- **macOS**: requires an **Apple Developer ID** certificate ($99/year). Steps: sign with `codesign`, then submit for **notarization** (Apple scans for malware). Since macOS Catalina, non-notarized apps trigger scary warnings or are blocked by **Gatekeeper**. Also need **hardened runtime** entitlements.\n- **Windows**: uses **Authenticode** certificates (EV or OV). EV certificates provide immediate **SmartScreen** reputation. OV certificates require building reputation over time. Without signing, SmartScreen shows "Windows protected your PC" warnings.\n- Both platforms: certificates expire and must be renewed. CI/CD should handle signing automatically using secure credential storage.',
    },
    {
      title: 'Build Configuration',
      description: '**`electron-builder`** is the standard tool for packaging and distributing Electron apps. Key capabilities:\n\n- **macOS targets**: `.dmg` (disk image with drag-to-install), `.pkg` (installer), `.zip` (for auto-updates), `.mas` (Mac App Store)\n- **Windows targets**: `NSIS` (traditional installer with wizard), `portable` (no install), `MSI`, `appx` (Windows Store)\n- **Linux targets**: `.AppImage`, `.deb`, `.rpm`, `.snap`, `.flatpak`\n\nConfiguration in `package.json` under `"build"` key or in `electron-builder.yml`. Supports **publish** configuration for auto-update servers (GitHub Releases, S3, generic). Important: you can only build macOS targets on macOS (code signing requires the Keychain). Cross-compile Windows from macOS/Linux using Wine, or use CI (GitHub Actions).',
    },
    {
      title: 'Native Modules',
      description: 'Node.js native modules (compiled C/C++ addons via `node-gyp`) must be **rebuilt** for Electron because:\n\n- Electron ships its **own Node.js version** with a different **ABI** (Application Binary Interface) than system Node\n- Modules compiled for Node.js will crash or malfunction in Electron\n\n**`electron-rebuild`** automatically recompiles native dependencies against Electron\'s headers. Run it after every `npm install`. Common native modules: `better-sqlite3` (local DB), `node-pty` (terminal emulator), `sharp` (image processing), `keytar` (OS keychain access).\n\nAlternatives to native modules: **N-API** (version-stable ABI, less likely to need rebuilding), **WASM** (WebAssembly — portable, no native compilation needed), or running native code in a **utility process** via FFI.',
    },
    {
      title: 'App Store Distribution',
      description: 'Publishing to official app stores adds complexity:\n\n- **Mac App Store (MAS)**: requires **sandboxing** (restricted file access, no `shell.openExternal` without entitlements), MAS-specific code signing (separate from Developer ID), and Apple review process. Some Electron APIs are restricted in sandbox. Many Electron apps distribute directly (outside MAS) to avoid these limitations.\n- **Windows Store / Microsoft Store**: uses **MSIX** packaging (replaces older AppX). Can be sideloaded or published through Partner Center. Supports auto-updates through the Store. Generally fewer restrictions than MAS.\n\nBoth stores take a **commission** (Apple 30%, Microsoft 15%). Direct distribution via website + auto-updates is the most common approach for Electron apps. Consider using **Sparkle** (macOS) or **Squirrel** (cross-platform) for direct-distribution update frameworks.',
    },
    {
      title: 'Testing & CI/CD',
      description: 'Testing and automating builds for cross-platform apps:\n\n- **Unit tests**: standard Jest/Vitest for business logic (no Electron dependency)\n- **Integration tests**: **Playwright** or **Spectron** (deprecated) for testing Electron-specific behavior — IPC, menus, native dialogs\n- **E2E tests**: Playwright supports Electron apps natively — can interact with BrowserWindows, evaluate renderer JS, test IPC flows\n\nCI/CD pipeline: use **GitHub Actions** with matrix builds (macOS runner for `.dmg`, Windows runner for `.exe`, Linux for `.AppImage`). Store code signing certificates as encrypted secrets. Automate: build → sign → notarize (macOS) → publish to GitHub Releases → trigger auto-update server. **Cache `node_modules`** and Electron binaries to speed up CI.',
    },
  ],
  quizQuestions: [
    {
      question: 'Why is code signing important for desktop apps?',
      answer: 'Without signing, OS security warnings scare users. macOS Gatekeeper blocks unsigned apps with scary dialogs. Windows SmartScreen shows "unrecognized app" warnings. Code signing proves the app comes from a known developer and hasn\'t been tampered with.',
    },
    {
      question: 'What is macOS notarization and why is it required?',
      answer: 'Notarization is Apple\'s process of scanning your signed app for malware and stapling a ticket to it. Since macOS Catalina, apps distributed outside the Mac App Store must be notarized to run without Gatekeeper warnings. It requires hardened runtime entitlements.',
    },
    {
      question: 'Why do native Node modules need to be rebuilt for Electron?',
      answer: 'Native modules are compiled against a specific Node.js ABI (Application Binary Interface). Electron uses its own Node version with a different ABI than system Node, so pre-compiled modules are incompatible. electron-rebuild recompiles them against Electron\'s headers.',
    },
    {
      question: 'What is the difference between process.platform values?',
      answer: 'process.platform returns "darwin" for macOS, "win32" for Windows (including 64-bit Windows), and "linux" for Linux. Use this for platform-specific code paths like menu structure, window behavior, and file path handling.',
    },
    {
      question: 'Why can you only build macOS targets on macOS?',
      answer: 'macOS code signing requires Apple\'s codesign tool and access to the Keychain, which only exist on macOS. Notarization also requires macOS tooling. Apple restricts these operations to their platform. CI services like GitHub Actions provide macOS runners for this purpose.',
    },
    {
      question: 'What is the difference between NSIS and portable Windows builds?',
      answer: 'NSIS creates a traditional installer with a wizard (asks for install directory, creates Start Menu shortcuts, registers uninstaller). Portable creates a self-contained .exe that runs without installation — useful for USB drives or restricted environments where users can\'t install software.',
    },
    {
      question: 'Why do many Electron apps skip the Mac App Store?',
      answer: 'MAS requires sandboxing, which restricts many Electron APIs (file system access, shell commands, global shortcuts). The review process adds delays, and Apple takes 30% commission. Direct distribution with auto-updates gives more freedom and keeps 100% of revenue.',
    },
    {
      question: 'What is the app.getPath() method used for?',
      answer: 'app.getPath() returns OS-specific standard directories: "userData" (per-user app config/data), "downloads", "documents", "temp", "home", "desktop". Always use this instead of hardcoding paths, as locations differ between macOS, Windows, and Linux.',
    },
    {
      question: 'How does electron-builder handle auto-updates?',
      answer: 'electron-builder\'s electron-updater checks a configured server (GitHub Releases, S3, or custom) for a latest.yml file. If a newer version exists, it downloads the update, verifies the signature, and prompts the user to restart. Configuration goes under the "publish" key in build config.',
    },
    {
      question: 'What is N-API and why is it better than raw native addons?',
      answer: 'N-API is a stable ABI layer for Node.js native addons. Unlike raw V8/Node addons that break between versions, N-API modules work across Node and Electron versions without recompilation. This significantly reduces maintenance burden for native dependencies.',
    },
    {
      question: 'How do you test an Electron app end-to-end?',
      answer: 'Use Playwright, which has native Electron support. It can launch the app, interact with BrowserWindows, evaluate JavaScript in both main and renderer processes, test IPC flows, and interact with native menus. Run tests in CI with a display server (Xvfb on Linux).',
    },
    {
      question: 'What is the macOS "activate" event?',
      answer: 'The "activate" event fires when the user clicks the app\'s dock icon on macOS. By convention, if no windows are open, you should re-create a window. This is the expected macOS behavior — apps stay running even when all windows are closed, and clicking the dock icon reopens them.',
    },
  ],
  codeExamples: [
    {
      title: 'electron-builder Configuration',
      language: 'json',
      code: `{
  "build": {
    "appId": "com.company.myapp",
    "productName": "My App",
    "directories": { "output": "release" },
    "mac": {
      "category": "public.app-category.developer-tools",
      "hardenedRuntime": true,
      "gatekeeperAssess": false,
      "entitlements": "build/entitlements.mac.plist",
      "target": ["dmg", "zip"]
    },
    "win": {
      "target": ["nsis", "portable"],
      "certificateFile": "cert.pfx",
      "certificatePassword": "\${env.WIN_CSC_KEY_PASSWORD}"
    },
    "nsis": {
      "oneClick": false,
      "perMachine": true,
      "allowToChangeInstallationDirectory": true
    },
    "linux": {
      "target": ["AppImage", "deb"],
      "category": "Development"
    },
    "publish": {
      "provider": "github",
      "owner": "myorg",
      "repo": "myapp"
    }
  }
}`,
      explanation: 'electron-builder configuration defines platform-specific targets, signing options, and auto-update server. The "publish" config enables checking GitHub Releases for updates.',
    },
    {
      title: 'Platform-Specific Behavior',
      language: 'typescript',
      code: `import { app, Menu, BrowserWindow } from 'electron';
import path from 'path';

const isMac = process.platform === 'darwin';
const isWindows = process.platform === 'win32';

// macOS: Keep app running when all windows closed
app.on('window-all-closed', () => {
  if (!isMac) app.quit();
});

// macOS: Re-create window when dock icon clicked
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Platform-specific menu
const template: Electron.MenuItemConstructorOptions[] = [
  // macOS: first menu = app name (convention)
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' as const },
      { type: 'separator' as const },
      { label: 'Preferences...', accelerator: 'Cmd+,' },
      { type: 'separator' as const },
      { role: 'quit' as const }
    ]
  }] : []),
  {
    label: 'File',
    submenu: [
      { label: 'New', accelerator: 'CmdOrCtrl+N' },
      { label: 'Open...', accelerator: 'CmdOrCtrl+O' },
      { type: 'separator' as const },
      isMac ? { role: 'close' as const } : { role: 'quit' as const }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' as const },
      { role: 'redo' as const },
      { type: 'separator' as const },
      { role: 'cut' as const },
      { role: 'copy' as const },
      { role: 'paste' as const },
      // macOS-only edit features
      ...(isMac ? [{ role: 'selectAll' as const }] : [])
    ]
  }
];

Menu.setApplicationMenu(Menu.buildFromTemplate(template));

// Cross-platform paths: always use path.join + app.getPath
const userDataDir = app.getPath('userData');
const configPath = path.join(userDataDir, 'config.json');
// macOS: ~/Library/Application Support/MyApp/config.json
// Windows: %APPDATA%/MyApp/config.json
// Linux: ~/.config/MyApp/config.json`,
      explanation: 'Platform detection and conventions ensure a native feel on each OS. macOS has unique lifecycle behavior (dock, window closing) and menu conventions (app name menu, Cmd+comma for preferences).',
    },
    {
      title: 'CI/CD Build Matrix (GitHub Actions)',
      language: 'yaml',
      code: `# .github/workflows/build.yml
name: Build & Release
on:
  push:
    tags: ['v*']

jobs:
  build:
    strategy:
      matrix:
        include:
          - os: macos-latest
            target: mac
          - os: windows-latest
            target: win
          - os: ubuntu-latest
            target: linux
    runs-on: \${{ matrix.os }}
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      
      - run: npm ci
      - run: npm run build  # Build frontend
      
      # macOS: import signing certificate
      - if: matrix.target == 'mac'
        env:
          APPLE_API_KEY: \${{ secrets.APPLE_API_KEY }}
          CSC_LINK: \${{ secrets.MAC_CERT_BASE64 }}
          CSC_KEY_PASSWORD: \${{ secrets.MAC_CERT_PASSWORD }}
        run: npx electron-builder --mac --publish always
      
      # Windows: sign with certificate
      - if: matrix.target == 'win'
        env:
          WIN_CSC_LINK: \${{ secrets.WIN_CERT_BASE64 }}
          WIN_CSC_KEY_PASSWORD: \${{ secrets.WIN_CERT_PASSWORD }}
        run: npx electron-builder --win --publish always
      
      # Linux: no signing needed
      - if: matrix.target == 'linux'
        run: npx electron-builder --linux --publish always`,
      explanation: 'GitHub Actions matrix builds each platform on its native runner. Signing credentials are stored as encrypted secrets. The --publish always flag uploads artifacts to GitHub Releases for auto-updates.',
    },
  ],
};
