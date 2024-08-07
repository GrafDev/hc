import React, { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { Stage, Layer, Line, Circle, Group } from 'react-konva';
import { useColorModeValue } from '@chakra-ui/react';
import { Box, Text, Tooltip } from "@chakra-ui/react";
import { SpotifySong, SongSimilarity, VisualizationSettings } from '../../../entities/song/model/types';
import Konva from "konva";
import computeConvexHull from "../../../features/compute-convex-hull.ts";

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

interface Cluster {
    id: number;
    centroid: { x: number; y: number };
    nodes: Node[];
}

const SimilarityMap: React.FC<SimilarityMapProps> = ({ songs, similarities, settings, onSongSelect }) => {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [clusters, setClusters] = useState<Cluster[]>([]);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [tooltipNode, setTooltipNode] = useState<Node | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const stageRef = useRef<Konva.Stage | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const nodePositions = useRef(new Map<string, { x: number, y: number }>());
    const isPanning = useRef(false);
    const lastPointerPosition = useRef({ x: 0, y: 0 });

    const colorMode = useColorModeValue('light', 'dark');
    const clusterColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];

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

    const kMeansClustering = useCallback((nodes: Node[], k: number, maxIterations: number = 100): Cluster[] => {
        let centroids: Cluster[] = nodes.slice(0, k).map((node, index) => ({
            id: index,
            centroid: { x: node.x, y: node.y },
            nodes: []
        }));

        for (let i = 0; i < maxIterations; i++) {
            centroids.forEach(cluster => cluster.nodes = []);

            nodes.forEach(node => {
                const closestCentroid = centroids.reduce((closest, cluster) => {
                    const distance = Math.hypot(cluster.centroid.x - node.x, cluster.centroid.y - node.y);
                    return distance < closest.distance ? { cluster, distance } : closest;
                }, { cluster: centroids[0], distance: Infinity });

                closestCentroid.cluster.nodes.push(node);
            });

            const newCentroids = centroids.map(cluster => ({
                ...cluster,
                centroid: {
                    x: cluster.nodes.reduce((sum, node: Node) => sum + node.x, 0) / cluster.nodes.length,
                    y: cluster.nodes.reduce((sum, node: Node) => sum + node.y, 0) / cluster.nodes.length
                }
            }));

            if (JSON.stringify(newCentroids) === JSON.stringify(centroids)) {
                break;
            }

            centroids = newCentroids;
        }

        return centroids;
    }, []);

    useEffect(() => {
        const { nodes: newNodes, edges: newEdges } = createNodesAndEdges();
        setNodes(newNodes);
        setEdges(newEdges);
        const newClusters = kMeansClustering(newNodes, 5);
        setClusters(newClusters);
    }, [createNodesAndEdges, kMeansClustering]);

    const handleWheel = useCallback((e: WheelEvent) => {
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
    }, []);

    useEffect(() => {
        const element = containerRef.current;
        if (element) {
            element.addEventListener('wheel', handleWheel, { passive: false });
        }
        return () => {
            if (element) {
                element.removeEventListener('wheel', handleWheel);
            }
        };
    }, [handleWheel]);

    const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (e.button === 0 || e.button === 1) {
            isPanning.current = true;
            lastPointerPosition.current = { x: e.clientX, y: e.clientY };
        }
    }, []);

    const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (isPanning.current) {
            const dx = e.clientX - lastPointerPosition.current.x;
            const dy = e.clientY - lastPointerPosition.current.y;
            setPosition(prev => ({
                x: prev.x + dx,
                y: prev.y + dy
            }));
            lastPointerPosition.current = { x: e.clientX, y: e.clientY };
        }

        if (stageRef.current && containerRef.current) {
            const container = containerRef.current;
            const containerRect = container.getBoundingClientRect();
            const pointerPos = {
                x: (e.clientX - containerRect.left - position.x) / scale,
                y: (e.clientY - containerRect.top - position.y) / scale
            };

            const hoveredNode = nodes.find(node => {
                const dx = node.x - pointerPos.x;
                const dy = node.y - pointerPos.y;
                return Math.hypot(dx, dy) <= node.radius;
            });

            setTooltipNode(hoveredNode || null);
            setTooltipVisible(!!hoveredNode);
            setTooltipPosition({
                x: e.clientX - containerRect.left,
                y: e.clientY - containerRect.top
            });
        }
    }, [nodes, scale, position]);

    const handlePointerUp = useCallback(() => {
        isPanning.current = false;
    }, []);

    const handleNodeInteraction = useCallback((node: Node) => {
        onSongSelect(node.song);
        setTooltipVisible(false);
    }, [onSongSelect]);

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
                        key={`edge-${index}-${edge.source.song.ISRC}-${edge.target.song.ISRC}`}
                        points={[edge.source.x, edge.source.y, edge.target.x, edge.target.y]}
                        stroke={colorMode === "dark" ? "#4299e1" : "#2b6cb0"}
                        strokeWidth={edge.weight / scale}
                        opacity={0.5}
                    />
                ))}
            </Layer>
            <Layer>
                {clusters.map((cluster, clusterIndex) => {
                    const hullPoints = computeConvexHull(cluster.nodes.map(node => ({x: node.x, y: node.y})));
                    return (
                        <Group key={`cluster-${cluster.id}`}>
                            <Line
                                points={hullPoints.flatMap(p => [p.x, p.y])}
                                closed={true}
                                fill={clusterColors[clusterIndex % clusterColors.length]}
                                opacity={0.2}
                            />
                            {cluster.nodes.map((node) => (
                                <Circle
                                    key={`node-${cluster.id}-${node.song.ISRC}`}
                                    x={node.x}
                                    y={node.y}
                                    radius={Math.max(node.radius, minClickRadius / scale)}
                                    fill={clusterColors[clusterIndex % clusterColors.length]}
                                    stroke={colorMode === "dark" ? "#48BB78" : "#2F855A"}
                                    strokeWidth={2 / scale}
                                    onClick={() => handleNodeInteraction(node)}
                                    onTap={() => handleNodeInteraction(node)}
                                    hitStrokeWidth={10 / scale}
                                />
                            ))}
                        </Group>
                    );
                })}
            </Layer>
        </Stage>
    ), [edges, clusters, handleNodeInteraction, scale, position, colorMode, minClickRadius, clusterColors]);

    return (
        <Box
            ref={containerRef}
            position="relative"
            width="800px"
            height="600px"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            style={{ touchAction: 'none' }}
        >
            {memoizedStage}
            <Tooltip
                isOpen={!!tooltipNode && tooltipVisible}
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
                    pointerEvents="none"
                />
            </Tooltip>
        </Box>
    );
};

export default React.memo(SimilarityMap);