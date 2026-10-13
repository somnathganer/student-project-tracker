const projects = [];

// Remembers which project is being edited (null means Add mode)
let editingId = null;

// Get the HTML elements
const projectForm = document.querySelector("#project-form");
const nameInput = document.querySelector("#name");
const statusInput = document.querySelector("#status");
const saveButton = document.querySelector("#save-button");
const cancelButton = document.querySelector("#cancel-button");
const projectList = document.querySelector("#project-list");
const emptyState = document.querySelector("#empty-state");

const ADD_BUTTON_TEXT = "Save Project";
const EDIT_BUTTON_TEXT = "Save changes";

cancelButton.textContent = "Cancel edit";

// Put the form back into Add mode
function resetToAddMode() {
  editingId = null;
  projectForm.reset();
  saveButton.textContent = ADD_BUTTON_TEXT;
  cancelButton.hidden = true;
}

// Fill the form with a project's values and switch to Edit mode
function startEditing(projectId) {
  const project = projects.find((item) => item.id === projectId);

  if (!project) {
    return;
  }

  editingId = project.id;
  nameInput.value = project.name;
  statusInput.value = project.status;
  saveButton.textContent = EDIT_BUTTON_TEXT;
  cancelButton.hidden = false;
  nameInput.focus();
}

// Delete one project (found by its id) after the user confirms
function deleteProject(projectId) {
  const index = projects.findIndex((item) => item.id === projectId);

  if (index === -1) {
    return;
  }

  const project = projects[index];
  const confirmed = window.confirm(
    `Delete "${project.name}" (${project.status})?`
  );

  // Cancel leaves the projects unchanged
  if (!confirmed) {
    return;
  }

  projects.splice(index, 1);

  // If the deleted project was being edited, go back to Add mode
  if (editingId === projectId) {
    resetToAddMode();
  }

  renderProjects();
}

// Display all projects
function renderProjects() {
  projectList.innerHTML = "";

  projects.forEach((project) => {
    const projectItem = document.createElement("li");

    const projectName = document.createElement("span");
    projectName.textContent = project.name;

    const projectStatus = document.createElement("span");
    projectStatus.textContent = ` — ${project.status}`;

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", function () {
      startEditing(project.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function () {
      deleteProject(project.id);
    });

    projectItem.appendChild(projectName);
    projectItem.appendChild(projectStatus);
    projectItem.appendChild(editButton);
    projectItem.appendChild(deleteButton);

    projectList.appendChild(projectItem);
  });

  // Update the empty-state message if it exists
  if (emptyState) {
    emptyState.hidden = projects.length > 0;
  }
}

// Add a new project, or update the selected one, when the form is submitted
projectForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const status = statusInput.value;

  // Reject an empty project name
  if (name === "") {
    nameInput.focus();
    return;
  }

  if (editingId === null) {
    // Add mode: create and add a new project
    const project = {
      id: crypto.randomUUID(),
      name: name,
      status: status,
    };

    projects.push(project);
  } else {
    // Edit mode: update the selected project, keeping the same id
    const project = projects.find((item) => item.id === editingId);

    if (project) {
      project.name = name;
      project.status = status;
    }
  }

  // Refresh the displayed list
  renderProjects();

  // Clear the form fields and return to Add mode
  resetToAddMode();
});

// Cancel editing without changing any project
cancelButton.addEventListener("click", function () {
  resetToAddMode();
});

// Show the initial empty list
renderProjects();