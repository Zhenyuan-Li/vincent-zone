---
title: 'Custom React Hooks'
date: '2022-1-11'
image: interface.png
excerpt: Tired of repeating logic at different component, such as handling Http request? Build you own customized hooks by going through two small demo application - Counter & Tasker.
isFeatured: true
---

This is a note for [a great React course](https://www.udemy.com/course/react-the-complete-guide-incl-redux/) on Udemy developed by [Maximilian Schwarzmüller](https://www.udemy.com/user/maximilian-schwarzmuller/)

# Demo 6: Counter & Tasker (Custom Hooks)

[Completed code in Github Repository](https://github.com/Zhenyuan-Li/Udemy-React-v2.0/tree/main/6_Counter_and_Tasker)

## Introduction

- Outsource stateful logic into re-usable functions.

  Unlike "regular functions", custom hooks can use other React hooks and React state.

- Use customized hook does not mean we share state or effects across components. Just share the logic, not concrete state.

## Intuitive Example: Counter

- The only difference of Backward and forward is + and -. Use custom hook to get rid of code duplication.
- Always name hook with 'use-xx.js'
- Return the needed var, and accepted needed var like normal functions.

```jsx
import { useState, useEffect } from 'react';

const useCounter = (forwards = true) => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      forwards
        ? setCounter((prevCounter) => prevCounter + 1)
        : setCounter((prevCounter) => prevCounter - 1);
    }, 1000);

    return () => clearInterval(interval);
    // That's potential bugs mentioned at 5, useCallback() use case.
  }, [forwards]);

  return counter;
};

export default useCounter;
```

```jsx
import useCounter from '../hooks/use-counter';

const ForwardCounter = () => {
  const counter = useCounter();

  return <Card>{counter}</Card>;
};

export default ForwardCounter;
```

## Realistic Example: Tasker

Both HTTP request feature has similar pattern (**fetchTasks() in App.js** & **enterTaskHandler() in NewTask.js**): isLoading, error, send request logic...

But since both of them involves hooks (useState, useEffect), normal function to remove duplication can not work.

useHttp customized hooks is a very typical customized hook example.

```jsx
import { useCallback, useState } from 'react';

const useHttp = (applyData) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(
    async (requestConfig) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(requestConfig.url, {
          method: requestConfig.method ? requestConfig.method : 'GET',
          headers: requestConfig.headers ? requestConfig.headers : {},
          body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
        });

        if (!response.ok) {
          throw new Error('Request failed!');
        }
        const data = await response.json();

        applyData(data);
      } catch (err) {
        setError(err.message || 'Something went wrong!');
      }
      setIsLoading(false);
    },
    [applyData]
  );

  return { isLoading, error, sendRequest };
};

export default useHttp;
```

### Two way to avoid infinite loop

1. Wrap with useCallback().
   - Like stated in the previous, when **useEffect() in App.js**, we need to add fetchTasks() into dependency. But **sendRequest() in use-http.js** is depended on **transformTasks() in App.js**, which means infinite re-render loop exits.
   - To fix it, kind of a bottom-up approach:
     1. Wrap useCallback at **transformTasks()**(it depends on nothing)
     2. Wrap useCallback at **sendRequest()**, and add applyData to its dependency.
     3. add fetchTasks to useEffect() dependency.
   - Personally, it is the most complicated way, but it reserve the flexibility of customized hook.
2. Move received para down to return function.
   In this case, **requestConfig** is moved from **useHttp()** into **sendRequest()**. So useEffect() does not depend on that.
   </br> In this case, it is the better option, even applyData can be moved down to Comp.

```jsx
import React, { useEffect, useState, useCallback } from 'react';

import Tasks from './components/Tasks/Tasks';
import NewTask from './components/NewTask/NewTask';
import useHttp from './hooks/use-http';

function App() {
  const [tasks, setTasks] = useState([]);

  const transformTasks = useCallback((taskObj) => {
    const loadedTasks = [];
    for (const taskKey in taskObj) {
      loadedTasks.push({ id: taskKey, text: taskObj[taskKey].text });
    }
    setTasks(loadedTasks);
  }, []);

  const { isLoading, error, sendRequest: fetchTasks } = useHttp(transformTasks);

  useEffect(() => {
    fetchTasks({
      url: 'https://review-react-default-rtdb.firebaseio.com/tasks.json',
    });
  }, [fetchTasks]);

  const taskAddHandler = (task) => {
    setTasks((prevTasks) => prevTasks.concat(task));
  };

  return (
    <React.Fragment>
      <NewTask onAddTask={taskAddHandler} />
      <Tasks
        items={tasks}
        loading={isLoading}
        error={error}
        onFetch={fetchTasks}
      />
    </React.Fragment>
  );
}

export default App;
```
