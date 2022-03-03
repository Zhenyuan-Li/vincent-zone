---
title: 'More Hooks: Effects, Reducers, Context'
date: '2022-1-10'
image: interface.png
excerpt: 'React 16.8 introduced a very handful tool: hooks. So far two basic built-in hooks are explained. Learn more hooks by going through a demo application - Dummy Auth.'
isFeatured: true
---

This is a note for [a great React course](https://www.udemy.com/course/react-the-complete-guide-incl-redux/) on Udemy developed by [Maximilian Schwarzmüller](https://www.udemy.com/user/maximilian-schwarzmuller/)

# Demo 4: Dummy Auth (Effects, Reducers, Context)

[Completed code in Github Repository](https://github.com/Zhenyuan-Li/Udemy-React-v2.0/tree/main/4_Dummy_Auth)

## Effect - The Third Hook

### 1. What are the side effects? Anything Else

Tasks happen outside of the normal component evaluation and render cycle.

Since they might block, delay rendering.(might occur infinite loop)

- Store Data in Browser Storage
- Send HTTP request to Backend Servers
- Set & Manage Timers ....

#### 2. Use Examples

##### No dependency

never do that. useEffect() is useless, since the inner function will run every re-render.

##### Empty dependency []

only run once, when the app starts up (like componentDidMount()).
Like fetching some data from API before rendering the pages, and set states for those data.

##### Normal case [usrId, age]

Add all "things" you use in your effect function if those "things" could change because your component (or some parent component) re-rendered.

Also see the example of bouncing case & cleanup function

```jsx
// It is not a normal side effect, like http request.
// But we are re-render the interface based on some state changes, which is also a side effect.
useEffect(() => {
  // Directly approach is not ideal. It will run every key-stroke!
  // Hence, we use debouncing to optimise useEffect()
  const identifier = setTimeout(() => {
    console.log('Checking for validity!');
    setFormIsValid(emailIsValid && passwordIsValid);
  }, 500);

  // Cleanup function: runs before every new effect function execution and before the component is removed.
  // But it won't rin at the very first execution
  return () => {
    console.log('Cleanup!');
    clearTimeout(identifier);
  };

  // setFormIsValid can be omitted, since it is default function that never changed
}, [emailIsValid, passwordIsValid]);
```

## Reducer - The Forth Hook

### 1. Background

- When the states are complex (multiple states, multiple ways of changing it). useState() might be hard or error-prone to use.
- Some states are related (email & isValid)
- useReducer() more powerful state management (To avoid buggy, inefficient code).

### 2. Use Examples

**Login.js**

- Reducer function could be in a separate file (unrelated with rendering component)

```js
// create reducer funtion
const emailReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return { value: action.val, isValid: action.val.includes('@') };
  }
  if (action.type === 'INPUT_BLUR') {
    // the state could be guaranteed the latest one
    return { value: state.value, isValid: state.value.includes('@') };
  }
  return { value: '', isValid: false };
};
// Initialize
const [emailState, dispatchEmail] = useReducer(emailReducer, {
  value: '',
  isValid: null,
});
// usage
dispatchPassword({ type: 'USER_INPUT', val: event.target.value });
```

- Two ways to optimise the useEffect (decrease unnecessary run):
  - a) Debouncing: use setTimeout and cleanup function to reduce the frequent call (input field updates in every key stroke).
  - b) Deconstruction: if use reducer, deconstruct the state and give them new name added to dependency

```js

```

## Context API

### 1. Background

- props: most cases to configure comp. useContext() if the transfer level is too deep.

### 2. Example

```jsx
// Create store
import React, { useState, useEffect } from 'react';

const AuthContext = React.createContext({
  isLoggedIn: false,
  onLogout: () => {},
  onLogin: (email, password) => {},
});

export const AuthContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // It will run after every component re-evaluation. (if the dependency change)
  // In this case no dependency, only run once, after the app starts up
  useEffect(() => {
    const storedUserLoggedInInfo = localStorage.getItem('isLoggedIn');

    if (storedUserLoggedInInfo) {
      setIsLoggedIn(true);
    }
  }, []);

  const loginHandler = (email, password) => {
    // We should of course check email and password
    // But it's just a dummy/ demo anyways
    localStorage.setItem('isLoggedIn', '1');
    setIsLoggedIn(true);
  };

  const logoutHandler = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        onLogout: logoutHandler,
        onLogin: loginHandler,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
```

```jsx
// register (global usage)
import { AuthContextProvider } from './store/auth-context';

ReactDOM.render(
  <AuthContextProvider>
    <App />
  </AuthContextProvider>,
  document.getElementById('root')
);
// usage in different component
import AuthContext from '../../store/auth-context';
const { onLogout, onLogin } = useContext(AuthContext);
```

### 3. Limitation

- React Context is not optimized for high frequency changes!
- Better tool: Redux
- React Context shouldn't be used to replace all component communication & props. </br>
  Component should still be configurable via props and short 'props chain' might not need any replacement.

## Rules of Hooks

1. Only call React Hooks in **React Functions**.
2. Only call React Hooks at the **Top Level**.
3. ALWAYS add everything you refer to inside of useEffect as a dependency!

## Others

Mystery Stuff: React.forwardRef, useImperativeHandle()

```jsx
const Input = React.forwardRef((props, ref) => {
  const inputRef = useRef();

  const activate = () => {
    inputRef.current.focus();
  };

  useImperativeHandle(ref, () => {
    return {
      focus: activate,
    };
  });

  return (
    <div
      className={`${classes.control} ${
        props.isValid === false ? classes.invalid : ''
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      <input
        ref={inputRef}
        type={props.type}
        id={props.id}
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
      />
    </div>
  );
});

export default Input;
```
