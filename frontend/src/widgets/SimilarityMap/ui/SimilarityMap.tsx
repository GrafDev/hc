import React, { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { Stage, Layer, Line, Circle } from 'react-konva';
import { useColorModeValue } from '@chakra-ui/react';
import { Box, Text, Tooltip } from "@chakra-ui/react";
import { SpotifySong, SongSimilarity, VisualizationSettings } from '../../../entities/song/model/types';
import Konva from "konva";

interface SimilarityMapProps {
    songs: SpotifySong[];
    similarities: SongSimilarity;
    settings: VisualizationSettings;
    onSongSelect: (song: SpotifySong) => void;
}

interface Node {
    x: number;
    y: number;
    radius: number;
    song: SpotifySong;
}

interface Edge {
    source: Node;
    target: Node;
    weight: number;
}

const SimilarityMap: React.FC<SimilarityMapProps> = ({ songs, similarities, settings, onSongSelect }) => {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [tooltipNode, setTooltipNode] = useState<Node | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const stageRef = useRef<Konva.Stage | null>(null);
    const nodePositions = useRef(new Map<string, { x: number, y: number }>());
    const isPanning = useRef(false);
    const lastMousePosition = useRef({ x: 0, y: 0 });
    const colorMode = useColorModeValue('light', 'dark');

    const createNodesAndEdges = useCallback(() => {
        const width = 800;
        const height = 600;

        const newNodes: Node[] = songs.map((song) => {
            const streams = typeof song.Spotify_Streams === 'number' ? song.Spotify_Streams : 0;
            const nodeSizeScale = typeof settings.nodeSizeScale === 'number' ? settings.nodeSizeScale : 1;

            let position = nodePositions.current.get(song.Track);
            if (!position) {
                position = {
                    x: Math.random() * width,
                    y: Math.random() * height
                };
                nodePositions.current.set(song.Track, position);
            }

            return {
                x: position.x,
                y: position.y,
                radius: Math.max(5, 5 + (streams / 1e8) * nodeSizeScale),
                song: song
            };
        });

        const newEdges: Edge[] = [];
        for (let i = 0; i < newNodes.length; i++) {
            const sourceSimilarities = similarities[newNodes[i].song.Track];
            if (!sourceSimilarities) continue;

            Object.entries(sourceSimilarities)
                .filter(([, similarity]) => similarity >= settings.similarityThreshold)
                .sort(([, a], [, b]) => b - a)
                .slice(0, settings.maxConnections)
                .forEach(([targetUrl, similarity]) => {
                    const targetNode = newNodes.find(node => node.song.Track === targetUrl);
                    if (targetNode) {
                        newEdges.push({
                            source: newNodes[i],
                            target: targetNode,
                            weight: similarity * settings.edgeWeightScale
                        });
                    }
                });
        }

        return { nodes: newNodes, edges: newEdges };
    }, [songs, similarities, settings]);

    useEffect(() => {
        const { nodes: newNodes, edges: newEdges } = createNodesAndEdges();
        setNodes(newNodes);
        setEdges(newEdges);
    }, [createNodesAndEdges]);

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            if (stageRef.current) {
                const stage = stageRef.current;
                const oldScale = stage.scaleX();

                const pointerPosition = stage.getPointerPosition();
                if (!pointerPosition) return;

                const mousePointTo = {
                    x: (pointerPosition.x - stage.x()) / oldScale,
                    y: (pointerPosition.y - stage.y()) / oldScale,
                };

                const newScale = e.deltaY < 0 ? oldScale * 1.1 : oldScale / 1.1;

                setScale(newScale);
                setPosition({
                    x: pointerPosition.x - mousePointTo.x * newScale,
                    y: pointerPosition.y - mousePointTo.y * newScale,
                });
            }
        };

        const element = stageRef.current?.container();
        if (element) {
            element.addEventListener('wheel', handleWheel, { passive: false });
        }

        return () => {
            if (element) {
                element.removeEventListener('wheel', handleWheel);
            }
        };
    }, []);

    const handleMouseDownOutside = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.button === 1) {
            isPanning.current = true;
            lastMousePosition.current = { x: e.clientX, y: e.clientY };
        }
    };

    const handleMouseMoveOutside = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isPanning.current) {
            const dx = e.clientX - lastMousePosition.current.x;
            const dy = e.clientY - lastMousePosition.current.y;
            setPosition(prev => ({
                x: prev.x + dx,
                y: prev.y + dy
            }));
            lastMousePosition.current = { x: e.clientX, y: e.clientY };
        }

        // Обработка положения для tooltip
        if (stageRef.current) {
            const stage = stageRef.current;
            const stageRect = stage.container().getBoundingClientRect();
            const mousePos = {
                x: e.clientX - stageRect.left,
                y: e.clientY - stageRect.top
            };

            const hoveredNode = nodes.find(node => {
                const dx = node.x * scale + position.x - mousePos.x;
                const dy = node.y * scale + position.y - mousePos.y;
                return Math.sqrt(dx * dx + dy * dy) <= node.radius * scale;
            });

            setTooltipNode(hoveredNode || null);
            setTooltipPosition({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseUpOutside = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.button === 1) {
            isPanning.current = false;
        }
    };

    const handleNodeClick = (e: Konva.KonvaEventObject<MouseEvent>, node: Node) => {
        console.log("Node clicked:", node);
        e.cancelBubble = true;
        onSongSelect(node.song);
    };

    const minClickRadius = 10;

    const memoizedStage = useMemo(() => (
        <Stage
            width={800}
            height={600}
            ref={stageRef}
            scaleX={scale}
            scaleY={scale}
            x={position.x}
            y={position.y}
        >
            <Layer listening={false}>
                {edges.map((edge, index) => (
                    <Line
                        key={`edge-${index}`}
                        points={[edge.source.x, edge.source.y, edge.target.x, edge.target.y]}
                        stroke={colorMode === "dark" ? "#4299e1" : "#2b6cb0"}
                        strokeWidth={edge.weight / scale}
                    />
                ))}
            </Layer>
            <Layer>
                {nodes.map((node) => (
                    <Circle
                        key={`node-${node.song.Track}`}
                        x={node.x}
                        y={node.y}
                        radius={Math.max(node.radius, minClickRadius / scale)}
                        fill={colorMode === "dark" ? "#48BB78" : "#2F855A"}
                        onClick={(e) => handleNodeClick(e, node)}
                        hitStrokeWidth={10 / scale}
                    />
                ))}
            </Layer>
        </Stage>
    ), [edges, nodes, onSongSelect, scale, position, colorMode]);

    return (
        <Box
            position="relative"
            width="800px"
            height="600px"
            onMouseDown={handleMouseDownOutside}
            onMouseMove={handleMouseMoveOutside}
            onMouseUp={handleMouseUpOutside}
            onMouseLeave={() => { isPanning.current = false; }}
        >
            {memoizedStage}
            <Tooltip
                isOpen={!!tooltipNode}
                label={
                    tooltipNode && (
                        <Text fontSize="md">
                            {`${tooltipNode.song.Track} - ${tooltipNode.song.Artist}`}
                        </Text>
                    )
                }
                placement="top"
                hasArrow
            >
                <Box
                    position="absolute"
                    left={`${tooltipPosition.x}px`}
                    top={`${tooltipPosition.y}px`}
                    width="1px"
                    height="1px"
                />
            </Tooltip>
        </Box>
    );
};

export default React.memo(SimilarityMap);