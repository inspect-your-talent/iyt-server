

const dictionary = [
  'javascript','html','css','react','vue','js',
  'nodejs','node','native','express','byte','php',
  'function','laravel','travis','ci','repo','coding',
  'front-end','back-end','front','back','end','datatype',
  'type','bug','error','else','if','false','true','boolean',
  'android','command','json','library','tag','engineer','vr',
  'function','module','developer','programmer','ui','ux','startup',
  'dev','code','syntax','process','kode','program','algorithm','algoritma',
  'linux','database','db','framework','string','integer','variable', 'aplikasi'
]

function checkIsProgrammer (text) {

  let checkArr = text.split(' ');
  let totalWord = checkArr.length;
  let totalMatchWord = 0;
  let arrMatch = []

  checkArr.forEach(word => {
    if(dictionary.indexOf(word.toLowerCase()) !== -1) {
        const check = arrMatch.filter(text => text.word === word.toLowerCase())
        if (check.length) {
          arrMatch.map(text => {
            if (text.word === word.toLowerCase()) {
              return { word: word.toLowerCase(), count: text.count++ }
            } else {
              return text
            }
          })
        } else {
          arrMatch.push({
            word: word.toLowerCase(),
            count: 1
          })
        }
    }
  })
  return arrMatch.sort(function (a, b){
    return b.count - a.count
  })
}

module.exports = checkIsProgrammer;
