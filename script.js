//create array to store todo items
let todoItems = [];
//function to create new todo items and render on the page
function renderTodo(todo){
    //store todo items into the browser storage
    localStorage.setItem("todoItems", JSON.stringify(todoItems));
    //get reference of required elements
    const list = document.querySelector(".js-todo-list");
    const item = document.querySelector(`[data-key='${todo.id}']`);
    //Runs a check for deleted items and update the DOM
    if(todo.deleted){
        item.remove();
        if(todoItems.length === 0)list.innerHTML = "";
        return;
    }
    //Evaluate the state of a todo entry
    const isChecked = todo.checked ? "done" : "";
    //create a list item that holds todo entry
    const listItemElement = document.createElement("li");
    //set class and data-key attribute to the todo entry
    listItemElement.setAttribute("class", `todo-item ${isChecked}`);
    listItemElement.setAttribute("data-key", todo.id);
    //populate the todo entry with required values
    listItemElement.innerHTML = `<input id="${todo.id}" type="checkbox"/>
    <label for="${todo.id}" class="tick js-tick"></label>
    <span>${todo.text}</span>
    <button class="delete-todo js-delete-todo">
    &times;
    </button>
    `;
    //Run condition to append the created item to the page
    if(item){
        list.replaceChild(listItemElement, item);
    }else{
        list.append(listItemElement);
    }
}
// Define function to create new todo entry 
function addTodo(text){
    //Define todo entry object structure
    const todo = {
        text, checked: false, id:Date.now(),
    };
    // add new todo entry to the array collection
    todoItems.push(todo);
    //Trigger page update by invoking the render todo function
    renderTodo(todo);
}
//Get reference of todo entry form
const form = document.querySelector(".js-form");
//Bind an event listener on form submission
form.addEventListener("submit",(event) => {
    //prevent default behaviour of form submission
    event.preventDefault();
    //get reference of the imputbelemt
    const input = document.querySelector(".js-todo-input");
//remove white space on both end of a todo entry string
    const text = input.value.trim();
    //check for empty value and create todo item
    if(text !==""){
        //invoke addTodo function to commit change
        addTodo(text);
        //reset the value of the input element
        input.value = "";
        //set focus to the imput element
        input.focus(); 
    }
});
//Define function to toggle the DOM state of a todo entry
function toggleDone(key){
    //retrieve the index of the todo entry in the collection
    const index = todoItems.findIndex((item) => item.id === Number(key));
    //toggle the checked attribute value of the todo entry
    todoItems[index].checked = !todoItems[index].checked;
    //Trigger Page update by invoking the renderTodo function
    renderTodo(todoItems[index]);
}
//Define funtion to delete a todo entry
function deleteTodo(key){
    //retrieve the index of the todo entry in the collection
    const index = todoItems.findIndex((item) => item.id === Number(key));
    //todoItems[index].checked = !todoItems[index].checked;
    //set delete attribute to true for the todo entry
    const todo = {
        deleted: true,
        ... todoItems[index],
    };
   todoItems = todoItems.filter((item) => item.id !== Number(key));
   // Trigger Page update by invoking the renderTodo function
   renderTodo(todo);
}
//get reference of the ul elements
const list = document.querySelector(".js-todo-list");
//Bind click event Listener to ul element
list.addEventListener("click", (event) => {
    //traverse the DOM to check for classname "js-tick" and invoke the toggleDone function if check returns true
    if(event.target.classList.contains("js-tick")){
        //retrieve the data key attribute value
        const itemKey = event.target.parentElement.dataset.key;
        //invoke toggleDone function to update toggleDone entry state
        toggleDone(itemKey);
    }
    //traverse the DOM to check for classname "js-delete.to" and invoke the delete todo function if check returns true 
     if(event.target.classList.contains("js-delete-todo")){
         //retrieve the data key attribute value
        const itemKey = event.target.parentElement.dataset.key;
        //invoke deleteTodo function to delete todo entry
        deleteTodo(itemKey);
    }
});
//Bind event listener of DOM content loaded to document object
document.addEventListener("DOMContentLoaded",() => {
    //get stored todo entry from browser local storage
    const ref = localStorage.getItem("todoItems");
    //check that there are entries in the local storage
    if(ref){
        //convert todo entries to an array collection
        todoItems = JSON.parse(ref);
        //iterate through the collection and update the webpage
        todoItems.forEach((t) => {
            renderTodo(t);
        });
    }
});
