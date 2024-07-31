


/**
 * Import
 */
import { Tooltip } from "./Tooltip.js";
import { activenotebook, makeElemEditable } from "../utils.js";
import { db } from "../db.js";
import { client } from "../client.js";
import { DeleteConfirmModal } from "./Modal.js";


const /** {HTMLElement} */ $notePanelTitle = document.querySelector('[data-note-panel-title]');


/**
 * Creates a navigation item representing a notebook. This item displays the notebook's name, allows editing
 * and deletion of the notebook, and handles click events to display its associated notes.
 *
 * @param {string} id - The unique identifier of the notebook.
 * @param {string} name - The name of the notebook.
 * @returns {HTMLElement} - An HTML element representing the navigation item for the notebook.
 */
export const NavItem = function (id, name) {

  const /** {HTMLElement} */ $navItem = document.createElement('div');
  $navItem.classList.add('nav-item');
  $navItem.setAttribute('data-notebook', id);

  $navItem.innerHTML = `
    <span class="text text-label-large" data-notebook-field>${name}</span>

    <button class="icon-btn small" aria-label="Edit notebook" data-tooltip="Edit name" data-edit-btn >
      <img class="edit-icon" src="./src/images/edit-space.svg" alt="edit notebook">
    </button>

    <button class="icon-btn small" aria-label="Delete space" data-tooltip="Delete space" data-delete-btn >
      <img class="delete-icon" src="./src/images/trash-icon.svg" alt="delete space">
    </button>
    

    <div class="state-layer"></div>
  `;

  // Show tooltip on edit and delete button
  const /** {Array<HTMLElement>} */ $tooltipElems = $navItem.querySelectorAll('[data-tooltip]');
  $tooltipElems.forEach($elem => Tooltip($elem));


  /**
   * Handles the click event on the navigation item. Updates the note panel's title, retrieves the associated notes,
   * and marks the item as active.
   */
  $navItem.addEventListener('click', function () {
    $notePanelTitle.textContent = name;
    activenotebook.call(this);

    const /** {Array} */ noteList = db.get.note(this.dataset.notebook);
    client.note.read(noteList);
  });


  /**
   * notebook edit functionality
   */
  const /** {HTMLElement} */ $navItemEditBtn = $navItem.querySelector('[data-edit-btn]');
  const /** {HTMLElement} */ $navItemField = $navItem.querySelector('[data-notebook-field]');
  $navItemEditBtn.addEventListener('click', makeElemEditable.bind(null, $navItemField));

  $navItemField.addEventListener('keydown', function (event) {

    if (event.key === 'Enter') {
      this.removeAttribute('contenteditable');

      // Update edited data in database
      const updatednotebookData = db.update.notebook(id, this.textContent);

      // Render updated notebook
      client.notebook.update(id, updatednotebookData);
    }

  });


  /**
   * notebook delete functionality
   */
  const /** {HTMLElement} */ $navItemDeleteBtn = $navItem.querySelector('[data-delete-btn]');
  $navItemDeleteBtn.addEventListener('click', function () {

    const /** {Object} */ modal = DeleteConfirmModal(name);

    modal.open();

    modal.onSubmit(function (isConfirm) {
      if (isConfirm) {
        db.delete.notebook(id);
        client.notebook.delete(id);
      }

      modal.close();
    });

  });

  return $navItem;
}