---
title: 'Form & User Input'
date: '2022-1-12'
image: interface.png
excerpt: Frustrated with massive user input validation or repeated code logic? Build a customized useInput hook from scratch and use three approaches to validate user inputs by going through a demo application - Profile Form.
isFeatured: true
---

This is a note for [a great React course](https://www.udemy.com/course/react-the-complete-guide-incl-redux/) on Udemy developed by [Maximilian Schwarzmüller](https://www.udemy.com/user/maximilian-schwarzmuller/)

# Demo 7: Profile Form (Form & User Input)

[Completed code in Github Repository](https://github.com/Zhenyuan-Li/Udemy-React-v2.0/tree/main/7_Profile_Form)

## What to validate

### Case 1 When form is submitted

- Allows the user to enter a valid value before warning him.
- Avoid unnecessary warnings but maybe present feedback "too late"

### Case 2 When a input is losing focus

- Allows the user to enter a valid value before warning him.
- Very useful for untouched forms

### Case 3 On every keystroke

- Warns user before he had a chance of entering valid values
- If applied only on invalid inputs, has the potential of providing more direct feedback.

## Case 1

### Handling Input value

Two ways **SimpleInput.js L11-24** useRef() & useState()

### Easy Validation and drawback

Set initial isValid state to true might involved unexpected call when useEffect(), also the naming is vague. So combine it with untouched state.

## Case 2 & 3

### Improvement needed from Case 1

- The error only shows after submit: once add something and clean the input, the error disappear, which shouldn't.
- Solution: use blur handler with change handler(key stroke check).
- In a larger form, useEffect() to check all inputs. (comment out line)

### Issues:

- Too much repeat logic, and make the component not neat. Could extract into a separate UI component, and manage validation individually. Or custom hook.
- The finished code space by now is immigrate in **SimpleInput-v1.js**

```jsx
const SimpleInput = (props) => {
  // const nameInputRef = useRef();
  const [enteredName, setEnteredName] = useState('');
  const [enteredNameTouched, setEnteredNameTouched] = useState(false);
  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredEmailTouched, setEnteredEmailTouched] = useState(false);

  // It set as a state before, but configure to a var for clean code structure.
  const enteredNameIsValid = enteredName.trim() !== '';
  const nameInputIsInvalid = !enteredNameIsValid && enteredNameTouched;
  const enteredEmailIsValid = enteredEmail.includes('@');
  const emailInputIsInvalid = !enteredEmailIsValid && enteredEmailTouched;

  let formIsValid = false;
  if (enteredName && enteredEmailIsValid) {
    formIsValid = true;
  }

  // const [formIsValid, setFormIsValid] = useState(false);
  // useEffect(() => {
  //   // In a larger form, it should check all the inputs.
  //   if (enteredNameIsValid) {
  //     setFormIsValid(true);
  //   } else {
  //     setFormIsValid(false);
  //   }
  // }, [enteredNameIsValid]);

  const nameInputChangeHandler = (event) => {
    setEnteredName(event.target.value);
  };
  const emailInputChangeHandler = (event) => {
    setEnteredEmail(event.target.value);
  };

  const nameInputBlurHandler = (event) => {
    setEnteredNameTouched(true);
  };
  const emailInputBlurHandler = (event) => {
    setEnteredEmailTouched(true);
  };

  const formSubmissionHandler = (event) => {
    event.preventDefault();

    setEnteredNameTouched(true);
    setEnteredEmailTouched(true);

    if (!enteredNameIsValid && !enteredEmailIsValid) {
      return;
    }

    // Method 1: check with every keystroke (instance validation)
    // Also better when need to reset the input after submit.
    // console.log(enteredName);

    // Method 2: better if only interested when the form is submitted
    // const enteredValue = nameInputRef.current.value;
    // console.log(enteredValue);

    // Reach out of React to manipulate the HTML directly, not a good way.
    // nameInputRef.current.value = '';
    setEnteredName('');
    setEnteredEmail('');
    // Once it is submitted, it should be untouched again.
    setEnteredNameTouched(false);
    setEnteredEmailTouched(false);
  };

  const nameInputClasses = nameInputIsInvalid
    ? 'form-control invalid'
    : 'form-control';

  const emailInputClasses = emailInputIsInvalid
    ? 'form-control invalid'
    : 'form-control';

  return (
    <form onSubmit={formSubmissionHandler}>
      <div className={nameInputClasses}>
        <label htmlFor="name">Your Name</label>
        <input
          // ref={nameInputRef}
          type="text"
          id="name"
          onChange={nameInputChangeHandler}
          onBlur={nameInputBlurHandler}
          value={enteredName}
        />
        {nameInputIsInvalid && (
          <p className="error-text">Name must not be empty.</p>
        )}
      </div>
      <div className={emailInputClasses}>
        <label htmlFor="email">Your E-mail</label>
        <input
          type="email"
          id="name"
          onChange={emailInputChangeHandler}
          onBlur={emailInputBlurHandler}
          value={enteredEmail}
        />
        {emailInputIsInvalid && (
          <p className="error-text">Please enter a valid Email.</p>
        )}
      </div>
      <div className="form-actions">
        <button disabled={!formIsValid}>Submit</button>
      </div>
    </form>
  );
};
```

## Customized Hook for user input

- Keep in mind: the hook should be generalized! It must could adapted into every input.
- Receive validator function.
- The BasicForm.js is not implemented, but the method is the same as in SimpleInput.js

```jsx
const initialInputState = {
  value: '',
  isTouched: false,
};

const inputStateReducer = (state, action) => {
  switch (action.type) {
    case 'INPUT':
      return { value: action.value, isTouched: state.isTouched };
    case 'BLUR':
      return { value: state.value, isTouched: true };
    // case 'RESET':
    //   return { value: '', isTouched: false };
    default:
      return initialInputState;
  }
};

const useInput = (validateValue) => {
  const [inputState, dispatch] = useReducer(
    inputStateReducer,
    initialInputState
  );

  const valueIsValid = validateValue(inputState.value);
  const hasError = !valueIsValid && inputState.isTouched;

  const valueChangeHandler = (event) => {
    dispatch({ type: 'INPUT', value: event.target.value });
  };

  const inputBlurHandler = (event) => {
    dispatch({ type: 'BLUR' });
  };

  const reset = () => {
    dispatch();
  };

  return {
    value: inputState.value,
    isValid: valueIsValid,
    hasError,
    valueChangeHandler,
    inputBlurHandler,
    reset,
  };
};

export default useInput;
```

### Formik
