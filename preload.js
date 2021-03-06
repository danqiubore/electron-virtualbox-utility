const path=require('path')
const iconv = require('iconv-lite');
const { execFileSync } = require('child_process');
const cmd=require('node-cmd')

const isMac=process.platform == 'darwin'

if(!isMac){
  //windows环境下
  const wmic = path.join(process.env.SystemRoot, 'System32', 'wbem', 'WMIC.exe');

  // const aliasList = execFileSync(wmic, ['ALIAS', 'LIST', 'BRIEF']);
  // const aliasLines = iconv.decode(aliasList, 'GB2312').split(/\r\n/);
  // const aliasItems = aliasLines.slice(1, aliasLines.length - 2).map(line => line.split(/\s{2,}/)[0]);
  
  // CPU
  const result=execFileSync(wmic, ['CSProduct', 'get', '/VALUE'])
  const tmp=iconv.decode(result, 'GB2312')
  const group = tmp.trim().split(/[\r\r\n]{5,}/);
  const jsonGroup = [];
  for (const item of group) {
    const list = item.split(/\r\r\n/);
    const jsonItem = {};
    for (const d of list) {
      const eqPos = d.indexOf('=');
      jsonItem[d.slice(0, eqPos)] = d.slice(eqPos + 1);
    }
    jsonGroup.push(jsonItem);
  }  
  let CSProduct=jsonGroup[0]
  window.HTMLPackHelper={}
  window.HTMLPackHelper.machineCode=CSProduct.UUID
}
else
{
  const hardInfo=cmd.runSync('system_profiler SPHardwareDataType')
    if(hardInfo && hardInfo.err)
    {
      console.log(hardInfo)
      return
    }
    // const tmp=iconv.decode(data, 'GB2312')
    const group = hardInfo.data.trim().split(/[\n\n]{5,}/);
    const jsonGroup = [];
    for (const item of group) {
      const list = item.split(/\n/);
      const jsonItem = {};
      for (const d of list) {
        const eqPos = d.indexOf(':');
        const key=d.slice(0,eqPos).trim()
        if(key=='' || key==null)
            continue
        jsonItem[key] = d.slice(eqPos + 1).trim();
      }
      jsonGroup.push(jsonItem);
    }
    const hardwareUUID=jsonGroup[0]['Hardware UUID']
    window.HTMLPackHelper={}
    window.HTMLPackHelper.machineCode=hardwareUUID
}