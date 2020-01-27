const DIR_PATH = '/home/stefan/Workspace/Projects/Node/';
const FILE_NAME = 'clipboard-buffer.txt';
const REFRESH_RATE = 1000; // miliseconds

module.exports = Object.freeze({ 
    buffer: `${DIR_PATH}${FILE_NAME}`,
    directoryPath: DIR_PATH, 
    fileName: FILE_NAME,
    refreshRate: REFRESH_RATE
});