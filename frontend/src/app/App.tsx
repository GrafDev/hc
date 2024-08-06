import * as React from 'react';
import {Providers} from "./providers/Providers";
import MainPage from "../pages/MainPage/MainPage";

const App: React.FC = () => {
    return (
        <Providers>
            <MainPage/>
        </Providers>
    );
};

export default App;