const projects = [];

const projectForm = document.getElementById("project-form");
const nameInput = document.getElementById("name");
const statusInput = document.getElementById("status");
const projectList = document.getElementById("project-list");
const emptyState = document.getElementById("empty-state");

// Display every project currently stored in the array.
function renderProjects() {
  projectList.replaceChildren();

  projects.forEach((project) => {
    const listItem = document.createElement("li");
    const projectName = document.createElement("p");
    const projectStatus = document.createElement("p");

    projectName.textContent = project.name;
    projectStatus.textContent = project.status;

    listItem.append(projectName, projectStatus);
    projectList.appendChild(listItem);
  });

  if (emptyState) {
    emptyState.hidden = projects.length > 0;
  }
}

// Handle project submissions.
projectForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const status = statusInput.value;

  if (!name) {
    nameInput.value = "";
    nameInput.focus();
    return;
  }

  const project = {
    id: crypto.randomUUID(),
    name: name,
    status: status,
  };

  projects.push(project);

  renderProjects();

  projectForm.reset();
  nameInput.focus();
});