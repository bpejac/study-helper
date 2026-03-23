import { Topic } from '@/types';

export const electron: Topic = {
  id: 'electron',
  title: 'Electron.js',
  description: 'Framework for building cross-platform desktop apps with web technologies',
  category: 'desktop',
  confidence: 'advanced',
  keyPoints: [
    {
      title: 'Process Model',
      description: 'Electron uses a **multi-process architecture** inspired by Chromium:\n\n- **Main process** (one per app): runs **Node.js**, manages the app lifecycle (`app.whenReady()`, `app.quit()`), creates and controls `BrowserWindow` instances, handles system-level operations (dialogs, menus, tray, notifications), and serves as the central hub for IPC. Has full access to Node.js and Electron APIs.\n- **Renderer process** (one per window): runs **Chromium**, displays the UI via HTML/CSS/JS. Each window is an isolated process with its own V8 instance. By default, renderers are **sandboxed** — no access to Node.js APIs for security.\n- **Utility processes**: launched via `utilityProcess.fork()` for CPU-intensive tasks (parsing, compression) without blocking the main process or UI. Unlike `child_process`, they share Electron\'s lifecycle management.',
    },
    {
      title: 'IPC Communication',
      description: 'Inter-Process Communication is the **only safe way** to communicate between main and renderer processes:\n\n- **`ipcRenderer.invoke(channel, ...args)`** → **`ipcMain.handle(channel, handler)`**: the **recommended pattern**. Returns a Promise, making it natural for async operations. Follows the request/response pattern.\n- **`ipcRenderer.send(channel, ...args)`** → **`ipcMain.on(channel, handler)`**: fire-and-forget messaging (one-way).\n- **`webContents.send(channel, ...args)`**: main-to-renderer push messaging (e.g., menu actions, system events).\n\nAll data is **serialized** (structured clone algorithm) when crossing process boundaries — no shared memory, no functions, no DOM references. Use **channels** (string identifiers) to route messages. Keep IPC payloads small for performance.',
    },
    {
      title: 'Context Isolation & Security',
      description: 'Context isolation is a critical security feature that creates a **separate JavaScript world** for the preload script, preventing the renderer\'s web content from accessing Node.js or Electron internals. **Always enable**: `contextIsolation: true` and `nodeIntegration: false` (both are defaults since Electron 12+).\n\nThe **preload script** runs in a privileged context with access to `require()` and Electron APIs. Use **`contextBridge.exposeInMainWorld()`** to selectively expose specific functions to the renderer. This creates a typed, controlled API surface — the renderer can only call what you explicitly expose.\n\n**Content Security Policy (CSP)** should be set in production to prevent XSS: restrict inline scripts, limit sources. Never load remote content without extreme caution — a compromised website in your app has potential access to the OS through any exposed APIs.',
    },
    {
      title: 'Native APIs',
      description: 'Electron provides access to **native OS features** that web apps cannot reach:\n\n- **`dialog`**: native file open/save dialogs, message boxes, error dialogs\n- **`Menu` / `MenuItem`**: native application and context menus with keyboard shortcuts\n- **`Tray`**: system tray / menu bar icon with click events and context menu\n- **`Notification`**: OS-native notifications with actions and sounds\n- **`globalShortcut`**: register system-wide keyboard shortcuts (even when app isn\'t focused)\n- **`shell`**: open external URLs, files, and folders in default applications\n- **`nativeTheme`**: detect and respond to OS dark/light mode changes\n- **`powerMonitor`**: detect system sleep, resume, lock/unlock events\n- **`screen`**: get display information, detect resolution changes\n- **`clipboard`**: read/write system clipboard (text, images, HTML)',
    },
    {
      title: 'Auto Updates',
      description: '**`electron-updater`** (from `electron-builder`) provides automatic app updates:\n\n1. App checks an update server (GitHub Releases, S3, custom) for new versions\n2. Downloads the update in the background with progress events\n3. User can be prompted or auto-restart to apply the update\n4. On macOS: uses **Squirrel.Mac** (replaces app bundle). On Windows: **NSIS** installer or **Squirrel.Windows**\n\nRequires **code signing** — unsigned updates are rejected by the OS. Supports **differential updates** (download only changed blocks, not entire app). For staged rollouts, configure percentage-based deployment. Always test updates on both platforms — the update flow differs significantly between macOS and Windows.',
    },
    {
      title: 'Performance & Memory',
      description: 'Electron apps bundle **Chromium + Node.js**, resulting in a large baseline:\n\n- **App size**: ~150-200MB minimum (can be reduced with `electron-builder` compression)\n- **RAM**: each window spawns a renderer process (~30-80MB). Minimize window count.\n- **Startup time**: cold start can take 1-3 seconds. Optimize by deferring non-critical initialization, lazy-loading modules, and using a splash screen.\n\nPerformance tips: use **`BrowserWindow.show = false`** + `ready-to-show` event to avoid white flash on startup. Profile with **Chrome DevTools** (built into every renderer). Use **`v8-compile-cache`** to cache compiled JavaScript. Move heavy computation to **utility processes**. Consider **`WebContentsView`** (replaces BrowserView) for multi-view UIs without multiple windows.',
    },
  ],
  quizQuestions: [
    {
      question: 'What is the difference between the Main process and Renderer process?',
      answer: 'Main process runs Node.js, manages windows and app lifecycle, handles OS interactions (one per app). Renderer processes run Chromium, display UI via HTML/CSS/JS, and are sandboxed (one per window). Communication between them requires IPC.',
    },
    {
      question: 'Why is Context Isolation important for security?',
      answer: 'It prevents the renderer\'s JavaScript from accessing Node.js APIs or Electron internals directly. Without it, any XSS vulnerability or malicious remote content could execute arbitrary code on the user\'s system (file access, process spawning, etc.).',
    },
    {
      question: 'How do you safely expose Node.js functionality to the renderer?',
      answer: 'Use a preload script with contextBridge.exposeInMainWorld() to selectively expose specific functions. The renderer can only call what\'s explicitly exposed through this controlled API surface. Never expose raw require() or generic IPC channels to the renderer.',
    },
    {
      question: 'Why does Electron have a large app size?',
      answer: 'Electron bundles full Chromium and Node.js runtimes with each app, adding ~150-200MB. This provides consistent cross-platform behavior without depending on system browsers, but means even a simple app has a significant baseline size.',
    },
    {
      question: 'What is the recommended IPC pattern in modern Electron?',
      answer: 'Use ipcRenderer.invoke() in the renderer (via preload) paired with ipcMain.handle() in the main process. It returns a Promise, follows request/response pattern, and is the cleanest way to do async operations across processes. Avoid ipcRenderer.sendSync() as it blocks the renderer.',
    },
    {
      question: 'Why should you never use nodeIntegration: true?',
      answer: 'With nodeIntegration enabled, the renderer has direct access to Node.js APIs (fs, child_process, etc.). If the renderer loads any remote content or has an XSS vulnerability, an attacker gains full system access. Always use contextIsolation + contextBridge instead.',
    },
    {
      question: 'What is the ready-to-show event used for?',
      answer: 'It fires when the BrowserWindow\'s content is fully loaded and rendered. By creating the window with show: false and showing it on ready-to-show, you avoid the ugly white flash during startup. This provides a polished native-feel launch experience.',
    },
    {
      question: 'How does data get passed through IPC?',
      answer: 'Data is serialized using the structured clone algorithm when crossing process boundaries. This means no functions, DOM elements, or class instances — only plain objects, arrays, primitives, and some built-in types (Date, ArrayBuffer, Map, Set). Keep payloads small for performance.',
    },
    {
      question: 'What is a utility process and when should you use one?',
      answer: 'A utility process (utilityProcess.fork()) runs Node.js code in a separate process for CPU-intensive tasks. Unlike worker_threads, it\'s a full separate process. Use it for tasks that would block the main process (file parsing, data processing) without affecting UI responsiveness.',
    },
    {
      question: 'How do auto-updates work in Electron?',
      answer: 'electron-updater checks an update server for new versions, downloads updates in the background, and applies them on restart. Requires code signing. On macOS, it replaces the app bundle; on Windows, it uses the NSIS installer. Updates can be differential (downloading only changed portions).',
    },
    {
      question: 'What happens to renderer processes when their window is closed?',
      answer: 'The renderer process is destroyed when its BrowserWindow is closed. All JavaScript state, DOM, timers, and network requests in that renderer are cleaned up. If you need to persist state, save it to disk (localStorage, files, or IPC to main) before the window closes.',
    },
    {
      question: 'How do you handle deep links in Electron?',
      answer: 'Register a custom protocol (e.g., myapp://) using app.setAsDefaultProtocolClient(). On macOS, handle the open-url event. On Windows/Linux, the deep link URL is passed as a command-line argument to the new instance. Use app.requestSingleInstanceLock() to forward to the existing instance.',
    },
  ],
  codeExamples: [
    {
      title: 'Main Process Setup',
      language: 'typescript',
      code: `import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false, // Don't show until ready
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,   // Security: separate JS worlds
      nodeIntegration: false,   // Security: no Node in renderer
      sandbox: true,            // Security: OS-level sandboxing
    },
  });

  // Avoid white flash — show when content is painted
  mainWindow.once('ready-to-show', () => mainWindow?.show());

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile('dist/index.html');
  }
}

// Single instance lock — forward to existing window
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) { app.quit(); }
app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC handlers — renderer calls these via preload bridge
ipcMain.handle('read-file', async (_, filePath: string) => {
  const fs = await import('fs/promises');
  return fs.readFile(filePath, 'utf-8');
});

ipcMain.handle('get-app-version', () => app.getVersion());`,
      explanation: 'The main process manages windows and system operations. Security best practices: contextIsolation, no nodeIntegration, sandbox enabled. Single instance lock prevents duplicate app windows.',
    },
    {
      title: 'Preload Script (Context Bridge)',
      language: 'typescript',
      code: `import { contextBridge, ipcRenderer } from 'electron';

// Expose a controlled API to the renderer
// ONLY specific functions — never expose raw ipcRenderer
contextBridge.exposeInMainWorld('electronAPI', {
  // Request/response pattern (returns Promise)
  readFile: (path: string) => ipcRenderer.invoke('read-file', path),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // Main → renderer push events
  onMenuAction: (callback: (action: string) => void) => {
    const handler = (_: Electron.IpcRendererEvent, action: string) => 
      callback(action);
    ipcRenderer.on('menu-action', handler);
    // Return cleanup function
    return () => ipcRenderer.removeListener('menu-action', handler);
  },
  
  platform: process.platform,
});

// Type declarations for the renderer
declare global {
  interface Window {
    electronAPI: {
      readFile: (path: string) => Promise<string>;
      getAppVersion: () => Promise<string>;
      onMenuAction: (callback: (action: string) => void) => () => void;
      platform: NodeJS.Platform;
    };
  }
}`,
      explanation: 'The preload script is the secure bridge between main and renderer. contextBridge.exposeInMainWorld creates a frozen, non-tamperable API. Always return cleanup functions for event listeners to prevent memory leaks.',
    },
    {
      title: 'Native Features Integration',
      language: 'typescript',
      code: `import { 
  app, dialog, Menu, Tray, Notification, 
  nativeTheme, globalShortcut, shell 
} from 'electron';
import path from 'path';

// File dialog
async function openFile() {
  const result = await dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'Documents', extensions: ['txt', 'md', 'json'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  if (!result.canceled) return result.filePaths;
}

// System tray
function createTray() {
  const tray = new Tray(path.join(__dirname, 'icon.png'));
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Show App', click: () => mainWindow?.show() },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ]));
  tray.setToolTip('My Electron App');
}

// OS notifications
function notify(title: string, body: string) {
  new Notification({ title, body }).show();
}

// Dark mode detection
nativeTheme.on('updated', () => {
  const isDark = nativeTheme.shouldUseDarkColors;
  mainWindow?.webContents.send('theme-changed', isDark);
});

// Global shortcut (works even when app is unfocused)
app.whenReady().then(() => {
  globalShortcut.register('CommandOrControl+Shift+P', () => {
    mainWindow?.show();
    mainWindow?.focus();
  });
});`,
      explanation: 'Electron provides direct access to native OS features that web apps cannot reach. These APIs make desktop apps feel native rather than like wrapped websites.',
    },
  ],
};
