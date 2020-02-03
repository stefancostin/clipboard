@ECHO OFF
ECHO Installing the application dependencies:
cmd /C "npm install"

ECHO Please check what global version of Node.js you are using
ECHO and then download the same version as a binary (.zip).

ECHO ..................................
ECHO Link for the Node.js archives: https://nodejs.org/dist/
ECHO Look for the following format: latest-vX.x/ 
ECHO                                -- node-vX.x.1-win-x64.zip

ECHO ..................................
ECHO Make sure to unzip the Node.js binary inside the project's 
ECHO current location and then change the name of the unzipped
ECHO folder from: 'node-vX.x.1-win-x64' to: 'node_runtime'.

ECHO ..................................
ECHO The path to the local Node.js binary should look like:
ECHO './node_runtime/node.exe'

ECHO ..................................
ECHO Alternatively, you can modify the path in the 'init.bat'
ECHO so that it matches the path of your local Node.js runtime.

ECHO ..................................
ECHO Your global version of Node.js is:
cmd /K "node -v"
