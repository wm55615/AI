class Todo {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    this.term = "";
    this.draw();
  }

  save() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  get filteredTasks() {
    if (!this.term.trim()) return this.tasks;
    return this.tasks.filter(task =>
      task.name.toLowerCase().includes(this.term.toLowerCase())
    );
  }

  draw() {
    this.container.innerHTML = "";
    this.filteredTasks.forEach((task, index) => {
      const item = document.createElement("div");
      item.className = "task-item";

      const info = document.createElement("div");
      info.className = "task-info";

      const name = document.createElement("span");
      name.className = "task-name";

      let highlightedName = task.name;
      if (this.term.trim()) {
        const regex = new RegExp(`(${this.term})`, "gi");
        highlightedName = task.name.replace(regex, `<span class="highlight">$1</span>`);
      }
      name.innerHTML = highlightedName;

      const date = document.createElement("span");
      date.className = "task-date";
      date.textContent = task.date;

      info.append(name, date);

      const actions = document.createElement("div");

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.className = "delete-btn";
      editBtn.style.background = "#ffa500";
      editBtn.onclick = () => this.editTask(index);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.className = "delete-btn";
      deleteBtn.onclick = () => this.deleteTask(index);

      actions.append(editBtn, deleteBtn);
      item.append(info, actions);
      this.container.appendChild(item);
    });
  }

  addTask(name, date) {
    if (!name.trim()) return;
    this.tasks.push({ name, date });
    this.save();
    this.draw();
  }

  deleteTask(index) {
    const realIndex = this.tasks.indexOf(this.filteredTasks[index]);
    this.tasks.splice(realIndex, 1);
    this.save();
    this.draw();
  }

  editTask(index) {
    const realIndex = this.tasks.indexOf(this.filteredTasks[index]);
    const task = this.tasks[realIndex];

    const newName = prompt("Edytuj nazwę:", task.name);
    if (newName === null || !newName.trim()) return;

    const newDate = prompt("Edytuj datę (RRRR-MM-DD):", task.date);
    if (newDate) task.date = newDate;

    task.name = newName.trim();
    this.save();
    this.draw();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const todo = new Todo(".task-list");
  const form = document.querySelector("form");
  const nameInput = form.querySelector("input[type='text']");
  const dateInput = form.querySelector("input[type='date']");
  const searchInput = document.querySelector(".search-bar input");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    todo.addTask(nameInput.value, dateInput.value);
    form.reset();
  });

  searchInput.addEventListener("input", () => {
    todo.term = searchInput.value;
    todo.draw();
  });

  window.todo = todo;
});
