import {createAction, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {GetUserByEmailQueryInputType, GetUserByIdQueryInputType, User} from "../../types/user.types";

type UserSliceStateType = {
    user: User | null
}

const initialState: UserSliceStateType = {
    user: null
}

export const userSlice = createSlice({
    name: "userSlice",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            return {...state, user: action.payload}
        }
    }
})

export const getUserById = createAction<GetUserByIdQueryInputType>("GetUserById")
export const getUserByEmail = createAction<GetUserByEmailQueryInputType>("GetUserByEmail")
export const {setUser} = userSlice.actions

export const parseObjectToUser = (object: any): User => {
    return {
        id: parseInt(object.id),
        email: object.email ?? "",
        firstName: object.firstName ?? "Unknown",
        lastName: object.lastName ?? "User",
        isFullTimeEmployee: Boolean(JSON.parse(object.isFullTimeEmployee)),
        weeklyWorkingTime: parseInt(object.weeklyWorkingTime ?? ''),
        remainingVacationDays: parseInt(object.remainingVacationDays ?? ''),
        privilegesValue: parseInt(object.privilegesValue ?? ''),
        activation: Boolean(JSON.parse(object.activation ?? true))
    } as User
}
