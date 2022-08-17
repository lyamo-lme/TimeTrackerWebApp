import {FC, useEffect, useState} from "react";
import {Timer} from "./Timer";
import {TimeTrackerDefaultPropsType} from "./Home";
import {useAuth} from "../../hooks/useAuth";
import {compareDate} from "../../store/calendar/calendar.slice";

type TimeTrackerPropsType = {
    defaultProps: TimeTrackerDefaultPropsType
}

type TimeTrackerStateType = {
    chooseTimeInput?: string
}

const initialState: TimeTrackerStateType = {
    chooseTimeInput: '12:00'
}

export const TimeTracker: FC<TimeTrackerPropsType> = (props) => {

    const auth = useAuth()
    const [state, setState] = useState(initialState)
    const {records, lastRecord} = props.defaultProps;
    const workingDaysInMonth = getWorkingDaysInRange(new Date(new Date().setDate(1)), new Date(new Date(new Date().setMonth(new Date().getMonth() + 1)).setDate(0)))
    const timeWorkedInThisMonth = records.filter(record => record.date.getTime() >= new Date().setDate(1)).reduce((sum, record) => sum + record.duration, 0)
    const timeToBeWorkedInThisMonth = (auth.state?.user?.weeklyWorkingTime ?? 0) / 5 * workingDaysInMonth * 60 * 1000
    const thisMonthRecords = records.filter(record => record.date.getTime() >= new Date().setDate(1))
    const numberFormatter = Intl.NumberFormat('uk', {minimumIntegerDigits: 2})
    let attendance: number = Math.min(1, thisMonthRecords.length);

    const getFormattedTime = (milliseconds: number): string => {
        const hours = numberFormatter.format(Math.floor(milliseconds / 60 / 60 / 1000))
        const minutes = numberFormatter.format(Math.floor(milliseconds / 60 / 1000 % 60))
        const seconds = numberFormatter.format(Math.floor(milliseconds / 1000) % 60)
        return `${hours}h. ${minutes}m. ${seconds}s.`
    }

    useEffect(() => {
        if (thisMonthRecords) {
            for (let i = 0; i < thisMonthRecords.length - 1; i++) {
                if (!compareDate(thisMonthRecords[i].date, thisMonthRecords[i + 1]?.date)) {
                    attendance++;
                }
            }
        }
    }, [thisMonthRecords])

    return (
        <div className={"time-tracker-statistic w-100"}>
            <Timer defaultProps={{records: records, lastRecord: lastRecord} as TimeTrackerDefaultPropsType}/>
            <div className={"statistic-panel w-100"}>
                <h3>Current month activity:</h3>
                <div className={"statistic-panel-list"}>
                    <div>
                        <h4>Time worked</h4>
                        <span>
                            { getFormattedTime(timeWorkedInThisMonth) }
                        </span>
                    </div>
                    <div>
                        <h4>Time to be worked</h4>
                        <span>
                            { getFormattedTime(timeToBeWorkedInThisMonth) }
                        </span>
                    </div>
                    <div>
                        <h4>Attendance</h4>
                        <span>
                            {attendance} days
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

const getWorkingDaysInRange = (startDate: Date, endDate: Date): number => {
    let workingDays = 0;
    let currentDate = startDate;
    while (currentDate <= endDate) {
        let weekDay = currentDate.getDay()
        if (weekDay != 0 && weekDay != 6)
            workingDays++;
        currentDate.setDate(currentDate.getDate() + 1)
    }
    return workingDays;
}