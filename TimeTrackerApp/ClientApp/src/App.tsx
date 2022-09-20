import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthenticationIndex} from "./components/Auth/AuthenticationIndex";
import { Index } from "./components/Layout/Index";
import {AuthProvider} from "./components/Auth/AuthProvider";
import connection from "./store/signalr";


function App ()  {
    
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path={"/login"} element={<AuthenticationIndex />} />
                    <Route path={"/*"} element={<Index />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;