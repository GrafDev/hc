import { useState } from 'react';
import * as React from 'react';
import { SpotifySong, VisualizationSettings } from '../../entities/song/model/types';

import {
    Button,
    Card,
    Flex, FormControl, FormLabel, Heading,
    HStack,
    Modal, ModalBody, ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Switch, Text, useBreakpointValue, useColorMode,
    useDisclosure,
    VStack
} from "@chakra-ui/react";
import { useData } from "../../app/providers/DataProvider";
import VisualizationControls from "../../widgets/VisualizationControls/ui/VisualizationControls";
import SongInfo from "../../widgets/SongInfo/ui/SongInfo";
import MemoizedSimilarityMap from "../../widgets/SimilarityMap/ui/SimilarityMap";




const MainPage: React.FC = () => {
    const { songs,_quantity, similarities, loading, error } = useData();
    const [selectedSong, setSelectedSong] = useState<SpotifySong | null>(null);
    const {colorMode, toggleColorMode} = useColorMode();
    const isMobile = useBreakpointValue({ base: true, xl: false });
    const [visualizationSettings, setVisualizationSettings] = useState<VisualizationSettings>({
        similarityThreshold: 0.50,
        maxConnections: 15,
        nodeSizeScale: 0.4,
        edgeWeightScale: 0.4,
    });
    const [songCount, setSongCount] = useState(Math.round(_quantity / 2));
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleSongSelect = (song: SpotifySong) => {
        onOpen();
        setSelectedSong(song);
    };

    const handleClose = () => {
        onClose();
    };

    const handleSettingsChange = (newSettings: Partial<VisualizationSettings>) => {
        setVisualizationSettings(prevSettings => ({ ...prevSettings, ...newSettings }));
    };

    const handleSongCountChange = (value: number) => {
        setSongCount(value);
    };

    const handleResetQuantity = () => {
        localStorage.removeItem('quantity'); // Удаляем 'quantity' из localStorage
        window.location.reload(); // Перезагружаем страницу
    };

    const handleSelectSimilarSong = (url: string) => {
        const newSelectedSong = songs.find(song => song.Track === url.split('/').pop());
        if (newSelectedSong) {
            setSelectedSong(newSelectedSong);
            if (isMobile) {
                onOpen();
            }
        } else {
            console.error('Song not found:', url);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const limitedSongs = songs.slice(0, songCount);

    return (
        <Flex direction={"row"} gap={8} justifyContent={"center"} w={"100%"} h={"90dvh"} >
            <Flex className="main-page" direction={"column"} alignItems={"center"} h={"100%"}>
                <Flex alignItems={"center"} gap={4} p={3} justifyContent={"space-between"} w={"100%"}>
                    <Heading size={["md", "lg"]} fontWeight={"bold"} >Spotify Song Similarity Analysis</Heading>
                    <HStack>
                        <Button onClick={handleResetQuantity}>
                            Reset quantity
                        </Button>
                        <Text>{colorMode}</Text>
                        <Switch size={["sm", "md"]} onChange={toggleColorMode} />
                    </HStack>
                </Flex>
                <VStack className="content" h={"100%"}>
                    <Card className="visualization-container" p={2} gap={4} h={"100%"}>

                        <MemoizedSimilarityMap
                            songs={limitedSongs}
                            similarities={similarities!}
                            settings={visualizationSettings}
                            onSongSelect={handleSongSelect}
                        />
                        <FormControl px={4}>
                            <Flex justifyContent={"space-between"} px={4}>
                                <FormLabel htmlFor="songCount">Number of songs to analyze</FormLabel>
                                <Text fontWeight={"bold"} fontSize={"lg"}>{`${songCount} / ${songs.length}`}</Text>

                            </Flex>
                            <Slider
                                id="songCount"
                                min={1}
                                max={songs.length}
                                step={1}
                                value={songCount}
                                onChange={handleSongCountChange}
                            >
                                <SliderTrack>
                                    <SliderFilledTrack />
                                </SliderTrack>
                                <SliderThumb />
                            </Slider>
                        </FormControl>
                        <Flex direction={"column"} justifyContent={"center"} h={"100%"}>
                            <VisualizationControls
                                settings={visualizationSettings}
                                onSettingsChange={handleSettingsChange}
                            />
                        </Flex>
                    </Card>
                    <Modal isOpen={!!(isOpen && isMobile)} onClose={handleClose} useInert={isMobile} >
                        <ModalOverlay />
                        <ModalContent width="80%" maxWidth="800px">
                            <ModalHeader>Song Information</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody >
                                {selectedSong ? (
                                    <SongInfo
                                        song={selectedSong}
                                        similarSongs={similarities ? similarities[selectedSong.Track] : {}}
                                        onSelectSimilarSong={handleSelectSimilarSong}
                                    />
                                ) : (
                                    <div>No song selected</div>
                                )}
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                </VStack>
            </Flex>

            { !isMobile &&
              <Card w={"30%"}>
                  {selectedSong ? (
                      <SongInfo
                          song={selectedSong}
                          similarSongs={similarities ? similarities[selectedSong.Track] : {}}
                          onSelectSimilarSong={handleSelectSimilarSong}
                      />
                  ) : (
                      <div>No song selected</div>
                  )}
              </Card>
            }
        </Flex>
    );
};

export default MainPage;