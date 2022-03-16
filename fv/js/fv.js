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
    window.location.href = "./public/kadai.html";
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
    icon.innerHTML= '<img src="#" width="300" height="200">';
    progress.innerHTML="1/3"
    contents.innerHTML="";
    kiyaku.innerHTML="<b>プライバシーポリシー</b><br>NACSは以下の内容を取得することがあります。<br>・OSの情報<br>・ブラウザの情報<br>この情報は、ご利用者様のデバイス内で処理され、ご利用者様の同意なくNACSに送信されることはありません。<br><b>免責事項</b><br>当プログラムを利用することによってご利用者様に損害が発生した場合、NACSは、その損害の代償にかかわらず、いかなる保証も行いません。<br>このサービスは、事前に通知なく、停止する場合があります。<br>NACSのあらゆるプログラムのあらゆる権利は、NACSに帰属します。我々の許可無くプログラムを複製、公開、配布することを禁じます。<br>同意しない場合は、この画面を閉じてください。同意されない場合、NACSをご利用いただけません。";
    backButton.innerHTML='<button value="戻る" onclick="back()">戻る</button>';
    nextButton.innerHTML="同意";
 }else if (x == 1){
    title.innerHTML="推奨環境";
    icon.innerHTML= '<img src="#" width="300" height="200">';
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
    icon.innerHTML= '<img src="#" width="300" height="200">';
    progress.innerHTML="3/3"
    contents.innerHTML="NACSを使用する準備がでできました。\r\nスタートをクリックするとNACSが開始します。";
    kiyaku.innerHTML="";
    backButton.innerHTML='<button value="戻る" onclick="back()">戻る</button>';
    nextButton.innerHTML="スタート";
    var visit = 0;
    var storage = localStorage;
    storage.setItem('visit',visit);
} else {
    window.location.href = "./public/kadai.html";
    localStorage.removeItem("x");
}

}



