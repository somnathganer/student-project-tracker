const STORAGE_KEY = "workshop-projects-v1";

let projects = [];
let editingId = null;
let storageAvailable = true;

const projectForm = document.getElementById("project-form");
const nameInput = document.getElementById("name");
const statusInput = document.getElementById("status");
const projectList = document.getElementById("project-list");
const emptyState = document.getElementById("empty-state");
const saveButton = document.getElementById("save-button");
const cancelButton = document.getElementById("cancel-button");

// Validate the saved project collection
function isValidProjects(data) {
  return (
    Array.isArray(data) &&
    data.every(
      (project) =>
        project &&
        typeof project.id === "string" &&
        project.id.trim() !== "" &&
        typeof project.name === "string" &&
        project.name.trim() !== "" &&
        typeof project.status === "string"
    ) &&
    new Set(data.map((project) => project.id)).size === data.length
  );
}

// Load projects without overwriting invalid stored data
function loadProjects() {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (savedData === null) {
      projects = [];
      return;
    }

    const parsedData = JSON.parse(savedData);

    if (!isValidProjects(parsedData)) {
      storageAvailable = false;
      showStorageMessage(
        "Saved project data is invalid. It has not been overwritten. " +
        "Your saved records may need to be repaired."
      );
      return;
    }

    projects = parsedData;
  } catch (error) {
    storageAvailable = false;
    showStorageMessage(
      "Could not read saved projects. Your stored data has not been overwritten."
    );
  }
}

// Display storage errors without crashing the app
function showStorageMessage(message) {
  let messageElement = document.getElementById("storage-message");

  if (!messageElement) {
    messageElement = document.createElement("p");
    messageElement.id = "storage-message";
    messageElement.setAttribute("role", "alert");
    projectForm.insertAdjacentElement("afterend", messageElement);
  }

  messageElement.textContent = message;
}

// Save the current collection
function saveProjects() {
  if (!storageAvailable) {
    showStorageMessage(
      "Changes could not be saved because saved data could not be loaded safely."
    );
    return false;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));

    const messageElement = document.getElementById("storage-message");
    if (messageElement) messageElement.textContent = "";

    return true;
  } catch (error) {
    showStorageMessage(
      "Changes could not be saved. Browser storage may be unavailable or full."
    );
    return false;
  }
}

// Render all projects
function renderProjects() {
  projectList.replaceChildren();

  emptyState.hidden = projects.length > 0;

  projects.forEach((project) => {
    const item = document.createElement("li");
    const title = document.createElement("p");
    const status = document.createElement("p");
    const editButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    title.textContent = project.name;
    status.textContent = `Status: ${project.status}`;

    editButton.type = "button";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => {
      editProject(project.id);
    });

    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      deleteProject(project.id);
    });

    item.append(title, status, editButton, deleteButton);
    projectList.appendChild(item);
  });
}

// Start editing a project by its stable ID
function editProject(id) {
  const project = projects.find((item) => item.id === id);
  if (!project) return;

  editingId = project.id;
  nameInput.value = project.name;
  statusInput.value = project.status;

  saveButton.textContent = "Save changes";
  cancelButton.hidden = false;
}

// Reset the form to Add mode
function resetForm() {
  projectForm.reset();
  editingId = null;
  saveButton.textContent = "Add Project";
  cancelButton.hidden = true;
}

// Cancel editing without changing stored records
cancelButton.type = "button";
cancelButton.addEventListener("click", resetForm);

// Delete a project after confirmation
function deleteProject(id) {
  const project = projects.find((item) => item.id === id);
  if (!project) return;

  const confirmed = window.confirm(
    `Are you sure you want to delete "${project.name}"?`
  );

  if (!confirmed) return;

  const index = projects.findIndex((item) => item.id === id);
  if (index === -1) return;

  const removedProject = projects.splice(index, 1)[0];

  // If saving fails, restore the collection
  if (!saveProjects()) {
    projects.splice(index, 0, removedProject);
    renderProjects();
    return;
  }

  // Reset the form if the deleted project was being edited
  if (editingId === id) {
    resetForm();
  }

  renderProjects();
}

// Add a new project or update an existing one
projectForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const status = statusInput.value;

  if (!name) {
    alert("Please enter a project name.");
    nameInput.focus();
    return;
  }

  if (editingId !== null) {
    const project = projects.find((item) => item.id === editingId);

    if (!project) {
      alert("Project not found. Please try again.");
      resetForm();
      return;
    }

    const oldName = project.name;
    const oldStatus = project.status;

    project.name = name;
    project.status = status;

    if (!saveProjects()) {
      project.name = oldName;
      project.status = oldStatus;
      renderProjects();
      return;
    }
  } else {
    const newProject = {
      id: crypto.randomUUID(),
      name,
      status
    };

    projects.push(newProject);

    if (!saveProjects()) {
      projects.pop();
      renderProjects();
      return;
    }
  }

  resetForm();
  renderProjects();
});

// Load saved data before displaying the list
loadProjects();
renderProjects();