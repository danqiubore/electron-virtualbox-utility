const path=require('path')
const iconv = require('iconv-lite');
const { execFileSync } = require('child_process');


const wmic = path.join(process.env.SystemRoot, 'System32', 'wbem', 'WMIC.exe');

const aliasList = execFileSync(wmic, ['ALIAS', 'LIST', 'BRIEF']);
const aliasLines = iconv.decode(aliasList, 'GB2312').split(/\r\n/);
const aliasItems = aliasLines.slice(1, aliasLines.length - 2).map(line => line.split(/\s{2,}/)[0]);

const result=execFileSync(wmic, ['CPU', 'get', '/VALUE'])
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

let cpu=jsonGroup[0]
window.HTMLPackHelper={}
window.HTMLPackHelper.machineCode=cpu.ProcessorId