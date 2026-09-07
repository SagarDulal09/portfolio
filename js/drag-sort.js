function makeSortable(containerSelector, onReorderCallback) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  let draggedItem = null;

  container.querySelectorAll('.sortable-item').forEach(item => {
    item.setAttribute('draggable', 'true');
    
    item.addEventListener('dragstart', (e) => {
      draggedItem = item;
      item.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });

    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
      draggedItem = null;
      if (typeof onReorderCallback === 'function') {
        const newOrder = [...container.querySelectorAll('.sortable-item')].map(el => el.dataset.id);
        onReorderCallback(newOrder);
      }
    });
  });

  container.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
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
