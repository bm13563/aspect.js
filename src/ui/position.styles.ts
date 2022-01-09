import styled from "styled-components";
import { Map } from "./map/Map";
import { Canvas } from "./map/Canvas";
import { MapLayer } from "./map/MapLayer";

export const PositionedMap = styled(Map)`
    position: relative;
    top: 0px;
    height: 100%;
    width: 100%;
    margin: 0px;
    z-index: 1;
`;

export const PositionedMapLayer = styled(MapLayer)`
    position: absolute;
    height: 100%;
    width: 100%;
    opacity: 0;
`;

export const PositionedCanvas = styled(Canvas)`
    position: relative;
    top: 0px;
    height: 100%;
    width: 100%;
    margin: 0px;
    margin-left: -100%;
    z-index: 0;
`;
