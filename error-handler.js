const { Errors } = require('./constants');

function handleApplicationInitError(err) {
  console.error('The application is shutting down. Please make sure that ' +
    'the file and directory path on the drive match the ones in the config file.');
}

function handleReadFromBufferError(err) {
  const errorMessage = 'There was a problem while reading from the buffer. ' +
    'The drive or buffer file was not accessible or you don\'t have permission.';
  console.error(err, errorMessage);
}

function handleReadFromClipboardError(err) {
  if (_isFileCopyError(err)) {
    // suppress error when user copies an entire file
  } else {
    const errorMessage = 'Unable to read from the operating system clipboard.';
    console.error(err, errorMessage);
  }
}

function handleReadOnKeyboardEventError(err) {
  if (_isFileCopyError(err)) {
    // suppress error when user copies an entire file
  } else {
    const errorMessage = 'Unable to read from the operating system clipboard ' +
      'on key press event.';
    console.error(err, errorMessage);
  }
}

function handleReadOnLoopError(err) {
  if (_isFileCopyError(err) || _isReadRestrictedOnSleepModeError(err)) {
    // suppress error when user copies an entire file
    // suppress error when computer is on sleep mode
  } else {
    const errorMessage = 'Unable to read from the operating system clipboard ' +
    'on synchronization loop.';
    console.error(err, errorMessage);
  }
}

/**
 * High level implementation performed in JavaScript.
 * 
 * The library used to read/write on the operating system clipboard
 * is wrapping the lower level instructions inside a JavaScript API.
 */
function _containsHighLevelErrorCode(err, errCode) {
  return err.code === errCode;
}

/**
 * Low level implementation performed in Rust.
 * 
 * The library used to read/write to the operating system clipboard
 * is using Rust to perform the I/O operations. The error handling
 * process has different error codes for the I/O operations and
 * these error codes are nested inside the error message wrapper.
 */
function _containsLowLevelErrorCode(err, errCode) {
  return err.stderr && err.stderr.indexOf(errCode) > -1;
}

/**
 * When copying a file from the Explorer window, the contents of 
 * the operating system clipboard can not be read as UTF-8 format
 * so the programs issues an redundant warning, despite the fact 
 * that the copy/paste procedure is working as expected.
 * 
 * In this case, the user is successfully copying a file, not text, 
 * so the I/O error message is: "The operation completed successfully."
 * 
 * If not suppressed, this warning will keep showing up as an error
 * in the program console everytime the user is copying a file, 
 * although the file-copy operation is actually successful.
 */
function _isFileCopyError(err) {
  return (err && _containsHighLevelErrorCode(err, Errors.READ_FROM_CLIPBOARD)
    && _containsLowLevelErrorCode(err, Errors.FILE_COPY));
}

/**
 * When the computer is on sleep mode, the process is permanently 
 * trying to read from the operating system clipboard and the
 * process fails with an Access Denied error. 
 * 
 * The console window will be filled with redundant warnings, 
 * despite the fact that the copy/paste procedure will be working
 * as expected when the user resumes his activity, after logging in.
 */
function _isReadRestrictedOnSleepModeError(err) {
  return (err && _containsHighLevelErrorCode(err, Errors.READ_FROM_CLIPBOARD)
    && _containsLowLevelErrorCode(err, Errors.COMPUTER_SLEEP_MODE));
}

module.exports = {
  handleApplicationInitError,
  handleReadFromBufferError,
  handleReadFromClipboardError,
  handleReadOnKeyboardEventError,
  handleReadOnLoopError
};