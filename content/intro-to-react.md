---
title: 'React Basics'
date: '2022-1-9'
image: interface.png
excerpt: React is a popular JavaScript library for building user interface. Refresh some basic React knowledge by going through a demo application - Expense Recorder.
isFeatured: true
---

This is a note for [a great React course](https://www.udemy.com/course/react-the-complete-guide-incl-redux/) on Udemy developed by [Maximilian Schwarzmüller](https://www.udemy.com/user/maximilian-schwarzmuller/)

# Demo 1: Expense Recorder

[Completed code in Github Repository](https://github.com/Zhenyuan-Li/Udemy-React-v2.0/tree/main/1_Expenses_Recorder)

## Main technique

1. Construct functional based component
2. Basic Usage of Component UI (Card)
3. First hook: useState()
4. Transfer data from parent to children (top to bottom): props
5. Transfer data from children to parent (bottom to top): create handler in parent, modify and update data in child.
6. Render a list of component (Array.map())
7. Conditional Rendering

## Notes

### Card.js:

Default variable in props: children, className

```jsx
function Card(props) {
  const { children, className } = props;
  const classes = `card ${className}`;

  // be careful on using this surrounding container UI :
  // pass the children and do not overwrite className;
  return <div className={classes}>{children}</div>;
}
```

### ExpenseForm.js:

Previous stage in useState() - when updated state depend on previous screenshot, normally happens on object or array type state.

```jsx
const [userInput, setUserInput] = useState({
  enteredTitle: '',
  enteredAmount: '',
  enteredDare: '',
});
const titleChangeHandler = (event) => {
  // if the update based on previous state make sure to use this approach
  setUserInput((prevState) => ({
    ...prevState,
    enteredTitle: event.target.value,
  }));
};
```

Two-way binding (input)

```jsx
<input
  type="text"
  time
  value="{enteredTitle}"
  onChange="{titleChangeHandler}"
/>
```

### NewExpense.js & ExpenseForm.js:

Bottom to top transfer example (also in **ExpensesFilter.js & Expenses.js**)

Conditional Rendering (simplify ternary expression using &&)

```jsx
function NewExpense(props) {
  const { onAddExpense } = props;
  const [isEditing, setIsEditing] = useState(false);

  // handle date bottom to up pattern (child to parent)
  const saveExpenseHandler = (enteredExpenseData) => {
    const expenseData = {
      ...enteredExpenseData,
      id: Math.random().toString(),
    };
    onAddExpense(expenseData);
    setIsEditing(false);
  };

  const startEditingHandler = () => {
    setIsEditing(true);
  };

  const stopEditingHandler = () => {
    setIsEditing(false);
  };

  return (
    <div className="new-expense">
      {!isEditing && (
        <button type="submit" onClick={startEditingHandler}>
          Add New Expense.
        </button>
      )}
      {isEditing && (
        <ExpenseForm
          onSaveExpenseData={saveExpenseHandler}
          onCancelExpenseData={stopEditingHandler}
        />
      )}
    </div>
  );
}
function ExpenseForm(props) {
  const { onSaveExpenseData, onCancelExpenseData } = props;
  const submitHandler = (event) => {
    event.preventDefault();

    const expenseData = {
      title: enteredTitle,
      amount: enteredAmount,
      date: new Date(enteredDate),
    };
    onSaveExpenseData(expenseData);
  };
  // ...
  // return ...
}
```

### ExpenseList.js

Conditional Rendering (early return)

List of Component example (also in **Chart.js**) - 8

```jsx
function ExpensesList(props) {
  const { items } = props;
  if (items.length === 0) {
    return <h2 className="expenses-list__fallback">Found no expenses.</h2>;
  }

  return (
    <ul className="expenses-list">
      {items.map((ele) => (
        <ExpenseItem
          title={ele.title}
          amount={ele.amount}
          date={ele.date}
          key={ele.id}
        />
      ))}
    </ul>
  );
}
```

### Expenses.js

The necessity of using key when rendering the list (performance & bugs).

```jsx
// Without the key: performance is bad, also bugs exists when involve state
// render the additional element at the end of div, and
// update the content inside of every div to match the array again.
// bugs: first element might be overwritten.
```
