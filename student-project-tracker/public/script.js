const form = document.getElementById('project-form');
const nameInput = document.getElementById('name');
const statusInput = document.getElementById('status');
const saveButton = document.getElementById('save-button');
const cancelButton = document.getElementById('cancel-button');
const projectList = document.getElementById('project-list');

let projects = [];
let editingId = null;

function renderProjects() {
  projectList.innerHTML = '';
  projects.forEach(project => {
    const li = document.createElement('li');
    li.textContent = `${project.name} - ${project.status} `;

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => startEdit(project.id));
    li.appendChild(editBtn);

    projectList.appendChild(li);
  });
}

function startEdit(id) {
  const project = projects.find(p => p.id === id);
  if (!project) return;
  editingId = id;
  nameInput.value = project.name;
  statusInput.value = project.status;
  saveButton.textContent = 'Save changes';
  cancelButton.style.display = 'inline';
}

function resetForm() {
  form.reset();
  editingId = null;
  saveButton.textContent = 'Add project';
  cancelButton.style.display = 'none';
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const status = statusInput.value.trim();
  if (!name) return;

  if (editingId) {
    const project = projects.find(p => p.id === editingId);
    if (project) {
      project.name = name;
      project.status = status;
    }
  } else {
    const newProject = {
      id: Date.now(),
      name: name,
      status: status
    };
    projects.push(newProject);
  }

  renderProjects();
  resetForm();
});

cancelButton.addEventListener('click', () => {
  resetForm();
});

renderProjects();