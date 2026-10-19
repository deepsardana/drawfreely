import { loginIcon } from "@excalidraw/excalidraw/components/icons";
import { POINTER_EVENTS } from "@excalidraw/common";
import { useI18n } from "@excalidraw/excalidraw/i18n";
import { WelcomeScreen } from "@excalidraw/excalidraw/index";
import React from "react";

import { isExcalidrawPlusSignedUser } from "../app_constants";

export const AppWelcomeScreen: React.FC<{
  onCollabDialogOpen: () => any;
  isCollabEnabled: boolean;
}> = React.memo((props) => {
  const { t } = useI18n();
  const headingContent = (
    <div style={{ textAlign: "center", maxWidth: 520, margin: "0 auto" }}>
      <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.4rem", letterSpacing: "-0.025em" }}>
        Enterprise Architecture &amp; System Diagrams
      </h2>
      <p style={{ fontSize: "0.95rem", color: "#64748b", lineHeight: 1.5, margin: "0 0 0.8rem 0" }}>
        Production cloud architectures, Kubernetes topologies, network flowcharts, and technical specifications with 525+ official vector components.
      </p>
      <div style={{ display: "inline-flex", gap: "0.5rem", alignItems: "center", padding: "4px 12px", background: "#f1f5f9", borderRadius: "9999px", fontSize: "0.8rem", color: "#475569", fontWeight: 600 }}>
        <span>⚡ Precision Architectural Engine</span>
        <span>•</span>
        <span>525+ Official Cloud Symbols</span>
        <span>•</span>
        <span>Figma Design Tokens</span>
      </div>
    </div>
  );

  return (
    <WelcomeScreen>
      <WelcomeScreen.Hints.MenuHint>
        {t("welcomeScreen.app.menuHint")}
      </WelcomeScreen.Hints.MenuHint>
      <WelcomeScreen.Hints.ToolbarHint />
      <WelcomeScreen.Hints.HelpHint />
      <WelcomeScreen.Center>
        <WelcomeScreen.Center.Logo />
        <WelcomeScreen.Center.Heading>
          {headingContent}
        </WelcomeScreen.Center.Heading>
        <WelcomeScreen.Center.Menu>
          <WelcomeScreen.Center.MenuItemLoadScene />
          <WelcomeScreen.Center.MenuItemHelp />
          {props.isCollabEnabled && (
            <WelcomeScreen.Center.MenuItemLiveCollaborationTrigger
              onSelect={() => props.onCollabDialogOpen()}
            />
          )}
        </WelcomeScreen.Center.Menu>
      </WelcomeScreen.Center>
    </WelcomeScreen>
  );
});
