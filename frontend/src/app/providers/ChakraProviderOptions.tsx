import * as React from 'react';
import {ChakraBaseProvider} from "@chakra-ui/react";
import {ReactNode} from "react";
import {_themeChakraUI} from "../../entities/ui/themes.ts";

interface ProvidersProps {
    children: ReactNode;
}

export const ChakraProviderOptions: React.FC<ProvidersProps> = ({ children }) => {
    return (
        <ChakraBaseProvider resetCSS={true} theme={_themeChakraUI}>
                {children}
        </ChakraBaseProvider>
    );
};