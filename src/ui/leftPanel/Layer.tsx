import { Box, Stack, Typography } from "@mui/material";
import React, { ChangeEvent, useRef, useState } from "react";
import { useDrag, useDrop, DropTargetMonitor } from "react-dnd";
import InfoIcon from "@mui/icons-material/Info";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DeleteIcon from "@mui/icons-material/Delete";
import { XYCoord } from "dnd-core";
import { UiLayer } from "../uiLayer";
import { useAction } from "../actionPanel/ActionContext";
import { ActionConfig } from "../actionPanel/Action";

interface DragItem {
    index: number;
    id: string;
    type: string;
}

export const Layer = ({
    uiLayer,
    activeUiLayer,
    index,
    updateVisibility,
    remove,
    move,
}: {
    uiLayer: UiLayer;
    activeUiLayer: UiLayer | undefined;
    index: number;
    updateVisibility: (uiLayer: UiLayer) => void;
    remove: (uiLayer: UiLayer) => void;
    move: (dragIndex: number, hoverIndex: number) => void;
}): JSX.Element => {
    const ref = useRef<HTMLDivElement>(null);
    const layerId = uiLayer.uid;

    const [displayAction, setDisplayAction] = useState(false);
    const [json, setJson] = useState("");

    const [{ handlerId }, drop] = useDrop({
        accept: "layer",
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        hover(item: DragItem, monitor: DropTargetMonitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) {
                return;
            }
            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY =
                (clientOffset as XYCoord).y - hoverBoundingRect.top;
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }
            move(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: "layer",
        item: () => {
            return { layerId, index };
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const changeVisibility = () => {
        updateVisibility(uiLayer);
    };

    const removeUiLayer = () => {
        remove(uiLayer);
    };

    drag(drop(ref));

    const exportLayerInfo = () => {
        const layerJson = JSON.stringify(uiLayer);
        setJson(layerJson);
        setDisplayAction(true);
    };

    const onClose = () => {
        setDisplayAction(false);
    };

    const updateJson = (event: ChangeEvent<HTMLInputElement>) => {
        setJson(event.target.value);
    };

    const config: ActionConfig = {
        title: "Export",
        onClose: onClose,
        sections: [
            {
                type: "textField",
                title: "Pseudolayer",
                value: json,
                onChange: updateJson,
            },
        ],
    };
    useAction({ newConfig: config, displayAction: displayAction });

    return (
        <Box
            ref={ref}
            data-handler-id={handlerId}
            sx={{
                height: "5%",
                backgroundColor: "green",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                opacity: isDragging ? 0 : 1,
                outline:
                    uiLayer.uid === activeUiLayer?.uid
                        ? "2px solid yellow"
                        : "none",
            }}
        >
            <Stack direction="row">
                <Box>
                    <Typography variant="body1">
                        {uiLayer.config.name}
                    </Typography>
                </Box>
                <Stack direction="row" spacing={1} sx={{ marginLeft: "auto" }}>
                    <InfoIcon onClick={exportLayerInfo} />
                    <DeleteIcon onClick={removeUiLayer} />
                    {uiLayer.visible ? (
                        <VisibilityOffIcon onClick={changeVisibility} />
                    ) : (
                        <RemoveRedEyeIcon onClick={changeVisibility} />
                    )}
                </Stack>
            </Stack>
        </Box>
    );
};