---
title: Styling in React
excerpt: Sometimes Style in React is easy but too much options. Learn three styling options by going through a demo application - Course Goal.
image: interface.png
isFeatured: true
date: '2022-1-9'
---

This is a note for [a great React course](https://www.udemy.com/course/react-the-complete-guide-incl-redux/) on Udemy developed by [Maximilian Schwarzmüller](https://www.udemy.com/user/maximilian-schwarzmuller/)

# Demo 2: Course Goal (Styling in React)

[Completed code in Github Repository](https://github.com/Zhenyuan-Li/Udemy-React-v2.0/tree/main/2_Course_Goal)

## Traditional using CSS

- Each CSS file is in global scope (available in entire project).
- The naming might clash when the project involves many developers. (Even with BEM)

## 1) Inline style

- Highest priority, could override accidentally. Not recommended in most scenario

```jsx
<label style={{ color: !isValid ? 'red' : 'black' }}>Course Goal</label>
<input type="text" onChange={goalInputChangeHandler}
style={{ borderColor: !isValid ? 'red' : 'black',
        backgroundColor: !isValid ? 'salmon' : 'transparent'}}/>
```

## 2) Modify the className

- Good approach but still not fix the global issues
- Sometimes code might get messy

```jsx
<div className={`form-control ${!isValid ? 'invalid' : ''}`}>
  <label>Course Goal</label>
  <input type="text" onChange={goalInputChangeHandler} />
</div>
```

## 3) Styled-Components

- Used by many company, css in js, dynamic and easy to modify
- Styling mixed with component logic is not neat for somebody

```jsx
const FormControl = styled.div`
  margin: 0.5rem 0;

  & label {
    font-weight: bold;
    display: block;
    margin-bottom: 0.5rem;
    color: ${(props) => (props.invalid ? 'red' : 'black')};
  }

  & input {
    display: block;
    width: 100%;
    border: 1px solid ${(props) => (props.invalid ? 'red' : '#ccc')};
    background: ${(props) => (props.invalid ? '#ffd7d7' : 'transparent')};
    font: inherit;
    line-height: 1.5rem;
    padding: 0 0.25rem;
  }

  & input:focus {
    outline: none;
    background: #fad0ec;
    border-color: #8b005d;
  }
`;

// Extra: Without Dynamic rendering(just add the className)
// Extra:<FormControl className={!isValid && 'invalid'}>
<FormControl invalid={!isValid}>
  <label>Course Goal</label>
  <input type="text" onChange={goalInputChangeHandler} />
</FormControl>;
```

## 4) CSS Modules

- Best option personally, but need to configure ahead, luckily create-react-app already did that
- Add .module to css file name; import styles from .module.css.; use styles.className at target

```jsx
import styles from './Button.module.css';

const Button = (props) => {
  return (
    <button type={props.type} className={styles.button} onClick={props.onClick}>
      {props.children}
    </button>
  );
};
```
