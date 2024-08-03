import * as React from 'react';
import { VisualizationSettings } from '../../../entities/song/model/types';
import {
    Heading,
    VStack,
    FormControl,
    FormLabel,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Text,
    Box
} from "@chakra-ui/react";

interface VisualizationControlsProps {
    settings: VisualizationSettings;
    onSettingsChange: (newSettings: Partial<VisualizationSettings>) => void;
}

const VisualizationControls: React.FC<VisualizationControlsProps> = ({ settings, onSettingsChange }) => {
    const handleChange = (name: string) => (value: number) => {
        onSettingsChange({ [name]: value });
    };

    return (
        <VStack spacing={4} align="stretch" w="100%">
            <Heading size="md">Visualization Settings</Heading>
            <FormControl>
                <FormLabel htmlFor="similarityThreshold">Similarity Threshold</FormLabel>
                <Slider
                    id="similarityThreshold"
                    min={0}
                    max={1}
                    step={0.01}
                    value={settings.similarityThreshold}
                    onChange={handleChange('similarityThreshold')}
                >
                    <SliderTrack>
                        <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                </Slider>
                <Text mt={2}>{settings.similarityThreshold.toFixed(2)}</Text>
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="maxConnections">Max Connections</FormLabel>
                <Slider
                    id="maxConnections"
                    min={0}
                    max={100}
                    step={1}
                    value={settings.maxConnections}
                    onChange={handleChange('maxConnections')}
                >
                    <SliderTrack>
                        <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                </Slider>
                <Text mt={2}>{settings.maxConnections}</Text>
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="nodeSizeScale">Node Size Scale</FormLabel>
                <Slider
                    id="nodeSizeScale"
                    min={0.1}
                    max={2}
                    step={0.1}
                    value={settings.nodeSizeScale}
                    onChange={handleChange('nodeSizeScale')}
                >
                    <SliderTrack>
                        <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                </Slider>
                <Text mt={2}>{settings.nodeSizeScale.toFixed(1)}</Text>
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="edgeWeightScale">Edge Weight Scale</FormLabel>
                <Slider
                    id="edgeWeightScale"
                    min={0.1}
                    max={2}
                    step={0.1}
                    value={settings.edgeWeightScale}
                    onChange={handleChange('edgeWeightScale')}
                >
                    <SliderTrack >
                        <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                </Slider>
                <Text mt={2}>{settings.edgeWeightScale.toFixed(1)}</Text>
            </FormControl>
        </VStack>
    );
};

export default VisualizationControls;