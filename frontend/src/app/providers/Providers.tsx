import { DataProvider } from './DataProvider';
import {ChakraProviderOptions} from "./ChakraProviderOptions";
import {ReactNode} from "react";
import * as React from 'react';

interface ProvidersProps {
    children: ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
    return (
        <ChakraProviderOptions>
            <DataProvider>
                {children}
            </DataProvider>
        </ChakraProviderOptions>
    );
};