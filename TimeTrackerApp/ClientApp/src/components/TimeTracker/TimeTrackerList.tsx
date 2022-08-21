import {CSSProperties, FC, useEffect, useState} from "react";
import {deleteRecord, fetchUserRecordsByMonth, updateRecord} from "../../store/timeTracker/timeTracker.slice";
import {TimeTrackerDefaultPropsType} from "./Home";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleInfo, faPenClip, faGears} from "@fortawesome/free-solid-svg-icons";
import {Record} from "../../types/timeTracker.types";
import {useAuth} from "../../hooks/useAuth";
import {useDispatch} from "react-redux";
import {useAppSelector} from "../../hooks/useAppSelector";

type TimeTrackerListPropsType = {
    defaultProps: TimeTrackerDefaultPropsType
}

type TimeTrackerListStateType = {
    recordIsBeingEdited?: Record | null,
    selectedMonth?: Date | null
}

const initialState: TimeTrackerListStateType = {
    recordIsBeingEdited: null,
    selectedMonth: new Date(new Date().setHours(0, 0, 0, 0))
}

export const TimeTrackerList: FC<TimeTrackerListPropsType> = (props) => {

    const auth = useAuth()
    const dispatch = useDispatch();
    const [state, setState] = useState(initialState);
    const {records} = props.defaultProps
    const recordsInStore = useAppSelector(state => state.rootReducer.timeTracker.records)
    const timeFormatter = Intl.DateTimeFormat('default', {hour: '2-digit', minute: 'numeric', second: 'numeric'})
    let componentStyle: CSSProperties = {maxWidth: window.innerWidth - 310};

    useEffect(() => {
        if (auth.state?.user?.id && state.selectedMonth) {
            dispatch(fetchUserRecordsByMonth({userId: auth.state.user.id, monthNumber: state.selectedMonth.getMonth() + 1}))
        }
    }, [auth, state])

    let mouseListener = (event: Event) => {
        const element = event.target as Element
        if (!element.classList.contains('time-picker-input') && !element.classList.contains('save-record')) {
            setState({...state, recordIsBeingEdited: null})
        }
    }

    const editTimeTrackerListItem = (recordId: number) => {
        const record = recordsInStore.find(record => record.id === recordId)
        if (record) {
            setState({...state, recordIsBeingEdited: record})
        }
    }

    const saveRecordChanges = (record: Record) => {
        dispatch(updateRecord({...record, isAutomaticallyCreated: false, editorId: auth.state?.user?.id}))
        setState({...state, recordIsBeingEdited: null})
        window.onclick = null
    }

    const convertStringToTime = (time: string) => {
        const substrings = time.split(':');
        return parseInt(substrings[0]) * 3600000 + parseInt(substrings[1]) * 60000 + parseInt(substrings[2]) * 1000
    }

    const getTimeFromString = (time: string) => {
        const substrings = time.split(':');
        return [parseInt(substrings[0]), parseInt(substrings[1]), parseInt(substrings[2])]
    }

    const removeTimeTrackerListItem = (recordId: number) => {
        dispatch(deleteRecord(recordId));
    }

    useEffect(() => {
        if (state.recordIsBeingEdited)
            window.onclick = mouseListener
    }, [state.recordIsBeingEdited])

    return (
        <>
            <div className={'time-tracker-list-header'}>
                <div className={'month-picker flex-container align-items-center'}>
                    <label>Month: </label>
                    <input type={"month"} defaultValue={state.selectedMonth ? `${state.selectedMonth.getFullYear()}-${state.selectedMonth.getMonth() + 1 < 10 ? '0' : ''}${state.selectedMonth.getMonth() + 1}` : ''} onChange={event => setState({...state, selectedMonth: event.target.value ? new Date(event.target.value) : undefined})}/>
                </div>
            </div>
            <div className={"time-tracker-list flex-container flex-column position-relative"} style={componentStyle}>
                <table className={"time-tracker-table"}>
                    <thead>
                    <tr>
                        <th className={"date"}>Date</th>
                        <th className={"begin"}>Begin</th>
                        <th className={"end"}>End</th>
                        <th className={"duration"}>Duration</th>
                        <th className={"creation-type"}>Creation type</th>
                        <th className={"last-edited-by"}>Last edited by</th>
                        <th className={"actions"}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    { records.length === 0 &&
                        <tr>
                            <td className={"bottom-table-row"} colSpan={8}>
                                <p>
                                    <FontAwesomeIcon icon={faCircleInfo} className={"icon"} />
                                    The list of your records is empty!
                                </p>
                            </td>
                        </tr>
                    }
                    {
                        records.map(record => (
                            <tr key={record.id}>
                                <td>{record.date.toLocaleDateString()}</td>
                                <td>
                                    { record.id === state.recordIsBeingEdited?.id ?
                                        <input className={'time-picker-input'}
                                               type={'time'}
                                               step={1}
                                               defaultValue={timeFormatter.format(state.recordIsBeingEdited!.createdAt.getTime())}
                                               onChange={event => {
                                                   const timeSections = getTimeFromString(event.target.value)
                                                   const hours = timeSections[0]
                                                   const minutes = timeSections[1]
                                                   const seconds = timeSections[2]
                                                   const createdAt = new Date(state.recordIsBeingEdited!.createdAt.setHours(hours, minutes, seconds))
                                                   const workingTime = state.recordIsBeingEdited!.workingTime + record.begin - createdAt.getTime()
                                                   setState({...state, recordIsBeingEdited: {
                                                       ...state.recordIsBeingEdited,
                                                       createdAt: createdAt,
                                                       workingTime: workingTime
                                                   } as Record})
                                               }}
                                        />
                                        :
                                        new Date(record.begin).toLocaleTimeString()
                                    }
                                </td>
                                <td>
                                    { record.id === state.recordIsBeingEdited?.id ?
                                        <input className={'time-picker-input'}
                                               type={'time'}
                                               step={1}
                                               defaultValue={timeFormatter.format(state.recordIsBeingEdited!.createdAt.getTime() + state.recordIsBeingEdited!.workingTime)}
                                               onChange={event => setState({...state, recordIsBeingEdited: {...state.recordIsBeingEdited, workingTime: convertStringToTime(event.target.value) - convertStringToTime(state.recordIsBeingEdited!.createdAt.toLocaleTimeString())} as Record})}
                                        />
                                        :
                                        new Date(record.begin + record.duration).toLocaleTimeString()
                                    }
                                </td>
                                <td>{timeFormatter.format(record.duration + new Date().getTimezoneOffset() * 60000)}</td>
                                <td>
                                    {record.isAutomaticallyCreated ?
                                        <span className={"creation-type-label automatically"}>
                                            <FontAwesomeIcon icon={faGears} className={"icon"} />
                                            Automatically
                                        </span>
                                        :
                                        <span className={"creation-type-label manually"}>
                                            <FontAwesomeIcon icon={faPenClip} className={"icon"} />
                                            Manually
                                        </span>
                                    }
                                </td>
                                <td>{record.editor ? `${record.editor?.firstName} ${record.editor?.lastName}` : 'You'}</td>
                                <td>

                                    { !auth.state?.user?.isFullTimeEmployee &&
                                        <>{ record.id !== state.recordIsBeingEdited?.id ?
                                            <a className={"button yellow-button edit-record"} onClick={() => editTimeTrackerListItem(record.id ?? -1)}>Edit</a>
                                            :
                                            <a className={"button yellow-button save-record"} onClick={() => saveRecordChanges(state.recordIsBeingEdited!)}>Save</a>
                                        }</>
                                    }
                                    <a className={"button red-button"} onClick={() => removeTimeTrackerListItem(record.id ?? -1)}>Delete</a>
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
            </div>
        </>
    )
}