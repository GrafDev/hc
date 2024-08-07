import {DataProvider} from './DataProvider';
import {ChakraProviderOptions} from "./ChakraProviderOptions";
import {ReactNode, useState, useEffect} from "react";
import * as React from 'react';
import {
    Slider,
    SliderTrack,
    Text,
    SliderFilledTrack,
    SliderThumb,
    Button,
    Flex,
    Heading,
    FormLabel, Card
} from "@chakra-ui/react";

interface ProvidersProps {
    children: ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({children}) => {
    const [quantity, setQuantity] = useState<number>(100);
    const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

    useEffect(() => {
        const storedQuantity = localStorage.getItem('quantity');
        console.log("getQuantity", storedQuantity);
        if (storedQuantity) {
            setQuantity(parseInt(storedQuantity, 10));
            setIsConfirmed(true);
        }
    }, []);

    const handleSliderChange = (value: number) => {
        setQuantity(value);
    };

    const handleConfirm = () => {
        localStorage.setItem('quantity', quantity.toString());
        console.log("setQuantity", quantity);
        setIsConfirmed(true);
    };

    if (isConfirmed) {
        return (
            <ChakraProviderOptions>
                <DataProvider quantity={quantity}>
                    {children}
                </DataProvider>
            </ChakraProviderOptions>
        );
    }

    return (
        <ChakraProviderOptions>
            <Flex height="100vh" alignItems="center" justifyContent="center">
                <Flex gap={4} p={4} direction={"column"} width="500px">
                    <Text color={"blue.400"} fontSize={["2xl", "3xl"]} fontWeight={"bold"} p={4} align={"center"}>
                        HunterCorp
                    </Text>
                    <Text color={"green.600"} fontSize={["xl", "2xl"]} fontWeight={"bold"} p={4} align={"center"}>
                        Song Similarity Analysis
                    </Text>

                    <Heading color={"green.600"}></Heading>
                    <Card p={4}>
                        <Flex justifyContent={"space-between"} px={2}>
                            <FormLabel htmlFor="maxConnections">Quantity of songs</FormLabel>
                            <Text fontWeight={"bold"}>{quantity}</Text>
                        </Flex>
                        <Slider
                            aria-label="slider-ex-1"
                            value={quantity}
                            min={100}
                            max={4500}
                            onChange={handleSliderChange}
                        >
                            <SliderTrack>
                                <SliderFilledTrack/>
                            </SliderTrack>
                            <SliderThumb/>
                        </Slider>
                        <Text color={"green.800"}  p={4} align={"center"}>
                            processing time will be approx: {Math.round(quantity / 623*10)/10+2} seconds
                        </Text>
                        <Button mt={4} colorScheme={"green"} onClick={handleConfirm}>OK</Button>
                    </Card>
                </Flex>
            </Flex>
        </ChakraProviderOptions>
    );
};