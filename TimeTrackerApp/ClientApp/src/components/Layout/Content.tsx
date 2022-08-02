import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { refreshTokenKey } from "../../Cookie/Cookie";
import { parseJwt } from "../../store/parserJWT/parserJWT";
import { AuthUserResponse } from "../../type/User/AuthUser";
import Calendar from "../Calendar/Calendar";

import {Home} from "./Home";
import UserList from "../UserList/UserList";

export const Content: FC = () => {

    return (
        <div className={"content-container flex-container w-100"}>
            <Routes>
                <Route index element={<Home />} />
                <Route path={"/calendar"} element={<Calendar />} />
                <Route path={"/userList"} element={<UserList/>} />
            </Routes>
        </div>
    );
}