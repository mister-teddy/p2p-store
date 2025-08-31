import type { AppProps } from "@/types";

function Notepad(props: AppProps) {
  console.log({ props });
  return (
    <div>
      <h1>Notepad</h1>
    </div>
  );
}

export default Notepad;
