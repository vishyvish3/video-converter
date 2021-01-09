'use strict';

var app = require('electron').app;
var BrowserWindow = require('electron').BrowserWindow;
var mainWindow = null;
var ipc = require('electron').ipcMain;
var os = require('os');
var { dialog } = require('electron');
const fs = require('fs');

ipc.on('close-main-window', function () {
    app.quit();
});

app.on('ready', function () {
    mainWindow = new BrowserWindow({
        resizable: true,
        height: 700,
        width: 900,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadURL('file://' + __dirname + '/index.html');
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
});

ipc.on('open-file-dialog-for-file', function (event) {
    console.log("button pressed")
    console.log(event)
    if (os.platform() === 'linux' || os.platform() === 'win32') {

        dialog.showOpenDialog(null, {
            properties: ['openFile']
        }).then(result => {
            console.log(result.filePaths)
            event.sender.send("selected-file", result.filePaths[0])
        }).catch(err => {
            console.log(err)
        })
    } else {
        dialog.showOpenDialog({
            properties: ['openFile', 'openDirectory']
        }, function (files) {
            if (files) event.sender.send('selected-file', files[0]);
        });
    }
});

ipc.on('open-file-dialog-for-folder', function (event) {

    console.log(event)
    if (os.platform() === 'linux' || os.platform() === 'win32') {

        dialog.showOpenDialog(null, {
            properties: ['openDirectory']
        }).then(result => {
            if(fs.readdirSync(result.filePaths[0]).length === 0){
            event.sender.send("selected-folder", result.filePaths[0])
            } else {
                event.sender.send("selected-folder", "notEmpty")   
            }
        }).catch(err => {
            console.log(err)
        })
    }
});

