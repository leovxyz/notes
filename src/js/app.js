

/**
 * Module import
 */

import {
  addEventOnElements,
  getGreetingMsg,
  activenotebook,
  makeElemEditable
} from "./utils.js";
import { Tooltip } from "./components/Tooltip.js";
import { db } from "./db.js";
import { client } from "./client.js";
import { NoteModal } from "./components/Modal.js";


/**
 * Toggle sidebar in small screen
 */

const /** {HTMLElement} */ $sidebar = document.querySelector('[data-sidebar]');
const /** {Array<HTMLElement>} */ $sidebarTogglers = document.querySelectorAll('[data-sidebar-toggler]');
const /** {HTMLElement} */ $overlay = document.querySelector('[data-sidebar-overlay]');

addEventOnElements($sidebarTogglers, 'click', function () {
  $sidebar.classList.toggle('active');
  $overlay.classList.toggle('active');
});


const /** {Array<HTMLElement>} */ $tooltipElems = document.querySelectorAll('[data-tooltip]');
$tooltipElems.forEach($elem => Tooltip($elem));


/**
 * Show greeting message on homepage
 */

const /** {HTMLElement} */ $greetElem = document.querySelector('[data-greeting]');
const /** {number} */ currentHour = new Date().getHours();
$greetElem.textContent = getGreetingMsg(currentHour);


/**
 * Show current date on homepage
 */

const /** {HTMLElement} */ $currentDateElem = document.querySelector('[data-current-date]');
$currentDateElem.textContent = new Date().toDateString().replace(' ', ', ');


/**
 * notebook create field
 */
const /** {HTMLElement} */ $sidebarList = document.querySelector('[data-sidebar-list]');
const /** {HTMLElement} */ $addnotebookBtn = document.querySelector('[data-add-notebook]');

/**
 * Shows a notebook creation field in the sidebar when the "Add notebook" button is clicked.
 * The function dynamically adds a new notebook field element, makes it editable, and listens for
 * the 'Enter' key to create a new notebook when pressed.
 */
const shownotebookField = function () {
  const /** {HTMLElement} */ $navItem = document.createElement('div');
  $navItem.classList.add('nav-item');

  $navItem.innerHTML = `
    <span class="text text-label-large" data-notebook-field></span>

    <div class="state-layer"></div>
  `;

  $sidebarList.appendChild($navItem);

  const /** {HTMLElement} */ $navItemField = $navItem.querySelector('[data-notebook-field]');

  // Active new created notebook and deactive the last one.
  activenotebook.call($navItem);

  // Make notebook field content editable and focus
  makeElemEditable($navItemField);

  // When user press 'Enter' then create notebook
  $navItemField.addEventListener('keydown', createnotebook);
}

$addnotebookBtn.addEventListener('click', shownotebookField);


/**
 * Create new notebook
 * Creates a new notebook when the 'Enter' key is pressed while editing a notebook name field.
 * The new notebook is stored in the database.
 * 
 * @param {KeyboardEvent} event - The keyboard event that triggered notebook creation.
 */
const createnotebook = function (event) {

  if (event.key === 'Enter') {

    // Store new created notebook in database
    const /** {Object} */ notebookData = db.post.notebook(this.textContent || 'Untitled'); // this: $navItemField
    this.parentElement.remove();

    // Render navItem
    client.notebook.create(notebookData);

  }

}

/**
 * Renders the existing notebook list by retrieving data from the database and passing it to the client.
 */
const renderExistednotebook = function () {
  const /** {Array} */ notebookList = db.get.notebook();
  client.notebook.read(notebookList);
}

renderExistednotebook();

/**
 * Create new note
 * 
 * Attaches event listeners to a collection of DOM elements representing "Create Note" buttons.
 * When a button is clicked, it opens a modal for creating a new note and handles the submission
 * of the new note to the database and client.
 */
const /** {Array<HTMLElement>} */ $noteCreateBtns = document.querySelectorAll('[data-note-create-btn]');

addEventOnElements($noteCreateBtns, 'click', function () {
  // Create and open a new modal
  const /** {Object} */ modal = NoteModal();
  modal.open();

  // Handle the submission of the new note to the database and client
  modal.onSubmit(noteObj => {
    const /** {string} */ activenotebookId = document.querySelector('[data-notebook].active').dataset.notebook;

    const /** {Object} */ noteData = db.post.note(activenotebookId, noteObj);
    client.note.create(noteData);
    modal.close();
  })
})


/**
 * Renders existing notes in the active notebook. Retrieves note data from the database based on the active notebook's/notebook ID
 * and uses the client to display the notes.
 */
const renderExistedNote = function () {
  const /** {string | undefined} */ activenotebookId = document.querySelector('[data-notebook].active')?.dataset.notebook;

  if (activenotebookId) {
    const /** {Array<Object>} */ noteList = db.get.note(activenotebookId);

    // Display existing note
    client.note.read(noteList);
  }
}


/**
 * Popup shortcut cheat sheet
 */
document.addEventListener('DOMContentLoaded', function () {
  const toggleButton = document.getElementById('togglePopup');
  const popup = document.getElementById('popup');

  toggleButton.addEventListener('click', function (event) {
    event.stopPropagation();
    popup.classList.toggle('show');
    toggleButton.classList.toggle('popup-active');
  });

  // Close popup when clicking outside
  document.addEventListener('click', function (event) {
    if (!popup.contains(event.target) && event.target !== toggleButton) {
      popup.classList.remove('show');
      toggleButton.classList.remove('popup-active');
    }
  });
});


renderExistedNote();

// localStorage.clear();


