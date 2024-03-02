const REACT_REFRESH_SCRIPT = `
import RefreshRuntime from 'http://localhost:3000/@react-refresh';
RefreshRuntime.injectIntoGlobalHook(window);
window.$RefreshReg$ = () => {};
window.$RefreshSig$ = () => (type) => type;
window.__vite_plugin_react_preamble_installed__ = true;
`.replace(/\n/g, "");

export const ServerEntry = () => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vono + TRPC + Tanstack router</title>
        {import.meta.env.DEV && (
          <>
            <script type="module" src="/@vite/client"></script>
            <script
              type="module"
              dangerouslySetInnerHTML={{ __html: REACT_REFRESH_SCRIPT }}
            ></script>
          </>
        )}
      </head>
      <body>
        <div id="root"></div>
        <script type="module" src="/client/src/client-entry.tsx" />
      </body>
    </html>
  );
};
