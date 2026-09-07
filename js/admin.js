function toggleSubMenu(button) {
  const group = button.closest('.nav-group');
  document.querySelectorAll('.nav-group').forEach(g => {
    if (g !== group) g.classList.remove('open');
  });
  group.classList.toggle('open');
}

function switchAdminView(viewKey) {
  const contentArea = document.getElementById('admin-content');
  
  switch(viewKey) {
    case 'projects-add':
      contentArea.innerHTML = `
        <h2>Add New Project</h2>
        <form class="form-container" onsubmit="event.preventDefault()">
          <div class="form-group">
            <label>Project Title</label>
            <input type="text" class="form-control" placeholder="e.g. Portfolio Redesign" required />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea class="form-control" rows="4" placeholder="Brief project summary..."></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Save Project</button>
        </form>`;
      break;

    case 'projects-manage':
      contentArea.innerHTML = `
        <h2>Manage & Sort Projects</h2>
        <p style="color: #94a3b8; margin-top: 0.25rem;">Drag items to reorder display sequence.</p>
        <ul class="sortable-list" id="projects-sort-list">
          <li class="sortable-item" draggable="true">
            <span>☰ E-Commerce Web App</span>
            <div class="item-actions">
              <button class="btn btn-secondary">Edit</button>
              <button class="btn btn-danger">Delete</button>
            </div>
          </li>
          <li class="sortable-item" draggable="true">
            <span>☰ SaaS Analytics Dashboard</span>
            <div class="item-actions">
              <button class="btn btn-secondary">Edit</button>
              <button class="btn btn-danger">Delete</button>
            </div>
          </li>
        </ul>`;
      initDragAndDrop('#projects-sort-list');
      break;

    case 'mcq-add':
      contentArea.innerHTML = `
        <h2>Add MCQ Question</h2>
        <form class="form-container" onsubmit="event.preventDefault()">
          <div class="form-group">
            <label>Question</label>
            <input type="text" class="form-control" placeholder="Enter question body" required />
          </div>
          <div class="form-group"><label>Option A</label><input type="text" class="form-control" required /></div>
          <div class="form-group"><label>Option B</label><input type="text" class="form-control" required /></div>
          <div class="form-group"><label>Option C</label><input type="text" class="form-control" required /></div>
          <div class="form-group"><label>Option D</label><input type="text" class="form-control" required /></div>
          <button type="submit" class="btn btn-primary">Save Question</button>
        </form>`;
      break;
  }
}

function initDragAndDrop(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  let draggedItem = null;

  container.addEventListener('dragstart', (e) => {
    draggedItem = e.target.closest('.sortable-item');
    if (draggedItem) draggedItem.classList.add('dragging');
  });

  container.addEventListener('dragend', () => {
    if (draggedItem) {
      draggedItem.classList.remove('dragging');
      draggedItem = null;
    }
  });

  container.addEventListener('dragover', (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(container, e.clientY);
    if (afterElement == null) {
      container.appendChild(draggedItem);
    } else {
      container.insertBefore(draggedItem, afterElement);
    }
  });
}

function getDragAfterElement(container, y) {
  const draggables = [...container.querySelectorAll('.sortable-item:not(.dragging)')];

  return draggables.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}
