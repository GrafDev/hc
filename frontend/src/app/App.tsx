import * as React from 'react';
import {Providers} from "./providers/Providers";
import MainPage from "../pages/MainPage/MainPage";
import {useEffect, useState} from "react";

const App: React.FC = () => {
    const [isChooseQuantity, setIsChooseQuantity] = useState(false);
    const [quantity, setQuantity] = useState<number>(100);
    useEffect(() => {
        console.log("Quantity:", quantity, "IsChooseQuantity:", isChooseQuantity);
    }, [quantity, isChooseQuantity]);
    return (
        <Providers isChooseQuantity={isChooseQuantity} quantity={quantity}>
            <MainPage setIsChooseQuantity={setIsChooseQuantity} isChooseQuantity={isChooseQuantity} setQuantity={setQuantity} quantity={quantity}/>
        </Providers>
    );
};

export default App;