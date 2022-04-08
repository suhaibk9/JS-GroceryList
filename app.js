// ****** SELECT ITEMS **********
const alert = document.querySelector(".alert");
const grocery = document.getElementById("grocery");
const form = document.querySelector(".grocery-form");
const clear = document.querySelector(".clear-btn");
const list = document.querySelector(".grocery-list");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
// edit option
let editFlag = false;
let editElement;
let editId = "";
// ****** EVENT LISTENERS **********
form.addEventListener("submit", addItem);
clear.addEventListener("click", clearItems);
//Intial Load
window.addEventListener("DOMContentLoaded", setUpItems);
// ****** FUNCTIONS **********
function addItem(e) {
  e.preventDefault();
  const value = grocery.value;
  const id = new Date().getTime().toString();
  if (value && !editFlag) {
    createListItem(id, value);
    displayAlert("Item added to list", "success");
    container.classList.add("show-container");
    addToLocalStorage(id, value);
    setBackToDefault();
  } else if (value && editFlag) {
    editElement.innerHTML = value;
    displayAlert("Edit Successful", "success");
    editLocalStorage(editId, value);
    setBackToDefault();
  } else {
    displayAlert("Empty Value", "danger");
    container.classList.remove("show-container");
  }
}
//Remove all items
function clearItems(e) {
  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) items.forEach((item) => list.removeChild(item));
  displayAlert("List Cleared", "danger");
  localStorage.removeItem("list");
  container.classList.remove("show-container");
  setBackToDefault();
}
//Alert
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  setTimeout(() => {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1500);
}
//Set everything back to default
function setBackToDefault() {
  grocery.value = "";
  editFlag = false;
  editId = "";
  submitBtn.textContent = "submit";
}
//Delete
function deleteItem(e) {
  e.preventDefault();
  list.removeChild(e.currentTarget.parentElement.parentElement);
  if (list.length === 0) {
    container.classList.remove("show-container");
  }
  displayAlert("Item Successfully Deleted", "danger");
  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  setBackToDefault();
  removeFromLocalStorage(
    e.currentTarget.parentElement.parentElement.dataset.id
  );
}
//edit
function editItem(e) {
  e.preventDefault();
  const ele = e.currentTarget.parentElement.parentElement;
  editElement = e.currentTarget.parentElement.previousElementSibling;
  grocery.value = editElement.innerHTML;
  editFlag = true;
  editId = ele.dataset.id;
  submitBtn.textContent = "edit";
}
// ****** LOCAL STORAGE **********
function addToLocalStorage(id, value) {
  const grocery = { id: id, value: value };
  let items = getLocalStorage();
  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
}
function removeFromLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter((item) => item.id !== id);
  localStorage.setItem("list", JSON.stringify(items));
}
function editLocalStorage(id, value) {
  let items = getLocalStorage();
  items.map((item) => {
    if (item.id === id) item.value = value;
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}
function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}
// ****** SETUP ITEMS **********
function setUpItems() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach((item) => createListItem(item.id, item.value));
    container.classList.add("show-container");
  }
}
function createListItem(id, value) {
  const ele = document.createElement("article");
  ele.classList.add("grocery-item");
  ele.setAttribute("data-id", id);
  ele.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <!-- edit btn -->
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <!-- delete btn -->
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;
  const deleteBtn = ele.querySelector(".delete-btn");
  const editBtn = ele.querySelector(".edit-btn");
  deleteBtn.addEventListener("click", deleteItem);
  editBtn.addEventListener("click", editItem);
  list.appendChild(ele);
}
