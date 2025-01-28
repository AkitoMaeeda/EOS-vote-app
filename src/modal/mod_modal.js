const info = document.getElementById('info');
const info_name = document.getElementById('info_name');
const info_start = document.getElementById('info_start');
const info_fin = document.getElementById('info_fin');

//overlay
const confirm = document.getElementById('confirm');
const close = document.getElementById('close');
const next_button = document.getElementById('next');

const execute = document.getElementById('execute');
const back_button = document.getElementById('back');

execute.style.display = 'none';


//出力要素
const event_name = document.getElementById('event_name');
const vote_start = document.getElementById('vote_start');
const vote_fin = document.getElementById('vote_fin');

//formの取得
const mod_form = document.getElementById('mod_event');

let event_id;
let default_name;
let author;
let default_start;
let default_fin;

//編集するイベントの取得
window.Data.on_Data((data) => {
    event_id = data.event_list[0].vote_list_id;
    author = data.event_list[0].author;
    console.log(data);

    //epoch時間を初期値に入れられるように変換(ミリ秒)
    const start = new Date((data.event_list[0].vote_start+32400)*1000);
    const fin = new Date((data.event_list[0].vote_fin+32400)*1000);
    //初期値の設定
    event_name.value = data.event_list[0].election_name;
    default_name = event_name.value;
    vote_start.value = start.toISOString().slice(0,16);
    default_start = vote_start.value;
    vote_fin.value = fin.toISOString().slice(0,16);
    default_fin = vote_fin.value;
    console.log(default_name.value);
});

close.addEventListener('click', function(){
    callba
});

back_button.addEventListener('click', function(){
    execute.style.display = 'none';
    confirm.style.visibility = 'visible';
    info.textContent = '';
});

next_button.addEventListener('click', async(_e,_arg) => {

    //値の取得と確認メッセージの作成
    confirm.style.visibility = 'hidden';
    execute.style.display = 'block';
    info_name.textContent = "イベント名："+event_name.value;
    info_start.textContent = "開始時刻："+vote_start.value;
    info_fin.textContent = "終了時間"+vote_fin.value;
    info.textContent = "この内容でイベント情報を変更しますか？";


});

mod_form.addEventListener('submit', async () => {
    //名前と時間が変更されている時
    const unix_start = Math.floor(new Date(vote_start.value).getTime()/1000);
    const unix_fin = Math.floor(new Date(vote_fin.value).getTime()/1000);
    console.log(unix_start+"\n"+unix_fin);
    if(default_name !== event_name.value && (default_start !== vote_start.value || default_fin !== vote_fin.value)){
        console.log("時間と名前の変更");
        await window.adm.change_event(event_id, author, event_name.value, unix_start, unix_fin);
    }

    //名前だけの変更
    else if(default_name !== event_name.value){
        console.log("名前の変更");
        await window.adm.change_event_name(event_id, author, event_name);
    }

    //時間だけの変更
    else if(default_start !== vote_start.value || default_fin !== vote_fin.value){
        console.log("時間の変更");
        await window.adm.change_time(event_id, author, unix_start, unix_fin);
    }

});
