import * as React from 'react';
import {Stage, Layer, Circle, Line, Group} from 'react-konva';
import {SpotifySong, SongSimilarity, VisualizationSettings} from '../../../entities/song/model/types';
import {useEffect, useState} from "react";
import {Text} from "@chakra-ui/react";
import {onceLog} from "../../../features/onceLog";

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


const SimilarityMap: React.FC<SimilarityMapProps> = ({songs, similarities, settings, onSongSelect}) => {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    useEffect(() => {
        const width = 800;
        const height = 600;

        // Create nodes
        const newNodes = songs.map((song) => {
            const streams = typeof song.streams === 'number' ? song.streams : 0;
            const nodeSizeScale = typeof settings.nodeSizeScale === 'number' ? settings.nodeSizeScale : 1;

            // Проверка данных
            console.log('streams:', streams, 'nodeSizeScale:', nodeSizeScale);

            const radius = Math.max(5, 5 + (streams / 1e8) * nodeSizeScale);
            console.log('calculated radius:', radius);

            return {
                x: Math.random() * width,
                y: Math.random() * height,
                radius,
                song
            };
        });


        // Create edges
        const newEdges: Edge[] = [];
        for (let i = 0; i < newNodes.length; i++) {
            const sourceSimilarities = similarities[newNodes[i].song.spotify_url];
            if (!sourceSimilarities) continue;

            Object.entries(sourceSimilarities)
                .filter(([, similarity]) => similarity >= settings.similarityThreshold)
                .sort(([, a], [, b]) => b - a)
                .slice(0, settings.maxConnections)
                .forEach(([targetUrl, similarity]) => {
                    const targetNode = newNodes.find(node => node.song.spotify_url === targetUrl);
                    if (targetNode) {
                        newEdges.push({
                            source: newNodes[i],
                            target: targetNode,
                            weight: similarity * settings.edgeWeightScale
                        });
                    }
                });
        }

        setNodes(newNodes);
        setEdges(newEdges);
    }, [songs, similarities, settings]);

    return (
            <Stage width={800} height={600} style={{border: '1px solid black', borderRadius: '5px' }} >
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
                                style={{cursor: 'pointer'}}
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
    );
};

export default SimilarityMap;