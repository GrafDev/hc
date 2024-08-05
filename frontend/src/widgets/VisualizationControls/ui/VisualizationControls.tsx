import * as React from 'react';
import {VisualizationSettings} from '../../../entities/song/model/types';
import {
    Heading,
    VStack,
    FormControl,
    FormLabel,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Text,  Flex,
} from "@chakra-ui/react";

interface VisualizationControlsProps {
    settings: VisualizationSettings;
    onSettingsChange: (newSettings: Partial<VisualizationSettings>) => void;
}

const VisualizationControls: React.FC<VisualizationControlsProps> = ({settings, onSettingsChange}) => {
    const handleChange = (name: string) => (value: number) => {
        onSettingsChange({[name]: value});
    };

    return (
        <VStack spacing={4} w="100%">

            <Flex justifyContent={"center"}  w={"100%"} >
                <Heading size={["md", "lg"]}>
                Visualization Settings
                </Heading>
            </Flex>
            <FormControl px={4}>
                <Flex justifyContent={"space-between"} px={2}>
                <FormLabel htmlFor="similarityThreshold">Similarity Threshold</FormLabel>
                    <Text fontWeight={"bold"}>{settings.similarityThreshold.toFixed(2)}</Text>
                </Flex>
                <Slider
                    id="similarityThreshold"
                    min={0}
                    max={1}
                    step={0.01}
                    value={settings.similarityThreshold}
                    onChange={handleChange('similarityThreshold')}
                >
                    <SliderTrack>
                        <SliderFilledTrack/>
                    </SliderTrack>
                    <SliderThumb/>
                </Slider>

            </FormControl>
            <FormControl px={4}>
                <Flex justifyContent={"space-between"} px={2}>
                    <FormLabel htmlFor="maxConnections">Max Connections</FormLabel>
                    <Text fontWeight={"bold"}>{settings.maxConnections}</Text>
                </Flex>
                <Slider
                    id="maxConnections"
                    min={0}
                    max={100}
                    step={1}
                    value={settings.maxConnections}
                    onChange={handleChange('maxConnections')}
                >
                    <SliderTrack>
                        <SliderFilledTrack/>
                    </SliderTrack>
                    <SliderThumb/>
                </Slider>

            </FormControl>
            <FormControl px={4}>
                <Flex justifyContent={"space-between"} px={2}>
                    <FormLabel htmlFor="nodeSizeScale">Node Size Scale</FormLabel>
                    <Text fontWeight={"bold"}>{settings.nodeSizeScale.toFixed(1)}</Text>
                </Flex>
                <Slider
                    id="nodeSizeScale"
                    min={0.1}
                    max={2}
                    step={0.1}
                    value={settings.nodeSizeScale}
                    onChange={handleChange('nodeSizeScale')}
                >
                    <SliderTrack>
                        <SliderFilledTrack/>
                    </SliderTrack>
                    <SliderThumb/>
                </Slider>

            </FormControl>
            <FormControl px={4}>
                <Flex justifyContent={"space-between"} px={2}>
                    <FormLabel htmlFor="edgeWeightScale">Edge Weight Scale</FormLabel>
                    <Text fontWeight={"bold"}>{settings.edgeWeightScale.toFixed(1)}</Text>
                </Flex>
                <Slider
                    id="edgeWeightScale"
                    min={0.1}
                    max={2}
                    step={0.1}
                    value={settings.edgeWeightScale}
                    onChange={handleChange('edgeWeightScale')}
                >
                    <SliderTrack>
                        <SliderFilledTrack/>
                    </SliderTrack>
                    <SliderThumb/>
                </Slider>

            </FormControl>
        </VStack>
    );
};

export default VisualizationControls;