import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { nextMonth, previousMonth } from "../../../store/slice/calendar/calendarSlice";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export function Controls() {
    const dispatch = useAppDispatch();
    const formatter = Intl.DateTimeFormat('en-US', { month: 'long'});
    const date = useAppSelector(state => state.rootReducer.calendar.selectedMonth);

    return (
        <>
            <div className={"calendar-controls"}>
                <header>
                    <div className={'left-button'}>
                        <a className={'button dark-button'} onClick={() => dispatch(previousMonth())}>
                            <FontAwesomeIcon icon={faAngleLeft} className={'icon'} />
                        </a>
                    </div>
                    <div>
                        <h2>{formatter.format(date)}<span>{date.getFullYear()}</span></h2>
                    </div>
                    <div className={'right-button'}>
                        <a className={'button dark-button'} onClick={() => dispatch(nextMonth())}>
                            <FontAwesomeIcon icon={faAngleRight} className={'icon'} />
                        </a>
                    </div>
                </header>
            </div >
        </>);
}