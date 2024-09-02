

/**
 * Import module
 */
import { generateID, findnotebook, findnotebookIndex, findNote, findNoteIndex } from "./utils.js";


// DB Object
let /** {Object} */ noteappDB = {};


/**
 * Initializes a local database. If the data exists in local storage, it is loaded;
 * otherwise, a new empty database structure is created and stored.
 */
const initDB = function () {
  const /** {JSON | undefined} */ db = localStorage.getItem('noteappDB');

  if (db) {
    noteappDB = JSON.parse(db);
  } else {
    noteappDB.notebooks = [];
    localStorage.setItem('noteappDB', JSON.stringify(noteappDB));
  }
}

initDB();


/**
 * Reads and loads the localStorage data in to the global variable `noteappDB`.
 */
const readDB = function () {
  noteappDB = JSON.parse(localStorage.getItem('noteappDB'));
}


/**
 * Writes the current state of the global variable `noteappDB` to local storage
 */
const writeDB = function () {
  localStorage.setItem('noteappDB', JSON.stringify(noteappDB));
}


/**
 * Collection of functions for performing CRUD (Create, Read, Update, Delete) operations on database.
 * The database state is managed using global variables and local storage.
 *
 * @namenotebook
 * @property {Object} get - Functions for retrieving data from the database.
 * @property {Object} post - Functions for adding data to the database.
 * @property {Object} update - Functions for updating data in the database.
 * @property {Object} delete - Functions for deleting data from the database.
 */
export const db = {

  post: {

    /**
     * Adds a new notebook to the database.
     *
     * @function
     * @param {string} name - The name of the new notebook.
     * @returns {Object} The newly created notebook object.
     */
    notebook(name) {
      readDB();

      const /** {Object} */ notebookData = {
        id: generateID(),
        name,
        notes: []
      }

      noteappDB.notebooks.push(notebookData);

      writeDB();

      return notebookData;
    },

    /**
     * Adds a new note to a specified notebook in the database.
     *
     * @function
     * @param {string} notebookId - The ID of the notebook to add the note to.
     * @param {Object} object - The note object to add.
     * @returns {Object} The newly created note object.
     */
    note(notebookId, object) {
      readDB();

      const /** {Object} */ notebook = findnotebook(noteappDB, notebookId);

      const /** {Object} */ noteData = {
        id: generateID(),
        notebookId,
        ...object,
        postedOn: new Date().getTime()
      }

      notebook.notes.unshift(noteData);
      writeDB();

      return noteData;
    }

  },

  get: {

    /**
     * Retrieves all notebooks from the database.
     *
     * @function
     * @returns {Array<Object>} An array of notebook objects.
     */
    notebook() {
      readDB();

      return noteappDB.notebooks;
    },

    /**
     * Retrieves all notes within a specified notebook.
     *
     * @function
     * @param {string} notebookId - The ID of the notebook to retrieve notes from.
     * @returns {Array<Object>} An array of note objects.
     */
    note(notebookId) {
      readDB();

      const /** {Object} */ notebook = findnotebook(noteappDB, notebookId);
      return notebook.notes;
    }

  },

  update: {

    /**
     * Updates the name of a notebook in the database.
     *
     * @function
     * @param {string} notebookId - The ID of the notebook to update.
     * @param {string} name - The new name for the notebook.
     * @returns {Object} The updated notebook object.
     */
    notebook(notebookId, name) {
      readDB();

      const /** {Object} */ notebook = findnotebook(noteappDB, notebookId);
      notebook.name = name;

      writeDB();

      return notebook;
    },

    /**
     * Updates the content of a note in the database.
     *
     * @function
     * @param {string} noteId - The ID of the note to update.
     * @param {Object} object - The updated data for the note.
     * @returns {Object} The updated note object.
     */
    note(noteId, object) {
      readDB();

      const /** {Object} */ oldNote = findNote(noteappDB, noteId);
      const /** {Object} */ newNote = Object.assign(oldNote, object);

      writeDB();

      return newNote;
    }

  },

  delete: {

    /**
     * Deletes a notebook from the database.
     *
     * @function
     * @param {string} notebookId - The ID of the notebook to delete.
     */
    notebook(notebookId) {
      readDB();

      const /** {Number} */ notebookIndex = findnotebookIndex(noteappDB, notebookId);
      noteappDB.notebooks.splice(notebookIndex, 1);

      writeDB();
    },

    /**
     * Deletes a note from a specified notebook in the database.
     *
     * @function
     * @param {string} notebookId - The ID of the notebook containing the note to delete.
     * @param {string} noteId - The ID of the note to delete.
     * @returns {Array<Object>} An array of remaining notes in the notebook.
     */
    note(notebookId, noteId) {
      readDB();

      const /** {Object} */ notebook = findnotebook(noteappDB, notebookId);
      const /** {number} */ noteIndex = findNoteIndex(notebook, noteId);

      notebook.notes.splice(noteIndex, 1);

      writeDB();

      return notebook.notes;
    }

  }

}

// localStorage.clear()