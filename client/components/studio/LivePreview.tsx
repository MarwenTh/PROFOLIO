import { useEffect, useRef, useState } from "react";

export default function LivePreview({
  files,
}: {
  files: { name: string; language: string; value: string }[];
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data === "PREVIEW_READY") {
        setIsReady(true);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    if (!isReady || !iframeRef.current?.contentWindow) return;
    const timeoutMsg = setTimeout(() => {
      iframeRef.current?.contentWindow?.postMessage({ files }, "*");
    }, 500); // 500ms debounce
    return () => clearTimeout(timeoutMsg);
  }, [files, isReady]);

  const srcDoc = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <script src="https://unpkg.com/lucide-react@latest/dist/umd/lucide-react.min.js"></script>
        <script src="https://unpkg.com/@tabler/icons-react@3.22.0/dist/umd/tabler-icons-react.min.js"></script>
        <script src="https://unpkg.com/framer-motion@11.11.1/dist/framer-motion.js"></script>
        <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
        <style>
          body { margin: 0; font-family: system-ui, sans-serif; background: transparent; }
          #root { padding: 1rem; }
        </style>
    </head>
    <body>
        <div id="root"></div>
        <script type="module">
          import * as TailwindMerge from "https://esm.sh/tailwind-merge@2.5.2";
          window.tailwindMerge = TailwindMerge;
          import * as clsx from "https://esm.sh/clsx@2.1.1";
          window.clsx = clsx.clsx || clsx.default || clsx;
          
          window.parent.postMessage('PREVIEW_READY', '*');
        </script>
        <script>
          function displayError(err) {
            console.error(err);
            const root = document.getElementById('root');
            let errOverlay = document.getElementById('error-overlay');
            if (!errOverlay) {
              errOverlay = document.createElement('div');
              errOverlay.id = 'error-overlay';
              errOverlay.style = 'position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,0,0,0.1); color: red; padding: 10px; font-family: monospace; white-space: pre-wrap; z-index: 50; overflow: auto; pointer-events: none;';
              document.body.appendChild(errOverlay);
            }
            errOverlay.textContent = err.toString();
          }

          window.addEventListener('error', (e) => displayError(e.error || e.message));
          window.addEventListener('unhandledrejection', (e) => displayError(e.reason));

          window.addEventListener('message', (event) => {
            const { files } = event.data;
            if (!files || !files.length) return;

            try {
              window.__modules = {};
              window.__exports = {};
              
              const moduleMap = {};
              files.forEach(f => {
                moduleMap[f.name] = f.value;
                // Also map without extension if missing
                const baseName = f.name.replace(/\\.[^/.]+$/, "");
                if (!moduleMap[baseName]) moduleMap[baseName] = f.value;
              });

              window.require = function(moduleName) {
                if (moduleName === 'react') return React;
                if (moduleName === 'react-dom') return ReactDOM;
                if (moduleName === 'lucide-react') return window.lucide || {};
                if (moduleName === '@tabler/icons-react') return window.TablerIconsReact || {};
                if (moduleName === 'framer-motion' || moduleName === 'motion/react') return window.Motion || {};
                if (moduleName === 'clsx') return window.clsx ? { clsx: window.clsx, default: window.clsx } : {};
                if (moduleName === 'tailwind-merge') return window.tailwindMerge || {};
                
                let resolvedName = moduleName;
                if (resolvedName.startsWith('./')) resolvedName = resolvedName.slice(2);
                if (resolvedName.startsWith('../')) resolvedName = resolvedName.slice(3); // simplistic
                if (resolvedName.startsWith('@/')) resolvedName = resolvedName.slice(2); // alias support
                
                // try to find the module
                let codeToCompile = moduleMap[resolvedName] || moduleMap[resolvedName + '.tsx'] || moduleMap[resolvedName + '.ts'];
                
                if (codeToCompile !== undefined) {
                  if (window.__exports[resolvedName]) return window.__exports[resolvedName];
                  
                  const transpiled = Babel.transform(codeToCompile, {
                    presets: ['react', 'typescript', ['env', { modules: 'commonjs' }]],
                    filename: resolvedName + (resolvedName.includes('.') ? '' : '.tsx')
                  }).code;
                  
                  const module = { exports: {} };
                  const wrapper = new Function('require', 'exports', 'module', transpiled);
                  wrapper(window.require, module.exports, module);
                  
                  window.__exports[resolvedName] = module.exports;
                  return module.exports;
                }
                
                console.warn('Module not found:', moduleName);
                return {};
              };

              // First, clear previous root
              const rootElement = document.getElementById('root');
              if (!window._myReactRoot) {
                window._myReactRoot = ReactDOM.createRoot(rootElement);
              }

              // Evaluate all files just to build the module cache (optional, but good for utils)
              // We just require the main component file.
              const mainFile = files.find(f => f.name === 'component.tsx');
              if (!mainFile) throw new Error("component.tsx not found");

              const mainExports = window.require('component.tsx');
              const App = mainExports.default || Object.values(mainExports)[0];

              if (!App) {
                rootElement.innerHTML = '<div style="color: #666; padding: 10px;">Please export a default component from component.tsx.</div>';
                return;
              }

              class ErrorBoundary extends React.Component {
                constructor(props) {
                  super(props);
                  this.state = { hasError: false, error: null };
                }
                static getDerivedStateFromError(error) {
                  return { hasError: true, error };
                }
                componentDidCatch(error, errorInfo) {
                  console.error(error, errorInfo);
                }
                render() {
                  if (this.state.hasError) {
                    return React.createElement('div', { 
                      style: { color: 'red', padding: '10px', background: 'rgba(255,0,0,0.1)', fontFamily: 'monospace', whiteSpace: 'pre-wrap' } 
                    }, this.state.error.toString());
                  }
                  return this.props.children;
                }
              }

              window._myReactRoot.render(React.createElement(ErrorBoundary, null, React.createElement(App)));
              
              // Force Tailwind v4 to re-scan by setting a hint in the DOM
              let tailwindTrigger = document.getElementById('tailwind-trigger');
              if (!tailwindTrigger) {
                tailwindTrigger = document.createElement('script');
                tailwindTrigger.id = 'tailwind-trigger';
                tailwindTrigger.type = 'text/tailwindcss';
                document.head.appendChild(tailwindTrigger);
              }
              tailwindTrigger.textContent = files.map(f => f.value).join('\\n');

              const errOverlay = document.getElementById('error-overlay');
              if(errOverlay) errOverlay.remove();
              
            } catch (err) {
              displayError(err);
            }
          });
        </script>
    </body>
    </html>
  `;

  return (
    <div className="w-full h-full bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-white/10 relative flex flex-col">
      <div className="flex-none h-10 border-b border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900/50 flex items-center px-4">
        <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
          Live Preview
        </span>
      </div>
      <div className="flex-1 overflow-hidden relative min-h-0 bg-white dark:bg-neutral-900">
        <iframe
          ref={iframeRef}
          srcDoc={srcDoc}
          className="w-full h-full border-none outline-none block"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
}
