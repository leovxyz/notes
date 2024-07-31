

/**
 * Import module
 */
import { NavItem } from "./components/NavItem.js";
import { activenotebook } from "./utils.js";
import { Card } from "./components/Card.js";


const /** {HTMLElement} */ $sidebarList = document.querySelector('[data-sidebar-list]');
const /** {HTMLElement} */ $notePanelTitle = document.querySelector('[data-note-panel-title]');
const /** {HTMLElement} */ $notePanel = document.querySelector('[data-note-panel]');
const /** {Array<HTMLElement>} */ $noteCreateBtns = document.querySelectorAll('[data-note-create-btn]');

const /** {string} */ emptyNotesTemplate = `

<div class="empty-notes">
  <img class="no-notes-img" src="./src/images/no-notes.svg" alt="delete notebook">

  <div class="no-notes-yet">There are no notes yet.</div>
</div>
`;


/**
 * Enables or disables "Create Note" buttons based on whether there are any notebooks.
 *
 * @param {boolean} isThereAnynotebook - Indicates whether there are any notebooks.
 */
const disableNoteCreateBtns = function (isThereAnynotebook) {
  $noteCreateBtns.forEach($item => {
    $item[isThereAnynotebook ? 'removeAttribute' : 'setAttribute']('disabled', '');
  });
}


/**
 * The client object manages interactions with the user interface (UI) to create, read, update, and delete notebooks and notes.
 * It provides functions for performing these operations and updating the UI accordingly.
 *
 * @namenotebook
 * @property {Object} notebook - Functions for managing notebooks in the UI.
 * @property {Object} note - Functions for managing notes in the UI.
 */
export const client = {

  notebook: {

    /**
     * Creates a new notebook in the UI, based on provided notebook data.
     *
     * @param {Object} notebookData - Data representing the new notebook.
     */
    create(notebookData) {
      const /** {HTMLElement} */ $navItem = NavItem(notebookData.id, notebookData.name);
      $sidebarList.appendChild($navItem);
      activenotebook.call($navItem);
      $notePanelTitle.textContent = notebookData.name;
      $notePanel.innerHTML = emptyNotesTemplate;
      disableNoteCreateBtns(true);
    },

    /**
     * Reads and displays a list of notebooks in the UI.
     *
     * @param {Array<Object>} notebookList - List of notebook data to display.
     */
    read(notebookList) {
      disableNoteCreateBtns(notebookList.length);

      notebookList.forEach((notebookData, index) => {
        const /** {HTMLElement} */ $navItem = NavItem(notebookData.id, notebookData.name);

        if (index === 0) {
          activenotebook.call($navItem);
          $notePanelTitle.textContent = notebookData.name;
        }

        $sidebarList.appendChild($navItem);
      });
    },

    /**
     * Updates the UI to reflect changes in a notebook.
     *
     * @param {string} notebookId - ID of the notebook to update.
     * @param {Object} notebookData - New data for the notebook.
     */
    update(notebookId, notebookData) {
      const /** {HTMLElement} */ $oldnotebook = document.querySelector(`[data-notebook="${notebookId}"`);
      const /** {HTMLElement} */ $newnotebook = NavItem(notebookData.id, notebookData.name);

      $notePanelTitle.textContent = notebookData.name;
      $sidebarList.replaceChild($newnotebook, $oldnotebook);
      activenotebook.call($newnotebook);
    },

    /**
     * Deletes a notebook from the UI.
     *
     * @param {string} notebookId - ID of the notebook to delete.
     */
    delete(notebookId) {
      const /** {HTMLElement} */ $deletednotebook = document.querySelector(`[data-notebook="${notebookId}"]`);
      const /** {HTMLElement | null} */ $activeNavItem = $deletednotebook.nextElementSibling ?? $deletednotebook.previousElementSibling;

      if ($activeNavItem) {
        $activeNavItem.click();
      } else {
        $notePanelTitle.innerHTML = '';
        $notePanel.innerHTML = '';
        disableNoteCreateBtns(false);
      }

      $deletednotebook.remove();
    }

  },

  note: {

    /**
     * Creates a new note card in the UI based on provided note data.
     *
     * @param {Object} noteData - Data representing the new note.
     */
    create(noteData) {
      // Clear 'emptyNotesTemplate' from 'notePanel' if there is no note exists
      if (!$notePanel.querySelector('[data-note]')) $notePanel.innerHTML = '';

      // Append card in notePanel
      const /** {HTMLElement} */ $card = Card(noteData);
      $notePanel.prepend($card);
    },

    /**
     * Reads and displays a list of notes in the UI.
     *
     * @param {Array<Object>} noteList - List of note data to display.
     */
    read(noteList) {

      if (noteList.length) {
        $notePanel.innerHTML = '';

        noteList.forEach(noteData => {
          const /** {HTMLElement} */ $card = Card(noteData);
          $notePanel.appendChild($card);
        });
      } else {
        $notePanel.innerHTML = emptyNotesTemplate;
      }

    },

    /**
     * Updates a note card in the UI based on provided note data.
     *
     * @param {string} noteId - ID of the note to update.
     * @param {Object} noteData - New data for the note.
     */
    update(noteId, noteData) {
      const /** {HTMLElement} */ $oldCard = document.querySelector(`[data-note="${noteId}"]`);
      const /** {HTMLElement} */ $newCard = Card(noteData);
      $notePanel.replaceChild($newCard, $oldCard);
    },

    /**
     * Deletes a note card from the UI.
     *
     * @param {string} noteId - ID of the note to delete.
     * @param {boolean} isNoteExists - Indicates whether other notes still exist.
     */
    delete(noteId, isNoteExists) {
      document.querySelector(`[data-note="${noteId}"]`).remove();
      if (!isNoteExists) $notePanel.innerHTML = emptyNotesTemplate;
    }

  }

}