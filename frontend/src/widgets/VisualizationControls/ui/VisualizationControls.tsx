import * as React from 'react';
import { VisualizationSettings } from '../../../entities/song/model/types';

import {Heading, VStack} from "@chakra-ui/react";

interface VisualizationControlsProps {
    settings: VisualizationSettings;
    onSettingsChange: (newSettings: Partial<VisualizationSettings>) => void;
}

const VisualizationControls: React.FC<VisualizationControlsProps> = ({ settings, onSettingsChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onSettingsChange({ [name]: parseFloat(value) });
    };

    return (
        <VStack className="visualization-controls" align={"start"} w={"100%"}>
            <Heading>Visualization Settings</Heading>
            <div>
                <label htmlFor="similarityThreshold">Similarity Threshold:</label>
                <input
                    type="range"
                    id="similarityThreshold"
                    name="similarityThreshold"
                    min="0"
                    max="1"
                    step="0.01"
                    value={settings.similarityThreshold}
                    onChange={handleChange}
                />
                <span>{settings.similarityThreshold.toFixed(2)}</span>
            </div>
            <div>
                <label htmlFor="maxConnections">Max Connections:</label>
                <input
                    type="number"
                    id="maxConnections"
                    name="maxConnections"
                    min="1"
                    max="100"
                    value={settings.maxConnections}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="nodeSizeScale">Node Size Scale:</label>
                <input
                    type="range"
                    id="nodeSizeScale"
                    name="nodeSizeScale"
                    min="0.1"
                    max="2"
                    step="0.1"
                    value={settings.nodeSizeScale}
                    onChange={handleChange}
                />
                <span>{settings.nodeSizeScale.toFixed(1)}</span>
            </div>
            <div>
                <label htmlFor="edgeWeightScale">Edge Weight Scale:</label>
                <input
                    type="range"
                    id="edgeWeightScale"
                    name="edgeWeightScale"
                    min="0.1"
                    max="2"
                    step="0.1"
                    value={settings.edgeWeightScale}
                    onChange={handleChange}
                />
                <span>{settings.edgeWeightScale.toFixed(1)}</span>
            </div>
        </VStack>
    );
};

export default VisualizationControls;