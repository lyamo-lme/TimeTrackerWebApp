import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import moment from "moment";
import { CreateEventType } from "../../../type/Events/CreateEventType";
import { EventType } from "../../../type/Events/EventType";

interface calendarState {
    totalDays: number,
    currentDaysArray: moment.Moment[],
    currentDate: string,
    events: EventType[],
    currentCalendar: moment.Moment,
    startDay: moment.Moment,
    currentDateMoment: moment.Moment,
    currentDateList: string
}

const initialState: calendarState = {
    events: [{
        id: 1,
        title: "My event",
        description: "desc",
        date: "2022-07-21"
    }, {
        id: 2,
        title: "Create Time Tracker",
        description: "desc",
        date: "2022-07-21"
    }, {
        id: 3,
        title: "Make an authorization in our app",
        description: "desc",
        date: "2022-07-21"
    }, {
        id: 4,
        title: "Create GraphQL API",
        description: "desc",
        date: "2022-07-21"
    }, {
        id: 5,
        title: "User interface",
        description: "desc",
        date: "2022-07-25"
    }],
    totalDays: 42,
    currentDaysArray: [],
    currentDate: '',
    currentDateList: '',
    currentCalendar: moment(),
    startDay: moment().clone().startOf("month").startOf("week"),
    currentDateMoment: moment()
}
const calendarSlice = createSlice({
    name: "calendarSlice",
    initialState,
    reducers: {
        initCalendar: (state) => {
            moment.updateLocale("en", { week: { dow: 0 } });
            const day = moment().clone().startOf("month").startOf("week")

            return {
                ...state,
                currentDate: moment().format("yyyy-MM-DD"),
                currentCalendar: moment(),
                startDay: day.clone(),
                currentDaysArray: [...Array(state.totalDays)].map(() => day.add(1, "day").clone()),
            }
        },
        prevMonth: (state) => {

            const day = state.currentCalendar.subtract(1, "month").clone()

            return {
                ...state,
                currentCalendar: day.clone(),
                startDay: day.startOf("month").startOf("week").clone(),
                currentDaysArray: [...Array(state.totalDays)].map(() => day.add(1, "day").clone()),

            }
        },
        nextMonth: (state) => {

            const day = state.currentCalendar.add(1, "month").clone()

            return {
                ...state,
                currentCalendar: day.clone(),
                startDay: day.startOf("month").startOf("week").clone(),
                currentDaysArray: [...Array(state.totalDays)].map(() => day.add(1, "day").clone()),

            }
        },
        addEvent: (state, action: PayloadAction<EventType>) => {

            return {
                ...state,
                events: state.events.concat(action.payload)
            }
        },
        setCurrentDateList: (state, action:PayloadAction<string>)=>{
            return{
                ...state,
                currentDateList: action.payload
            }
        },
        editEventAction: (state, action:PayloadAction<EventType>)=>{
            const i = state.events.findIndex(item => item.id == action.payload.id);
            var events = state.events.slice();
            events[i] = action.payload;
            return { ...state, events: events }
        },
        removeEvent: (state, action:PayloadAction<number>) => {
            return { ...state, events: state.events.filter(item => item.id !== action.payload) }
        },
        setEvents: (state,action:PayloadAction<EventType[]>)=>{

            return{
                ...state,
                events: action.payload
            }
        }
    }
})

export default calendarSlice;
export const { initCalendar, prevMonth, nextMonth ,addEvent,setCurrentDateList,editEventAction, removeEvent} = calendarSlice.actions;