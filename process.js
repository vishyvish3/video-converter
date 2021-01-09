const ipc = require('electron').ipcRenderer;
const buttonCreated = document.getElementById('upload');
const selectFolder = document.getElementById('selectFolder');
const process = require('child_process')
const path = require('path')
var randomString = require('random-string');
const fs = require('fs')
var dir = './media';

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

buttonCreated.addEventListener('click', function (event) {
    ipc.send('open-file-dialog-for-file')
});


ipc.on('selected-file', function (event, paths) {
    if (!outputFolderPath) {
        alert("Select output folder !!");
        return;
    }
    if (!paths) {
        alert("Select mp4 file !!");
        return;
    }
    console.log(event)
    var randomId = randomString()

    var info = document.querySelector("#info");
    info.innerHTML = `<div id=${randomId} class="alert alert-success">
     ${paths} is converting So Please Wait
    </div>`
    console.log('Full path: ', paths)

    process.exec(`ffmpeg -i "${paths}" -codec: copy -start_number 0 -hls_time 10 -hls_list_size 0 -f hls ${outputFolderPath}/${randomString()}_video.m3u8`, function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        info.innerHTML = '';
        Notification.requestPermission().then(function (result) {
            var myNotification = new Notification('Conversion Completed', {
                body: "Your file was successfully converted"
            });

        })
        
        if (error !== null) {
            console.log('exec error: ' + error);
        }

    })
    alert("Completed file conversion !!");
    outputFolderPath = undefined;
});

selectFolder.addEventListener('click', function (event) {
    ipc.send('open-file-dialog-for-folder')
});

var outputFolderPath;
ipc.on('selected-folder', function (event, paths) {
    if(paths == "notEmpty"){
        outputFolderPath = undefined;
        alert("Select an empty folder");
        return;
    }
    console.log(paths)
    outputFolderPath = paths;
});