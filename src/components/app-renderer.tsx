import type { AppTable } from "@/types";
import type { Selectable } from "kysely";
import React, {
  createElement,
  lazy,
  Suspense,
  type ComponentType,
  type FunctionComponent,
} from "react";
import { createPortal } from "react-dom";
import db from "@/libs/db";
import Spinner from "./spinner";
import { useNavigate } from "react-router-dom";
import CloseIcon from "./icons/close";
import { windowsStatesAtom, adaptiveIs3DModeAtom } from "@/state/3d";
import { useSetAtom, useAtomValue } from "jotai";

interface AppRendererProps {
  app: Selectable<AppTable>;
  component?: ComponentType;
}

const CloseButton2D = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => {
        navigate(-1);
      }}
      className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
    >
      <CloseIcon />
    </button>
  );
};

const CloseButton3D = () => {
  const setWindows = useSetAtom(windowsStatesAtom);
  return (
    <button
      onClick={() => {
        setWindows((prev) => prev.slice(0, -1));
      }}
      className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
    >
      <CloseIcon />
    </button>
  );
};

const CloseButton = () => {
  const is3D = useAtomValue(adaptiveIs3DModeAtom);
  return is3D ? <CloseButton3D /> : <CloseButton2D />;
};

const AppRenderer: FunctionComponent<AppRendererProps> = ({
  app,
  component,
}) => {
  return createPortal(
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <Suspense fallback={<Spinner />}>
        {component
          ? createElement(component)
          : createElement(
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
      <CloseButton />
    </div>,
    document.body
  );
};

export default AppRenderer;
