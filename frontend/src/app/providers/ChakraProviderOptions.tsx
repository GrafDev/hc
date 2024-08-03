import * as React from 'react';
import {ChakraProvider, extendBaseTheme} from "@chakra-ui/react";
import {ReactNode} from "react";

interface ProvidersProps {
    children: ReactNode;
}

const theme = extendBaseTheme({
    components: {
        Heading: {
            baseStyle: {
                fontSize: '2xl',
            },
        },
        Text: {
            baseStyle: {
                fontSize: 'sm',
            },
        },
    },
})
export const ChakraProviderOptions: React.FC<ProvidersProps> = ({ children }) => {
    return (
        <ChakraProvider resetCSS={true} theme={theme}>
                {children}
        </ChakraProvider>
    );
};