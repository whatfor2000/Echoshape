declare module "react-load-script" {
  import * as React from "react";

  export interface ScriptProps {
    url: string;
    onLoad?: () => void;
    onError?: (event: any) => void;
    onCreate?: () => void;
  }

  const Script: React.FC<ScriptProps>;
  export default Script;
}
