const create_event_form = document.getElementById('create_event');

//エラーを出力する要素の取得
const info = document.getElementById('info');

create_event_form.addEventListener('submit', async(event) => {
    //検証のためいったん送信の停止を行い、ページのリロードを防止する
    event.preventDefault();

    //入力された値の取得
    const event_name = document.getElementById('event_name').value;
    const author = document.getElementById('author').value;
    const vote_start = document.getElementById('vote_start').value;
    const vote_fin = document.getElementById('vote_fin').value;

    //時間をエポックタイムに変換
    const unix_start = Math.floor(new Date(vote_start).getTime()/1000);
    const unix_fin = Math.floor(new Date(vote_fin).getTime()/1000);
    const date_now = Math.floor(new Date().getTime()/1000);

    let errormessage = '';


    //管理者のフォーマットチェック
    if(author.length !== 12 || !/^[a-z0-9]+$/.test(author)){
        errormessage += 'フォーマットが間違っています<br>';
        return;
    }

    //現在時刻以降のイベントのみ許可
    if(unix_start < date_now){
        errormessage += '開始時刻は現在時刻以降である必要があります<br>';
    }

    //期間が12時間以上のイベントのみ許可
    /*if(unix_fin-unix_start < 43200){
        errormessage += '投票期間は12時間以上である必要があります<br>';
    }*/

    //すべての条件がクリアされたら処理を行う
    if(!errormessage){
        try{
            await window.adm.create_new_event(author, event_name, unix_start, unix_fin);
            info.textContent = '新規イベント"'+event_name+'"の作成が完了しました';
        }catch(error){
            info.textContent = '新規イベントの作成に失敗しました';
        }

    }else{
        info.innerHTML = errormessage;
    }

});