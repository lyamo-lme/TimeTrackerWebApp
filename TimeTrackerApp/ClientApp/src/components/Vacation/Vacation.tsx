import React, { useEffect, useState } from "react";
import { CreateVacation } from "./CreateVacation";
import { EditVacation } from "./EditVacation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faCheck, faClock, faClose, faTimes, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import {useDispatch} from "react-redux";
import {useAppSelector} from "../../hooks/useAppSelector";
import {getVacationsByUserIdAction, removeVacationAction} from "../../store/vacation/vacation.slice";
import {getAllVacationLevelAction} from "../../store/vacationLevel/vacationLevel.slice";


export function Vacation() {
    const dispatch = useDispatch();
    const [createState, setCreateState] = useState(false);
    const [editState, setEditState] = useState(false);
    const [id, setIdEdit] = useState(0);
    const vacationsList = useAppSelector(state => state.rootReducer.vacation.vacations);
    const auth = useAuth();
    const vacationLevel = useAppSelector(state => state.rootReducer.vacationLevel.vacationLevels.find(x => x.id == auth.state?.user?.vacationPermissionId));

    useEffect(() => {
        const id = auth.state?.user?.id;
        if (id){
            dispatch(getVacationsByUserIdAction(id));
            dispatch(getAllVacationLevelAction());
        }
    }, [auth.state?.user]);

    return (
        <>
            {editState ? <EditVacation  stateForm={setEditState} visible={editState} idVacation={id} /> : <></>}
            {createState ? <CreateVacation stateForm={setCreateState} visible={createState} /> : <></>}
            <div className="vacation-container">
                <div className="control-panel vacation-control-panel">
                    <div>
                        <button onClick={() => setCreateState(true)} className="button cyan-button">Create Vacation Request</button>
                    </div>
                    <div>
                        {vacationLevel?.value ? vacationLevel.value > 1 ? <Link className="link" to="/manage-vacation"><button className="button cyan-button">Manage Requests Vacations</button></Link> : <></> : <></>}
                    </div>
                </div>
                <div className="list-vacation-container">
                    <p style={{margin: "5px"}}>Your Vacations</p>
                    <div className="list-vacations">
                        {!(vacationsList.length == 0) ?
                            <>
                                <div className="vacation-item" style={{ textAlign: "center" }}>
                                    <div>Starting Time</div>
                                    <div>Ending Time</div>
                                    <div>IsAccepted</div>
                                    <div className={"end-item-action"}>Actions</div>
                                </div>
                                {vacationsList.map((item, i) => {
                                    return (
                                        <div key={i} className="vacation-item">
                                            <div>{item.startingTime}</div>
                                            <div>{item.endingTime}</div>
                                            <div>{item.isAccepted ? <FontAwesomeIcon icon={faCheck} className={"custom-icon-green icon"} />
                                                : item.isAccepted == null ?
                                                    <FontAwesomeIcon icon={faClock} className={"icon"} />
                                                    : <FontAwesomeIcon icon={faBan} className={"custom-icon-red icon"} />
                                            }</div>
                                            <div className={"end-item-action"} ><button onClick={() => {
                                                setEditState(true);
                                                setIdEdit(item.id)
                                            }} className="button cyan-button">Edit</button>
                                                <button className={"button red-button close"} onClick={() =>
                                                     dispatch(removeVacationAction(item.id))} >
                                                    <FontAwesomeIcon icon={faXmark} className={"icon"} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                            : <div>You dont have vacations</div>}
                    </div>
                </div>
            </div>
        </>);
}