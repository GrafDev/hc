import React, { ReactNode } from 'react';
import { DataProvider } from './DataProvider';
import {ChakraProviderOptions} from "./ChakraProviderOptions.tsx";

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