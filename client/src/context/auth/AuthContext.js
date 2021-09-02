import {
  createContext, useContext, useEffect, useReducer,
} from 'react';
import { useHistory } from 'react-router';

const AuthContext = createContext();

function authReducer(state, action) {
  switch (action.type) {
    case 'login': {
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    }
    case 'logout': {
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

const initialState = {
  isAuthenticated: false,
};

const localState = JSON.parse(localStorage.getItem('state'));

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, localState || initialState, undefined);

  useEffect(() => {
    localStorage.setItem('state', JSON.stringify(state));
    console.log('context:', JSON.stringify(state));

    // Deals with automatic logout after token expires
    if (state.isAuthenticated) {
      setTimeout(() => {
        dispatch({
          type: 'logout',
        });
        localStorage.clear();
        alert('Your session has ended.');
      }, 1000 * 60 * 60); // Sign out after 1 hour
    }
  }, [state]);

  const value = { state, dispatch };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}

export default AuthProvider;
export { useAuth };
