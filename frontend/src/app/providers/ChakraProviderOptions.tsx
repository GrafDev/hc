import * as React from 'react';
import {ChakraBaseProvider,extendTheme} from "@chakra-ui/react";
import {ReactNode} from "react";

interface ProvidersProps {
    children: ReactNode;
}

const _theme = extendTheme({
    components: {
        Heading: {
            baseStyle: {
                fontSize: 'lg',
            },
        },
        Slider: {
            baseStyle: {
                parts: {
                    track: {
                        height: '4px',
                        borderRadius: 'full',
                        bg: 'gray.200',
                    },
                    filledTrack: {
                        height: '4px',
                        borderRadius: 'full',
                        bg: 'blue.500',
                    },
                    thumb: {
                        boxSize: 6,
                        bg: 'white',
                        borderRadius: 'full',
                        border: '2px solid',
                        borderColor: 'blue.500',
                        _hover: {
                            boxShadow: '0 0 0 4px rgba(0, 0, 255, 0.2)',
                        },
                    },
                },
            },
        },
    },
})
export const ChakraProviderOptions: React.FC<ProvidersProps> = ({ children }) => {
    return (
        <ChakraBaseProvider resetCSS={true} theme={_theme}>
                {children}
        </ChakraBaseProvider>
    );
};