import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Cookies } from "react-cookie";
import { Token } from "../../../type/Token";
import { AuthUser, EmptyAuthUser } from "../../../type/User/AuthUser";
import { EmptyUser, User } from "../../../type/User/User";
import { refreshTokenKey, setCookie } from "../../Cookie/Cookie";



interface authState {
    authUser: AuthUser | null,
    user: User | null,
    token: Token | null
}

const initialState: authState = {
    authUser: null,
    user: null,
    token: null
}
export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        /*на этом этапе ничего не продумано */
        setUserDataFromToken: (state, action: PayloadAction<any>) => {
        
            return { ...state, };
        },
        /*вообше наверное для access токена так как рефреш запишем в куки */
        setToken: (state, action: PayloadAction<any>) => {
            console.log(action.payload)
            setCookie({key: refreshTokenKey,value: action.payload.refreshToken,daysLife: 7});
            return { ...state, token: action.payload };

        },
        logOut: (state) => {
            state.user = null;
            state.token = null
        }
    }
});

export const {logOut, setToken } = authSlice.actions;


