function back(){
    var x = localStorage.getItem('x');
    if (x == undefined){
        x = 0;
    } else if(x == 0){
        x = 0; 
    } else {
        x = x - 1;
    }
    var storage = localStorage;
 storage.setItem('x',x);

 if (x == undefined){
    var x = localStorage.getItem('x');
}else if (x == 1){
    title.innerHTML="お使いのデバイスが推奨環境であるかをチェックします";
    contents.innerHTML="結果を表示";
 } else if (x == 2){
    title.innerHTML="お疲れ様でした";
    contents.innerHTML="NACSを使用する準備がでできました。\r\n次へをクリックするとNACSが開始します。";
} else {
    window.location.href = "./public/NACS.html";
}

}

function next(){
    var x = localStorage.getItem('x');
    if (x == undefined){
        x = 0;
    } else {
        x = x + 1;
    }
    var storage = localStorage;
    storage.setItem('x',x);

 if (x == undefined){
    var x = localStorage.getItem('x')
}else if (x == 0){
    title.innerHTML="NACSをご利用前に以下の内容に同意して下さい";
    icon.innerHTML= '<img src="public/img/kiyaku.png" width="300" height="200">';
    progress.innerHTML="1/3"
    contents.innerHTML="";
    kiyaku.innerHTML="<b>プライバシーポリシー(2022年4月22日作成）</b><br>NACSは以下の内容を取得することがあります。"
    +"<br>・OSの情報<br>・ブラウザの情報<br>この情報は、個人を特定できない形で、NACSに送信される場合があります。"
    +"NACSは、いただいた個人情報を、ご利用者様の許可なく、外部に提供することはありません。"
    +"また、情報はNACS内でのみ共有し、部内全体で利用することはありません。"
    backButton.innerHTML='<button value="戻る" onclick="back()">戻る</button>';
    nextButton.innerHTML="同意";
 }else if (x == 1){
    title.innerHTML="推奨環境";
    icon.innerHTML= '<img src="public/img/osusume.png" width="300" height="200">';
    contents.innerHTML="以下の環境で実行されることをお勧めします。この条件を満たしていなくても、"
    +"NACSの実行は、可能ですが、正常にNACSが動作しない可能性があります。あらかじめご了承ください。"
    +"<br>学校のiPad(ロイロノート、OptimalWeb)"
    +"<br>それ以外の環境で実行される場合<br>"
    +"<b>パソコン</b><br>OS:macOS11以降<br>ブラウザ:Safari<br>"
    +"<b>スマートフォン</b><br>OS:iOS15以降<br>ブラウザ:Safari<br>"
    +"<b>タブレット</b><br>OS:iPadOS15以降<br>ブラウザ:Safari";
    progress.innerHTML="2/3"
    kiyaku.innerHTML="";
    backButton.innerHTML='<button value="戻る" onclick="back()">戻る</button>';
    nextButton.innerHTML="次へ";
 } else if (x == 11){
    title.innerHTML="お疲れ様でした";
    icon.innerHTML= '<img src="public/img/finish.png" width="300" height="200">';
    progress.innerHTML="3/3"
    contents.innerHTML="NACSを使用する準備がでできました。\r\nスタートをクリックするとNACSが開始します。";
    kiyaku.innerHTML="";
    backButton.innerHTML='<button value="戻る" onclick="back()">戻る</button>';
    nextButton.innerHTML="スタート";
    var visit = 0;
    var storage = localStorage;
    storage.setItem('visit',visit);
} else {
    window.location.href = "./public/NACS.html";
    localStorage.removeItem("x");
}

}



