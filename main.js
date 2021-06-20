const { app,BrowserWindow,protocol }=require('electron')
const path=require('path')
const fs=require('fs')
const mime=require('mime-types')

let ENCRYPT_VAL = new Array(
    65, 68, 54, 52, 65, 53, 69, 48,
    52, 56, 57, 57, 69, 56, 56, 69,
    68, 48, 70, 55, 70, 50, 49, 51,
    65, 52, 68, 69, 54, 65, 53, 48
)

async function createWindow(){
    const win=new BrowserWindow({
        width:800,
        height:600,
        webPreferences:{
            contextIsolation:false,
            preload:path.join(__dirname,'./preload.js')
        }
    })

    // win.loadFile('index.html')
    win.loadFile('./resources/index.html')
    // win.webContents.openDevTools()
}

app.whenReady().then(()=>{
    createWindow()

    app.on('activate',()=>{
        if(BrowserWindow.getAllWindows().length==0){
            createWindow()
        }
    })

    
    // protocol.interceptBufferProtocol ('file', function(request, callback){

    //     let filePath = request.url.substr(8);  // 截取file:///之后的内容，也就是我们需要的 
    //     filePath = path.normalize(filePath);

    //     fs.readFile(filePath, (err, data) => {
    //         if (err) {
    //           // report error
    //           callback()
    //         } else {
    //             if(request.url.indexOf('.mp4')<0){
    //                 callback(data)
    //                 return
    //             }
    //           //对获取到的data数据进行解密
    //         //   let key=[data[0],data[1],data[2]]
    //         //   let keyStr=key.toString().replace(/,/g,'')
    //         //   let keyInt=Number.parseInt(keyStr)
    //         //   let divData=data.slice(3)
    //         //   let newData=decryptByKey(divData,keyInt)
    //           callback({
    //               mimeType:mime.contentType(filePath),
    //               data:data
    //           })
    //         }
    //     })
    // })



    protocol.interceptFileProtocol ('file', function(request, callback){

        let filePath = request.url.substr(8);  // 截取file:///之后的内容，也就是我们需要的 
        filePath = path.normalize(filePath);
        if(request.url.indexOf('.mp4')<0){
            callback(filePath
                )
            return
        }
        
        fs.readFile(filePath, (err, data) => {
            if (err) {
              // report error
              callback()
            } else {

            //   对获取到的data数据进行解密
              let key=[data[0],data[1],data[2]]
              let keyStr=key.toString().replace(/,/g,'')
              let keyInt=Number.parseInt(keyStr)
              let splitData=data.slice(3)
              let newData=decryptByKey(splitData,keyInt)
              callback({
                data:null
              })
            }
        })
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