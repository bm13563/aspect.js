import React, { useEffect, useRef, useState } from "react";
import { Icon } from "../../components/Icon";
import { UiLayer } from "../../primitives/uiLayer";
import shallow from "zustand/shallow";
import { HorizontalStack } from "../../components/HorizontalStack";
import { PrimaryButton } from "../../components/PrimaryButton";
import { TextField } from "../../components/TextField";
import { VerticalStack } from "../../components/VerticalStack";
import { useToggleActionState } from "../../hooks/useToggleActionState";

export const ExportLayer = ({ uiLayer }: { uiLayer: UiLayer }): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);

  const [displayUi, setDisplayUi] = useState(false);
  const [json, setJson] = useState("");
  const { bindUi, unbindUi } = useToggleActionState(
    (state) => ({
      bindUi: state.bindUi,
      unbindUi: state.unbindUi,
    }),
    shallow
  );

  const exportLayerInfo = () => {
    const layerJson = JSON.stringify(uiLayer);
    setJson(layerJson);
    setDisplayUi(true);
  };

  const copy = () => {
    navigator.clipboard.writeText(json);
    ref.current && ref.current.click();
  };

  const onClose = () => {
    setDisplayUi(false);
    unbindUi();
  };

  const updateJson = (value: string) => {
    setJson(value);
  };

  useEffect(() => {
    displayUi && bindUi(LayerUi());
  }, [displayUi, json]);

  const LayerUi = (): JSX.Element => {
    return (
      <VerticalStack spacing={2}>
        <HorizontalStack className="justify-between mb-1">
          <div className="header1">Export Layer</div>
          <Icon className="i-mdi-close" onClick={onClose} />
        </HorizontalStack>
        <div className="body1">Name</div>
        <div
          ref={ref}
          onClick={(event) => {
            const selection = window && window.getSelection();

            selection !== null &&
              selection.selectAllChildren(event.target as Node);
          }}
        >
          <TextField lines={6} value={json} onChange={updateJson} />
        </div>
        <div className="flex flex-col justify-center items-center children:w-25">
          <PrimaryButton text="Copy" onClick={copy} />
        </div>
      </VerticalStack>
    );
  };

  return (
    <Icon
      className="i-mdi-code-braces text-text-primary"
      onClick={exportLayerInfo}
    />
  );
};
