import React, {FC} from 'react';
import {AuthenticationForm} from "./AuthenticationForm";

const imageStyle = {
    backgroundImage: `url(/images/workspace.jpg)`
}

export const AuthenticationIndex: FC = () => {
    
    return (
        <div className={"container"}>
            <div className={"flex-container h-fullscreen auth-container"} style={imageStyle}>
                <AuthenticationForm />
            </div>
        </div>
    );
};