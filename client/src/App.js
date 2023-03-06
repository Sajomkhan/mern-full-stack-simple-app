import {useState, useEffect} from 'react'

const BASE_URL = "https://mern-stack-todos-app.onrender.com";
// const BASE_URL = "http://localhost:3001";

function App() {
  const[todos, setTodos] = useState([]);
  const[popupActive, setPopupActive] = useState(false);
  const[newTodo, setNewTodo] = useState("");

  useEffect(() => {
		GetTodos();
	}, []);

	const GetTodos = () => {
		fetch(BASE_URL + '/todos')
			.then(res => res.json())
			.then(data => setTodos(data))
			.catch((err) => console.error("Error: ", err));
	}

  const completeTodo = async (id) => {
    const data = await fetch(BASE_URL + '/todo/complete/' + id)
    .then(res => res.json());

    setTodos(todos => todos.map(todo => {
      if(todo._id === data._id){
        todo.complete = data.complete;
      }
      return todo
    }))
  }

  const deleteTodo = async (id) => {
    const data = await fetch(BASE_URL + '/todo/delete/' + id, {method: "DELETE"})
    .then(res => res.json());

	setTodos(todos => todos.filter(todo => todo._id !== data._id))
  }
  const addTodo = async () => {
    const data = await fetch(BASE_URL + '/todo/new/', {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			text: newTodo,
		})
	}).then(res => res.json());

	setTodos([...todos, data]);
	setPopupActive(false);
	setNewTodo("");
  }

  popupActive && (onkeyup = (e) => {
		if(e.keyCode === 13){
			addTodo()
		}
	})

  return (
		<div className="App">
			<h1>Welcome, Saiful Ajom Khan</h1>
			<h4>Your tasks</h4>

			<div className="todos">
				{todos.length > 0 ? todos.map(todo => (
					<div 
          className={"todo" + (todo.complete ? " is-complete" : "")} 
          key={todo._id} 
          onClick = {() => completeTodo(todo._id)}
          >
						<div className="checkbox"></div>

						<div className="text">{todo.text}</div>

						<div className="delete-todo" onClick={() => deleteTodo(todo._id)}>x</div>
					</div>
				)) : (
					<p>You currently have no tasks</p>
				)}
				<div className="addPopup" onClick={() => setPopupActive(true)}>Add Task</div>
			</div>


			{popupActive ? (
				<div className="popup">
					<div className="closePopup" onClick={() => setPopupActive(false)} >X</div>
					<div className="content">
						<h3>Add Task</h3>
						<input type="text" className="add-todo-input" onChange={e => setNewTodo(e.target.value)} value={newTodo} />
						<div className="button" onClick={addTodo}>Create Task</div>
					</div>
				</div>
			) : ''}
		</div>
	);
}

export default App;
