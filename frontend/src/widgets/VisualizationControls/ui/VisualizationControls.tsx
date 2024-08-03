import * as React from 'react';
import { VisualizationSettings } from '../../../entities/song/model/types';

import {Box, Heading, Slider,Text, SliderFilledTrack, SliderThumb, SliderTrack, VStack} from "@chakra-ui/react";

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

            {/* Similarity Threshold */}
            <Box w={"100%"}>
                <Text>Similarity Threshold:</Text>
                <Slider
                    aria-label='similarityThreshold'
                    defaultValue={settings.similarityThreshold}
                    min={0}
                    max={1}
                    step={0.01}
                    onChange={(value) => handleChange('similarityThreshold', value)}
                >
                    <SliderTrack>
                        <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                </Slider>
                <Text>{settings.similarityThreshold.toFixed(2)}</Text>
            </Box>

            {/* Max Connections */}
            <Box>
                <Text>Max Connections:</Text>
                <Slider
                    aria-label='maxConnections'
                    defaultValue={settings.maxConnections}
                    min={0}
                    max={100}
                    step={1}
                    onChange={(value) => handleChange('maxConnections', value)}
                >
                    <SliderTrack>
                        <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                </Slider>
                <Text>{settings.maxConnections.toFixed(2)}</Text>
            </Box>

            {/* Node Size Scale */}
            <Box>
                <Text>Node Size Scale:</Text>
                <Slider
                    aria-label='nodeSizeScale'
                    defaultValue={settings.nodeSizeScale}
                    min={0.1}
                    max={2}
                    step={0.1}
                    onChange={(value) => handleChange('nodeSizeScale', value)}
                >
                    <SliderTrack>
                        <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                </Slider>
                <Text>{settings.nodeSizeScale.toFixed(1)}</Text>
            </Box>

            {/* Edge Weight Scale */}
            <Box>
                <Text>Edge Weight Scale:</Text>
                <Slider
                    aria-label='edgeWeightScale'
                    defaultValue={settings.edgeWeightScale}
                    min={0.1}
                    max={2}
                    step={0.1}
                    onChange={(value) => handleChange('edgeWeightScale', value)}
                >
                    <SliderTrack>
                        <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                </Slider>
                <Text>{settings.edgeWeightScale.toFixed(1)}</Text>
            </Box>
        </VStack>
    );
};

export default VisualizationControls;