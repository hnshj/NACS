function usersave(){
localStorage.setItem('id', id);
localStorage.setItem('pass', pass);
}

//---ここから先メモ---
//保存
function save() {
    var MemoData = document.memomodule.memo.value;
    localStorage.setItem('MemoData', MemoData);
}

// 読込
function load() {
    var MemoData = localStorage.getItem('MemoData');
    if(MemoData == undefined) {
        MemoData = [];
    } else {}
 MemoData = localStorage.getItem('MemoData');
}