import {
    Button,
    Card,
    Flex,
    FormLabel,
    Heading,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    Text
} from "@chakra-ui/react";
import {useState} from "react";

interface IChooseQuantityProps {
    setIsChooseQuantity: (value: boolean) => void
    setQuantity: (value: number) => void
    quantity: number
}

const ChooseQuantity = ( {setIsChooseQuantity,setQuantity,quantity}:IChooseQuantityProps) => {
    const [_quantity, _setQuantity] = useState<number>(quantity);
    const handleSliderChange = (value: number) => {
        _setQuantity(value);
    };
    console.log("Quantity:", _quantity,quantity);

    const handleConfirm = () => {
        setQuantity(_quantity);
        setIsChooseQuantity(true);

    };
    return (
        <Flex height="100vh" alignItems="center" justifyContent="center">
            <Flex gap={4} p={4} direction={"column"} width="500px">
                <Text color={"blue.400"} fontSize={["2xl", "3xl"]} fontWeight={"bold"} p={4}
                      align={"center"}>
                    HunterCorp
                </Text>
                <Text color={"green.600"} fontSize={["xl", "2xl"]} fontWeight={"bold"} p={4}
                      align={"center"}>
                    Song Similarity Analysis
                </Text>

                <Heading color={"green.600"}></Heading>
                <Card p={4}>
                    <Flex justifyContent={"space-between"} px={2}>
                        <FormLabel htmlFor="maxConnections">Quantity of songs</FormLabel>
                        <Text fontWeight={"bold"}>{_quantity}</Text>
                    </Flex>
                    <Slider
                        aria-label="slider-ex-1"
                        defaultValue={100}
                        min={25}
                        max={4500}
                        onChange={handleSliderChange}
                    >
                        <SliderTrack>
                            <SliderFilledTrack/>
                        </SliderTrack>
                        <SliderThumb/>
                    </Slider>
                    <Text color={"green.800"}  p={4}
                          align={"center"}>
                        processing time will be approx: {Math.round(_quantity / 623*10)/10+2} seconds
                    </Text>
                    <Button mt={4} colorScheme={"green"} onClick={handleConfirm}>OK</Button>

                </Card>
            </Flex>
        </Flex>
    );
};

export default ChooseQuantity
