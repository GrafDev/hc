import * as React from 'react';
import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { Stage, Layer, Circle, Line, Group } from 'react-konva';
import { SpotifySong, SongSimilarity, VisualizationSettings } from '../../../entities/song/model/types';

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
    const nodePositions = useRef(new Map<string, { x: number, y: number }>());

    const createNodesAndEdges = useCallback(() => {
        const width = 800;
        const height = 600;

        // Create or update nodes
        const newNodes = songs.map((song) => {
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

        // Create edges
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

    const memoizedStage = useMemo(() => (
        <Stage width={800} height={600}>
            <Layer>
                {edges.map((edge, index) => (
                    <Line
                        key={index}
                        points={[edge.source.x, edge.source.y, edge.target.x, edge.target.y]}
                        stroke="black"
                        strokeWidth={edge.weight}
                        opacity={0.5}
                    />
                ))}
                {nodes.map((node, index) => (
                    <Group key={index}>
                        <Circle
                            x={node.x}
                            y={node.y}
                            radius={node.radius}
                            fill="blue"
                            onClick={() => onSongSelect(node.song)}
                        />
                    </Group>
                ))}
            </Layer>
        </Stage>
    ), [edges, nodes, onSongSelect]);

    return memoizedStage;
};

const MemoizedSimilarityMap = React.memo(SimilarityMap);

export default MemoizedSimilarityMap;