
const /** {HTMLElement} */ $overlay = document.createElement('div');
$overlay.classList.add('overlay', 'modal-overlay');




/**
 * Creates and manages a modal for adding or editing notes. The modal allows users to input a note's title and text,
 * and provides functionality to submit and save the note.
 *
 * @param {string} [title=''] - The default title for the note.
 * @param {string} [text=''] - The default text for the note.
 * @param {string} [time=''] - The time associated with the note.
 * @returns {Object} - An object containing functions to open the modal, close the modal, and handle note submissions.
 */
const NoteModal = function (title = '', text = '', time = '') {

  const /** {HTMLElement} */ $modal = document.createElement('div');
  $modal.classList.add('modal');

  $modal.innerHTML = `

    <button class="icon-btn large" aria-label="Close modal" data-close-btn>
      <span class="material-symbols-rounded" aria-hidden="true">close</span>
    </button>

    <input type="text" placeholder="Note title" value="${title}" class="modal-title text-title-medium" data-note-field>

    <textarea placeholder="Insert your deep thoughts here. Yes, all of them." class="modal-text text-body-large custom-scrollbar" data-note-field>${text}</textarea>

    <div class="modal-footer">
      <span class="time text-label-large">${time}</span>

      <button class="btn text" data-submit-btn >
        <span class="btn-tex">Save</span>

        <div class="state-layer"></div>
      </button>
    </div>
  `;

  const /** {HTMLElement} */ $submitBtn = $modal.querySelector('[data-submit-btn]');
  $submitBtn.disabled = true;

  const /** {HTMLElement} */[$titleField, $textField] = $modal.querySelectorAll('[data-note-field]');

  const enableSubmit = function () {
    $submitBtn.disabled = !$titleField.value && !$textField.value;
  }

  $textField.addEventListener('keyup', enableSubmit);
  $titleField.addEventListener('keyup', enableSubmit);


  /**
   * Opens the note modal by appending it to the document body and setting focus on the title field.
   */
  const open = function () {
    document.body.appendChild($modal);
    document.body.appendChild($overlay);
    $titleField.focus();
  }


  /**
   * Closes the note modal by removing it from the document body.
   */
  const close = function () {
    document.body.removeChild($modal);
    document.body.removeChild($overlay);
  }

  // Attach click event to closeBtn, when click call the close modal function
  const /** {HTMLElement} */ $closeBtn = $modal.querySelector('[data-close-btn]');
  $closeBtn.addEventListener('click', close);


  /**
   * Handles the submission of a note within the modal.
   *
   * @param {Function} callback - The callback function to execute with the submitted note data.
   */
  const onSubmit = function (callback) {

    $submitBtn.addEventListener('click', function () {
      const /** {Object} */ noteData = {
        title: $titleField.value,
        text: $textField.value
      }

      callback(noteData);
    });

  }

  return { open, close, onSubmit }
}


/**
 * Creates and manages a modal for confirming the deletion of an item.
 *
 * @param {string} title - The title of the item to be deleted.
 * @returns {Object} - An object containing functions to open the modal, close the modal, and handle confirmation.
 */
const DeleteConfirmModal = function (title) {

  const /** {HTMLElement} */ $modal = document.createElement('div');
  $modal.classList.add('modal');

  $modal.innerHTML = `
    <h3 class="modal-title text-title-medium">
      Are you sure you want to delete <strong>"${title}"</strong>?
    </h3>

    <p class="modal-delete-text"> Are you absolutely certain that you want to 
      delete this? This action is irreversible,
     meaning the change will be permanent, and you will not have 
     the ability to undo it. 
    </p>


    <div class="modal-footer-delete">

      <button class="btn text-cancel" data-action-btn="false" data-tooltip="Cancel">
        <span class="text-label-large">Cancel</span>
        <div class="state-layer"></div>
      </button>

      <button class="btn fill-delete" data-action-btn="true">
        <span class="text-label-large">Delete</span>
        <div class="state-layer"></div>
      </button>

    </div>
  `;


  /**
   * Opens the delete confirmation modal by appending it to the document body
   */
  const open = function () {
    document.body.appendChild($modal);
    document.body.appendChild($overlay);
  }


  /**
   * Closes the delete confirmation modal by removing it from the document body
   */
  const close = function () {
    document.body.removeChild($modal);
    document.body.removeChild($overlay);
  }


  const /** {Array<HTMLElement>} */ $actionBtns = $modal.querySelectorAll('[data-action-btn]');

  /**
   * Handles the submission of the delete confirmation.
   *
   * @param {Function} callback - The callback function to execute with the confirmation result (true for confirmation, false for cancel).
   */
  const onSubmit = function (callback) {
    $actionBtns.forEach($btn => $btn.addEventListener('click', function () {
      const /** {Boolean} */ isConfirm = this.dataset.actionBtn === 'true' ? true : false;

      callback(isConfirm);
    }));
  }


  return { open, close, onSubmit }
}

export { DeleteConfirmModal, NoteModal }