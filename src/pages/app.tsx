import AppRenderer from "@/components/app-renderer";
import { appByIdAtom } from "@/state/app-ecosystem";
import { useAtomValue } from "jotai";
import { useNavigate, useParams } from "react-router-dom";
import NotFound from "./404";
import { useEffect, useState } from "react";
import AppInstallPage from "@/components/app-install-page";

function AppPage(props: { install?: boolean }) {
  const { id } = useParams();
  const app = useAtomValue(appByIdAtom(id!));
  const [pwaInstallPrompt, setPwaInstallPrompt] = useState<
    | (Event & {
        prompt: () => void;
      })
    | undefined
  >();
  const navigate = useNavigate();

  useEffect(() => {
    if (app && props.install) {
      const oldTitle = document.title;
      document.title = app?.name;
      // Add manifest link dynamically, for some reason React Helmet doesn't work
      const manifestLink = document.createElement("link");
      manifestLink.rel = "manifest";
      manifestLink.href = `/apps/${id}/manifest.json`;
      document.head.appendChild(manifestLink);

      // Handler for beforeinstallprompt
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setPwaInstallPrompt(e as typeof pwaInstallPrompt);
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

      // Cleanup
      return () => {
        document.title = oldTitle;
        document.head.removeChild(manifestLink);
        window.removeEventListener(
          "beforeinstallprompt",
          handleBeforeInstallPrompt
        );
      };
    }
  }, [app, props.install, id]);

  if (!app) {
    return <NotFound />;
  }

  if (pwaInstallPrompt && props.install) {
    return (
      <AppInstallPage
        app={app}
        onInstall={() => {
          pwaInstallPrompt?.prompt();
          navigate(`/apps/${app.id}`);
        }}
      />
    );
  }

  return <AppRenderer app={app} />;
}

export default AppPage;
