import type { AppTable } from "@/types";
import type { Selectable } from "kysely";
import { type FunctionComponent, type ReactNode } from "react";

interface AppEntryProps {
  app: Selectable<AppTable>;
  children: (renderProps: { onClick: () => void }) => ReactNode;
}

const AppEntry: FunctionComponent<AppEntryProps> = ({ app, children }) => {
  // const navigate = useNavigate();

  return children({
    onClick: () => {
      if (app.price === 0) {
        window.open(`/apps/install/${app.id}`, "_blank", "noopener,noreferrer");
        // navigate(`/apps/install/${app.id}`);
      } else {
        alert("Payment with Lightning Network is to be implemented");
      }
    },
  });
};

export default AppEntry;
