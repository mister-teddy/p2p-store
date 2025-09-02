import type { AppTable } from "@/types";
import type { Selectable } from "kysely";
import React, {
  createElement,
  lazy,
  Suspense,
  type FunctionComponent,
} from "react";
import { createPortal } from "react-dom";
import db from "@/libs/db";
import Spinner from "./spinner";

interface AppRendererProps {
  app: Selectable<AppTable>;
}

const AppRenderer: FunctionComponent<AppRendererProps> = ({ app }) => {
  return createPortal(
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <Suspense fallback={<Spinner />}>
        {createElement(
          lazy(() => import(`../apps/${app.id}`)),
          {
            app,
            db,
            React,
          }
        )}
      </Suspense>
    </div>,
    document.body
  );
};

export default AppRenderer;
