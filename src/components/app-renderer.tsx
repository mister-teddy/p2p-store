import type { AppTable } from "@/types";
import type { Selectable } from "kysely";
import {
  createElement,
  lazy,
  Suspense,
  useState,
  type FunctionComponent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import CloseIcon from "./icons/close";
import db from "@/libs/db";
import Spinner from "./spinner";

interface AppRendererProps {
  app: Selectable<AppTable>;
  children: (renderProps: { onClick: () => void }) => ReactNode;
}

const AppRenderer: FunctionComponent<AppRendererProps> = ({
  app,
  children,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      {children({
        onClick: () => {
          if (app.price === 0) {
            setVisible(true);
          } else {
            alert("Payment with Lightning Network is to be implemented");
          }
        },
      })}
      {visible &&
        createPortal(
          <div className="fixed inset-0 bg-white z-50 flex flex-col">
            <Suspense fallback={<Spinner />}>
              {createElement(
                lazy(() => import(`../../apps/notepad`)),
                {
                  app,
                  db,
                }
              )}
            </Suspense>
            <button
              onClick={() => {
                setVisible(false);
              }}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
            >
              <CloseIcon />
            </button>
          </div>,
          document.body
        )}
    </>
  );
};

export default AppRenderer;
