import {createAction, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {User} from "../../types/user.types";
import {CreateVacationType, EditVacationType, VacationResponse, VacationType} from "../../types/vacation.types";

interface vacationState {
    vacations: VacationType[],
    requestVacations: VacationType[],
    approvers: User[]
}

const initialState: vacationState = {
    vacations: [],
    requestVacations: [],
    approvers: []
}

export const vacationSlice = createSlice({
    name: "vacationSlice",
    initialState: initialState,
    reducers: {
        setVacation: (state, action: PayloadAction<VacationType[]>) => {
            return {...state, vacations: action.payload};
        },
        addVacation: (state, action: PayloadAction<VacationType>) => {
            return {...state, vacations: state.vacations.concat(action.payload)};
        },
        removeVacation: (state, action: PayloadAction<number>) => {
            return {...state, vacations: state.vacations.filter(item => item.id !== action.payload)}
        },
        updateVacation: (state, action: PayloadAction<VacationType>) => {
            const i = state.vacations.findIndex(item => item.id == action.payload.id);
            let vacations = state.vacations.slice();
            vacations[i] = action.payload;
            return {...state, vacations: vacations}
        },
        setRequestVacation: (state, action: PayloadAction<VacationType[]>) => {
            return {...state, requestVacations: action.payload};
        },
        removeRequestVacation: (state, action: PayloadAction<number>) => {
            return {...state, requestVacations: state.requestVacations.filter(item => item.id !== action.payload)};
        },
        updateRequestVacation: (state, action: PayloadAction<VacationType>) => {
            const i = state.requestVacations.findIndex(item => item.id == action.payload.id);
            let vacations = state.requestVacations.slice();
            vacations[i] = action.payload;
            return {...state, requestVacations: vacations};
        },
        setApprovers: (state, action: PayloadAction<User[]>) => {
            return {...state, approvers: action.payload};
        }
    }
});

export const {
    removeVacation,
    addVacation,
    setVacation,
    updateVacation,
    updateRequestVacation,
    setApprovers,
    setRequestVacation,
    removeRequestVacation
} = vacationSlice.actions;

export const fetchApproversAction = createAction<number>("fetchApprovers");
export const getRequestVacationAction = createAction<number>("getAllVacations");
export const getAllVacationsAction = createAction("getVacationsByUserId");
export const getVacationsByUserIdAction = createAction<number>("getVacationById");
export const createResponseAction = createAction<{ stateAccepte: boolean, response: VacationResponse }>("createResponse");
export const getVacationByIdAction = createAction<number>("createVacation");
export const createVacationAction = createAction<CreateVacationType>("getRequestVacation");
export const removeVacationAction = createAction<number>("removeVacation");
export const updateVacationAction = createAction<EditVacationType>("updateVacation");