import { configureStore, combineReducers} from '@reduxjs/toolkit';
import { authSlice } from './auth/auth.slice';
import { timeTrackerSlice } from "./timeTracker/timeTracker.slice";
import { combineEpics, createEpicMiddleware} from "redux-observable";
import { calendarSlice } from './calendar/calendar.slice';
import { authEpics } from './auth/auth.epics';
import { userEpics } from './user/user.epics';
import { userListSlice } from './userList/userList.slice';
import { calendarEpics } from './calendar/calendar.epics';
import { userListEpics } from "./userList/userList.epics";
import { timeTrackerEpics } from "./timeTracker/timeTracker.epics";
import { vacationSlice } from './vacation/vacation.slice';
import { vacationEpic } from './vacation/vacation.epics';

const epicMiddleware = createEpicMiddleware();

const rootEpic = combineEpics(authEpics, userEpics, calendarEpics, timeTrackerEpics, vacationEpic, userListEpics);

const rootReducer = combineReducers({
  calendar: calendarSlice.reducer,
  auth: authSlice.reducer,
  userList: userListSlice.reducer,
  timeTracker: timeTrackerSlice.reducer,
  vacation: vacationSlice.reducer
})

export const store = configureStore({
  reducer: {
    rootReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }).concat(epicMiddleware)
});

epicMiddleware.run(rootEpic);

export const dispatchOut = store.dispatch;
export const state = store.getState();

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;