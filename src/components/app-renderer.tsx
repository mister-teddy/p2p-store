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
import { useNavigate } from "react-router-dom";
import CloseIcon from "./icons/close";

interface AppRendererProps {
  app: Selectable<AppTable>;
}

const AppRenderer: FunctionComponent<AppRendererProps> = ({ app }) => {
  const navigate = useNavigate();

  return createPortal(
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <Suspense fallback={<Spinner />}>
        {createElement(
          lazy(() =>
            import.meta.env.DEV
              ? import(`../apps/${app.id}`)
              : import(`/apps/${app.id}.js`)
          ),
          {
            app,
            db,
            React,
          }
        )}
      </Suspense>
      <button
        onClick={() => {
          navigate(-1);
        }}
        className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
      >
        <CloseIcon />
      </button>
    </div>,
    document.body
  );
};

export default AppRenderer;
