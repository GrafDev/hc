import React, { useRef, useEffect } from 'react';
import * as PIXI from 'pixi.js';
import { SpotifySong, SongSimilarity, VisualizationSettings } from '../../../entities/song/model/types';

interface SimilarityMapProps {
    songs: SpotifySong[];
    similarities: SongSimilarity;
    settings: VisualizationSettings;
    onSongSelect: (song: SpotifySong) => void;
}

interface SongNode extends PIXI.Graphics {
    song: SpotifySong;
}

const SimilarityMap: React.FC<SimilarityMapProps> = ({ songs, similarities, settings, onSongSelect }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!songs.length || !canvasRef.current) return;

        const app = new PIXI.Application({
            width: 800,
            height: 600,
            backgroundColor: 0xffffff,
            view: canvasRef.current
        });

        const container = new PIXI.Container();
        app.stage.addChild(container);

        const nodeMap = new Map<string, SongNode>();

        songs.forEach((song: SpotifySong) => {
            const circle = new PIXI.Graphics() as SongNode;
            circle.song = song;
            circle.beginFill(0x0000ff);
            circle.drawCircle(0, 0, Math.sqrt(song.Pandora_Streams || 0) * 0.01);
            circle.endFill();
            circle.x = Math.random() * app.screen.width;
            circle.y = Math.random() * app.screen.height;
            circle.eventMode = 'static';
            circle.cursor = 'pointer';
            circle.on('pointerdown', () => onSongSelect(song));
            container.addChild(circle);
            nodeMap.set(song.Track, circle);
        });

        songs.forEach(song => {
            const sourceNode = nodeMap.get(song.Track);
            if (!sourceNode) return;

            const similarSongs = similarities[song.Track];
            if (similarSongs) {
                Object.entries(similarSongs)
                    .filter(([, strength]) => strength >= settings.similarityThreshold)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, settings.maxConnections)
                    .forEach(([targetTrack, strength]) => {
                        const targetNode = nodeMap.get(targetTrack);
                        if (targetNode) {
                            const line = new PIXI.Graphics();
                            line.lineStyle(strength * settings.edgeWeightScale, 0x999999, 0.6);
                            line.moveTo(sourceNode.x, sourceNode.y);
                            line.lineTo(targetNode.x, targetNode.y);
                            container.addChild(line);
                        }
                    });
            }
        });

        // Добавляем простую анимацию
        app.ticker.add(() => {
            nodeMap.forEach(node => {
                node.x += (Math.random() - 0.5) * 0.5;
                node.y += (Math.random() - 0.5) * 0.5;
            });
        });

        return () => {
            app.destroy(true, { children: true, texture: true });
        };
    }, [songs, similarities, settings, onSongSelect]);

    return <canvas ref={canvasRef}></canvas>;
};

export default SimilarityMap;