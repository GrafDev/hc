import {DataProvider} from './DataProvider';
import {ChakraProviderOptions} from "./ChakraProviderOptions";
import {ReactNode} from "react";
import * as React from 'react';


interface ProvidersProps {
    children: ReactNode;
    quantity: number
    isChooseQuantity: boolean
}

export const Providers: React.FC<ProvidersProps> = ({children,quantity,isChooseQuantity}) => {


    return (
        <ChakraProviderOptions>
                <DataProvider quantity={quantity} isChooseQuantity={isChooseQuantity}>
                    {children}
                </DataProvider>

        </ChakraProviderOptions>
    );
};