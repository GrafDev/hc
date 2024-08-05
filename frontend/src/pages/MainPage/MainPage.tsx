import { useState } from 'react';
import * as React from 'react';
import { SpotifySong, VisualizationSettings } from '../../entities/song/model/types';
import {
    Card,
    Flex,
    Heading,
    Modal, ModalBody, ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    VStack
} from "@chakra-ui/react";
import { useData } from "../../app/providers/DataProvider";
import SimilarityMap from "../../widgets/SimilarityMap/ui/SimilarityMap";
import VisualizationControls from "../../widgets/VisualizationControls/ui/VisualizationControls";
import SongInfo from "../../widgets/SongInfo/ui/SongInfo";

const MainPage: React.FC = () => {
    const { songs, similarities, loading, error } = useData();
    const [selectedSong, setSelectedSong] = useState<SpotifySong | null>(null);
    const [visualizationSettings, setVisualizationSettings] = useState<VisualizationSettings>({
        similarityThreshold: 0.7,
        maxConnections: 50,
        nodeSizeScale: 1,
        edgeWeightScale: 1,
    });
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleSongSelect = (song: SpotifySong) => {
        // console.log(song)
        onOpen();
        setSelectedSong(song);
    };
    const handleClose = () => {
        onClose();
    };

    const handleSettingsChange = (newSettings: Partial<VisualizationSettings>) => {
        setVisualizationSettings(prevSettings => ({ ...prevSettings, ...newSettings }));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Flex direction={"row"} justifyContent={"center"} w={"100%"} h={"100%"} >
            <Flex className="main-page" direction={"column"} alignItems={"center"} gap={4}>
                <Heading >Spotify Song Similarity Analysis</Heading>
                <VStack className="content">
                    <Card className="visualization-container" p={2} gap={4}>
                        <SimilarityMap
                            songs={songs}
                            similarities={similarities!}
                            settings={visualizationSettings}
                            onSongSelect={handleSongSelect}
                        />
                        <VisualizationControls
                            settings={visualizationSettings}
                            onSettingsChange={handleSettingsChange}
                        />
                    </Card>
                    <Modal isOpen={isOpen} onClose={handleClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Song Information</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                {selectedSong ? (
                                    <SongInfo
                                        song={selectedSong}
                                        similarSongs={similarities ? similarities[selectedSong.Track] : {}}
                                    />
                                ) : (
                                    <div>No song selected</div>
                                )}
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                </VStack>
            </Flex>
        </Flex>
    );
};

export default MainPage;
