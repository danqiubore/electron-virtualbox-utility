const { app,BrowserWindow,protocol,session }=require('electron')
const path=require('path')
const fs=require('fs')
const mime=require('mime-types')
const {net} =require('electron')

let child_prcess=require('child_process')
let exec=child_prcess.exec
let openExec;
global.mainWindow=null

let ENCRYPT_VAL = new Array(
    65, 68, 54, 52, 65, 53, 69, 48,
    52, 56, 57, 57, 69, 56, 56, 69,
    68, 48, 70, 55, 70, 50, 49, 51,
    65, 52, 68, 69, 54, 65, 53, 48
)

openExec=exec('node ./server.js',{timeout:1000},function(error,stdout,stderr){
    if (error) {
        console.log(error.stack);
        console.log('Error code: ' + error.code);
        return;
      }
      console.log('使用exec方法输出: ' + stdout);
      console.log(`stderr: ${stderr}`);
      console.log(process.pid)
      global.mainWindow.loadURL('http://127.0.0.1:3000/')
})
function createWindow(){
    const win=new BrowserWindow({
        width:800,
        height:600,
        webPreferences:{
            contextIsolation:false,
            preload:path.join(__dirname,'./preload.js')
        }
    })
    global.mainWindow=win
    // win.loadFile('index.html')
    // win.url('http://127.0.0.1:3030')
    // win.webContents.openDevTools()
}

app.whenReady().then(()=>{

    createWindow()

    app.on('activate',()=>{
        if(BrowserWindow.getAllWindows().length==0){
            createWindow()
        }
    })
})
function decryptByKey(bytes,key){
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = bytes[i] ^ ENCRYPT_VAL[key % ENCRYPT_VAL.length];
      }
      return bytes;
}


app.on('window-all-closed',()=>{
    if(process.platform != 'darwin'){
        app.quit()
            // 判断openExec是否存在，存在就杀掉node进程
    if (!openExec) {
        // console.log('openExec is null')
      } else {
        exec('taskkill /f /t /im node.exe', function (error, stdout, stderr) {
          if (error) {
            console.log(error.stack);
            console.log('Error code: ' + error.code);
            return;
          }
          console.log('使用exec方法输出: ' + stdout);
          console.log(`stderr: ${stderr}`);
        });
      }
    }
})
app.on('web-contents-created', (e, webContents) => {
    webContents.on('new-window', (event, url) => {
        event.preventDefault();
        // shell.openExternal(url); //通过浏览器打开
        var prefsWindow = new BrowserWindow ({
          width: 1280,
          icon:path.resolve(__dirname,"./src/renderer/images/icon_course.png"),
          height: 1000,
          show: true
        })
      prefsWindow.loadURL(url)
      prefsWindow.webContents.openDevTools();
    });
  });