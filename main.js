const { app,BrowserWindow }=require('electron')
const path=require('path')

// const iconv = require('iconv-lite');
// const { execFileSync } = require('child_process');

// const wmic = path.join(process.env.SystemRoot, 'System32', 'wbem', 'WMIC.exe');

// const aliasList = execFileSync(wmic, ['ALIAS', 'LIST', 'BRIEF']);
// const aliasLines = iconv.decode(aliasList, 'GB2312').split(/\r\n/);
// const aliasItems = aliasLines.slice(1, aliasLines.length - 2).map(line => line.split(/\s{2,}/)[0]);

// const result=execFileSync(wmic, ['CPU', 'get', '/VALUE'])
// const tmp=iconv.decode(result, 'GB2312')
// const group = tmp.trim().split(/[\r\r\n]{5,}/);
// const jsonGroup = [];
// for (const item of group) {
//   const list = item.split(/\r\r\n/);
//   const jsonItem = {};
//   for (const d of list) {
//     const eqPos = d.indexOf('=');
//     jsonItem[d.slice(0, eqPos)] = d.slice(eqPos + 1);
//   }
//   jsonGroup.push(jsonItem);
// }

// let cpu=jsonGroup[0]

function createWindow(){
    const win=new BrowserWindow({
        width:800,
        height:600,
        webPreferences:{
            contextIsolation:false,
            preload:path.join(__dirname,'./preload.js')
        }
    })

    // win.loadFile('index.html')
    win.loadFile('active-complex.html')
}

app.whenReady().then(()=>{
    createWindow()

    app.on('activate',()=>{
        if(BrowserWindow.getAllWindows().length==0){
            createWindow()
        }
    })
})

app.on('window-all-closed',()=>{
    if(process.platform != 'darwin'){
        app.quit()
    }
})