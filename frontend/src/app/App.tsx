import React from 'react';
import MainPage from '../pages/MainPage/MainPage.tsx';
import {Providers} from "./providers/Providers.tsx";

const App: React.FC = () => {
    return (
        <Providers>
            <MainPage/>
        </Providers>
    );
};

export default App;