import React, { useState } from 'react';
import { Excalidraw, MainMenu, WelcomeScreen } from '@excalidraw/excalidraw';
import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types';

export default function App() {
  const [, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);

  // Auto-load canvas data from localStorage
  const [initialData] = useState(() => {
    try {
      const saved = localStorage.getItem('excalidraw-canvas-data');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved canvas data:', e);
    }
    return null;
  });

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0 }}>
      <Excalidraw
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        initialData={initialData}
        onChange={(elements, appState) => {
          try {
            // Save state to local storage
            localStorage.setItem(
              'excalidraw-canvas-data',
              JSON.stringify({
                elements,
                appState: {
                  viewBackgroundColor: appState.viewBackgroundColor,
                  theme: appState.theme,
                },
              })
            );
          } catch (e) {
            // Ignore storage quota errors
          }
        }}
      >
        <MainMenu>
          <MainMenu.DefaultItems.LoadScene />
          <MainMenu.DefaultItems.SaveToActiveFile />
          <MainMenu.DefaultItems.Export />
          <MainMenu.DefaultItems.SaveAsImage />
          <MainMenu.DefaultItems.ClearCanvas />
          <MainMenu.Separator />
          <MainMenu.DefaultItems.ToggleTheme />
          <MainMenu.DefaultItems.ChangeCanvasBackground />
        </MainMenu>

        <WelcomeScreen>
          <WelcomeScreen.Hints.MenuHint />
          <WelcomeScreen.Hints.ToolbarHint />
          <WelcomeScreen.Hints.HelpHint />
          <WelcomeScreen.Center>
            <WelcomeScreen.Center.Logo />
            <WelcomeScreen.Center.Heading>
              Hand-drawn look & feel • Virtual Whiteboard
            </WelcomeScreen.Center.Heading>
            <WelcomeScreen.Center.Menu>
              <WelcomeScreen.Center.MenuItemLoadScene />
              <WelcomeScreen.Center.MenuItemHelp />
            </WelcomeScreen.Center.Menu>
          </WelcomeScreen.Center>
        </WelcomeScreen>
      </Excalidraw>
    </div>
  );
}
