import { combineEpics, Epic, ofType } from "redux-observable";
import {catchError, from, map, mergeMap, Observable} from "rxjs";
import { graphqlRequest } from "../../graphql/api";
import {
    authLoginQuery,
    authLogoutQuery, authRefreshQuery,
} from "../../graphql/queries/auth.queries";
import {
    authLoginAction, authLogoutAction,
    authorizeUser, authRefreshAction, logout,
    setError,
    setUser
} from "./auth.slice";
import {accessTokenKey, clearCookie, getCookie, refreshTokenKey, setCookie} from "../../helpers/cookies";
import {parseError} from "../../helpers/parseError";
import {Action} from "react-epics";
import {getUserByIdQuery} from "../../graphql/queries/user.queries";
import {GetUserByIdQueryInputType} from "../../types/user.types";
import {parseJwt} from "../../helpers/parseJwt";
import {AuthLoginInputType, AuthLogoutInputType, AuthUserResponse} from "../../types/auth.types";
import {parseObjectToUser} from "../user/user.slice";
import { store} from "../store";
import { logoutR } from "../signalr";

const authLoginEpic: Epic = (action$: Observable<ReturnType<typeof authLoginAction>>): any => {
    return action$.pipe(
        ofType(authLoginAction.type),
        mergeMap(action => from(graphqlRequest(authLoginQuery, {
            email: action.payload.email,
            password: action.payload.password
        } as AuthLoginInputType)).pipe(
            map(response => {
                if (response?.data?.authLogin?.accessToken && response?.data?.authLogin?.refreshToken && !response?.errors) {
                    setCookie({key: refreshTokenKey, value: response.data.authLogin.refreshToken, lifetime: 30 * 24 * 60 * 60});
                    setCookie({key: accessTokenKey, value: response.data.authLogin.accessToken, lifetime: 2 * 60});
                    const userId = parseInt(parseJwt<AuthUserResponse>(getCookie(refreshTokenKey)).UserId);
                    return authorizeUser(userId)
                }
                return setError(parseError("Wrong email or password!"))
            })
        ))
    )
};

const authRefreshEpic: Epic = (action$: Observable<ReturnType<typeof authRefreshAction>>): any => {
    return action$.pipe(
        ofType(authRefreshAction.type),
        mergeMap(action => from(graphqlRequest(authRefreshQuery, action.payload)).pipe(
            map(response => {
                if (response?.data?.authRefresh?.accessToken && response?.data?.authRefresh?.refreshToken) {
                    setCookie({key: refreshTokenKey, value: response.data.authRefresh.refreshToken, lifetime: 30 * 24 * 60 * 60})
                    setCookie({key: accessTokenKey, value: response.data.authRefresh.accessToken, lifetime: 2 * 60})
                    return authorizeUser(parseInt(parseJwt<AuthUserResponse>(response.data.authRefresh.refreshToken).UserId));
                }
                return authLogoutAction(getCookie(refreshTokenKey) ? parseInt(parseJwt<AuthUserResponse>(getCookie(refreshTokenKey)).UserId) : 0)
            })
        ))
    )
}

const authLogoutEpic: Epic = (action$: Observable<ReturnType<typeof authLogoutAction>>): any => {
    return action$.pipe(
        ofType(authLogoutAction.type),
        mergeMap(action => from(graphqlRequest(authLogoutQuery, {
            userId: action.payload
        } as AuthLogoutInputType)).pipe(
            map(() => {
                clearCookie(refreshTokenKey)
                clearCookie(accessTokenKey)
                store.dispatch(logoutR());
                return logout()
            })
        ))
    )
};

const authSetUserEpic: Epic = (action$: Observable<ReturnType<typeof authorizeUser>>): any => {
    return action$.pipe(
        ofType(authorizeUser.type),
        mergeMap(action => from(graphqlRequest(getUserByIdQuery, {
            id: action.payload
        } as GetUserByIdQueryInputType)).pipe(
            map(response => {
                if (response?.data?.getUserById) {
                    const user = parseObjectToUser(response.data.getUserById)
                    return setUser(user)
                }
                return { payload: "Error", type: "AuthSetUserError"} as Action
            })
        ))
    )
};

export const authEpics = combineEpics(authLogoutEpic, authRefreshEpic, authLoginEpic, authSetUserEpic);