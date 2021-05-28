import {createContext, useContext, useEffect, useReducer} from 'react';

const AuthContext = createContext();

function authReducer(state, action) {
    switch (action.type) {
        case 'login': {
            return {
                ...state,
                isAuthenticated: true
            }
        }
        case 'logout': {
            return {
                ...state,
                isAuthenticated: false
            }
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`)
        }
    }
}

const initialState = {
    isAuthenticated: false
}

const localState = JSON.parse(localStorage.getItem("state"));

function AuthProvider({children}) {
    const [state, dispatch] = useReducer(authReducer, localState || initialState, undefined);
    useEffect(() => {
        localStorage.setItem("state", JSON.stringify(state));
    }, [state]);

    const value = {state, dispatch}

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within a AuthProvider')
    }
    return context
}

export default AuthProvider;
export {useAuth};
