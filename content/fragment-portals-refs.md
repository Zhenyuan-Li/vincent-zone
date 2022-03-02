---
title: Fragments, Portals and Refs
excerpt: Modal makes root HTML file messy? Need Wrapper rather than <div></div>?... Get familiar with some handful react feature by going through a demo application - Simple User.
image: interface.png
isFeatured: true
date: '2022-1-10'
---

This is a note for [a great React course](https://www.udemy.com/course/react-the-complete-guide-incl-redux/) on Udemy developed by [Maximilian Schwarzmüller](https://www.udemy.com/user/maximilian-schwarzmuller/)

# Demo 3: Simple User (Fragments, Portals, Refs)

[Completed code in Github Repository](https://github.com/Zhenyuan-Li/Udemy-React-v2.0/tree/main/3_Simple_User)

## Fragment

It's an empty wrapper Component.

It doesn't render any real HTML element to the DOM. But it fulfills React's/JSX requirement.

```jsx
import Fragment from 'react';
return (
  <Fragment>
    <AddUser onAddUser={addUserHandler} />
    <UsersList users={usersList} />
  </Fragment>
);
```

### Limitation of JSX

- Cannot return more than one "root" JSX element. (Because of React.createElement)

  **Solution**: Always Wrap Adjacent Element.

- Another problem: "div soup". In bigger app, tons of unnecessary div wrapper.

  **Solution**: Using Wrapper Comp.

```jsx
const Wrapper = (props) => props.children;

export default Wrapper;
```

## Portals

- Modal(Side-drawer, Dialogs...) Problem:
  Semantically and from a "Clean HTML" perspective, having a nested modal isn't ideal. It is an overlay to the entire page after all.

  p.s. div with onClick event: work but not a good practice.

  **Solution**: Portal(render the modal at specific position in HTML).

```html
<!-- In index.html -->
<body>
  <div id="backdrop-root"></div>
  <div id="overlay-root"></div>
  <div id="root"></div>
</body>
```

```jsx
const ErrorModal = (props) => {
  const { onConfirm, title, message } = props;

  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop onConfirm={onConfirm} />,
        document.getElementById('backdrop-root')
      )}
      {ReactDOM.createPortal(
        <ModalOverlay title={title} message={message} onConfirm={onConfirm} />,
        document.getElementById('overlay-root')
      )}
    </>
  );
};
```

## "ref": the second hook

- Allows us to get access to other DOM elements (Shorten the state-based input handler)
- Two way to handle the user input:

### useRef() (uncontrolled component) **AddUser.js**

Only use it to read the data. Never manipulate DOM directly using it.

```jsx
// Use only for read value. Leave the manipulating staff to React
const nameInputRef = useRef();
const ageInputRef = useRef();
const addUserHandler = (event) => {
  // We don't need the state to get access to user input (state-based solution)
  const enteredName = nameInputRef.current.value;
  const enteredUserAge = ageInputRef.current.value;
  const [error, setError] = useState();

  const addUserHandler = (event) => {
    event.preventDefault();
    props.onAddUser(enteredName, enteredUserAge);
    // Important: Rarely do that !
    // Do not use ref to manipulate the DOM
    nameInputRef.current.value = '';
    ageInputRef.current.value = '';
  };
};
return (
  <form onSubmit={addUserHandler}>
    <label htmlFor="username">Username</label>
    <input id="username" type="text" ref={nameInputRef} />
    <label htmlFor="age">Age (Years)</label>
    <input id="age" type="number" ref={ageInputRef} />
    <Button type="submit">Add User</Button>
  </form>
);
```

### state-based tracker (controlled component)

```jsx
const [enteredUsername, setEnteredUsername] = useState('');
const [enteredAge, setEnteredAge] = useState('');

return (
  <form onSubmit={addUserHandler}>
    <label htmlFor="username">Username</label>
    <input
      id="username"
      type="text"
      value={enteredUsername}
      onChange={usernameChangeHandler}
    />
    <label htmlFor="age">Age (Years)</label>
    <input
      id="age"
      type="number"
      value={enteredAge}
      onChange={ageChangeHandler}
    />
    <Button type="submit">Add User</Button>
  </form>
);
```
