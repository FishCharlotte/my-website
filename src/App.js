import React, { useState, useRef, useEffect } from "react";
import { nanoid } from "nanoid";
import './App.css';
import Todo from "./components/Todo";
import FilterButton from "./components/FilterButton";
import Form from "./components/Form";


function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}


const FILTER_MAP = {
    All: () => true,
    Active: (task) => !task.completed,
    Completed: (task) => task.completed
};
const FILTER_NAMES = Object.keys(FILTER_MAP);


function App(props) {
    // const [tasks, setTasks] = useState(props.tasks);
    const [tasks, setTasks] = useState(() => {
        const storedTasks = JSON.parse(localStorage.getItem('tasks'));
        return storedTasks || props.tasks;
    });
    const [filter, setFilter] = useState('All');

    function toggleTaskCompleted(id) {
        console.log(tasks);
        const updatedTasks = tasks.map((task) => {
            // if this task has the same ID as the edited task
            if (id === task.id) {
                // use object spread to make a new object
                // whose `completed` prop has been inverted
                return {...task, completed: !task.completed}
            }
            return task;
        });
        setTasks(updatedTasks);
        console.log(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }

    function deleteTask(id) {
        const remainingTasks = tasks.filter((task) => id !== task.id);
        setTasks(remainingTasks);
        localStorage.setItem('tasks', JSON.stringify(remainingTasks));
    }

    const taskList = tasks.filter(FILTER_MAP[filter]).map((task) => (
        <Todo
            id={task.id}
            name={task.name}
            completed={task.completed}
            key={task.id}
            toggleTaskCompleted={toggleTaskCompleted}
            deleteTask={deleteTask}
            editTask={editTask}
        />
    ));

    const filterList = FILTER_NAMES.map((name) => (
        <FilterButton
            key={name}
            name={name}
            isPressed={name === filter}
            setFilter={setFilter}
        />
    ));


    const tasksNoun = taskList.length !== 1 ? 'tasks' : 'task';  // 三目运算符
    const headingText = `${taskList.length} ${tasksNoun} remaining`;

    function addTask(name) {
        const newTask = { id: `todo-${nanoid()}`, name: name, completed: false };
        const newTasks = [...tasks, newTask];
        setTasks(newTasks);  // setTasks([...tasks, newTask]);
        localStorage.setItem('tasks', JSON.stringify(newTasks));
    }

    function editTask(id, newName) {
        const editedTaskList = tasks.map((task) => {
            // if this task has the same ID as the edited task
            if (id === task.id) {
                //
                return {...task, name: newName}
            }
            return task;
        });
        setTasks(editedTaskList);
        localStorage.setItem('tasks', JSON.stringify(editedTaskList));
    }

    const listHeadingRef = useRef(null);
    const prevTaskLength = usePrevious(tasks.length);
    useEffect(() => {
        if (tasks.length - prevTaskLength === -1) {
            listHeadingRef.current.focus();
        }
    }, [tasks.length, prevTaskLength]);


    return (
        <div className="todoapp stack-large">
            <h1>TODO List</h1>
            <Form addTask={addTask} />
            <div className="filters btn-group stack-exception">
                {filterList}
            </div>
            <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
                {headingText}
            </h2>
            <ul
                // role="list"
                className="todo-list stack-large stack-exception"
                aria-labelledby="list-heading"
            >
                {taskList}
            </ul>
        </div>
    );
}


export default App;
