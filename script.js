let tasks = [];

// Load tasks from localStorage when page opens
document.addEventListener("DOMContentLoaded", loadTasks);

// Handle form submission
document.getElementById("taskForm").addEventListener("submit", function(e) {
    e.preventDefault();
    addTask();
});

function addTask() {
    const input = document.getElementById("taskInput");
    if (!input.value.trim()) return;

    const newTask = {
        id: Date.now(),
        text: input.value,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    input.value = "";
}

function editTask(id) {
    const newText = prompt("Edit your task:");
    if (!newText || !newText.trim()) return;

    tasks = tasks.map(task => 
        task.id === id ? { ...task, text: newText } : task
    );

    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

function toggleComplete(id) {
    tasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );

    saveTasks();
    renderTasks();
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const stored = localStorage.getItem("tasks");
    if (stored) tasks = JSON.parse(stored);
    renderTasks();
}

function renderTasks() {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.className = "task" + (task.completed ? " completed" : "");

        li.innerHTML = `
            <span>${task.text}</span>
            <div class="task-buttons">
                <button class="complete-btn" onclick="toggleComplete(${task.id})">✔</button>
                <button class="edit-btn" onclick="editTask(${task.id})">✎</button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">🗑</button>
            </div>
        `;

        list.appendChild(li);
    });
}

/* ========================
   EXPORT TASKS (.TXT)
======================== */
document.getElementById("exportBtn").addEventListener("click", function() {
    const data = tasks.map(t => (t.completed ? "[x] " : "[ ] ") + t.text).join("\n");
    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "tasks.txt";
    a.click();

    URL.revokeObjectURL(url);
});

/* ========================
   IMPORT TASKS (.TXT)
======================== */
document.getElementById("importBtn").addEventListener("click", () => {
    document.getElementById("importFile").click();
});

document.getElementById("importFile").addEventListener("change", function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const lines = e.target.result.split("\n").filter(l => l.trim() !== "");
        tasks = lines.map(line => {
            const completed = line.startsWith("[x]");
            const text = line.slice(4).trim();
            return { id: Date.now() + Math.random(), text, completed };
        });

        saveTasks();
        renderTasks();
        alert("Tasks imported successfully!");
    };
    reader.readAsText(file);
});
