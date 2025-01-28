import { formatter } from '../base.js';

const overlay = document.getElementsByClassName("overlay");
const info = document.getElementById("info");
//ボタン関連の処理
const add_candidate = document.getElementById('add_candidate');
const rem_candidate = document.getElementById('rem_candidate');
const modification = document.getElementById('modification');
const back = document.getElementById('back');

back.addEventListener('click', () => {
    window.location.href = 'modification.html';
});
//全部ポップアップでいいや！！！

//テーブルとかの処理
const event_name = document.getElementById('event_name');
const vote_start = document.getElementById('vote_start');
const vote_fin = document.getElementById('vote_fin');
const candidate_table = document.getElementById('candidate_table'); 

window.Data.on_Result((data)=>{
    info.textContent = data.message;
});

window.addEventListener('load', async() => {

    const param = new URLSearchParams(window.location.search);
    console.log(param);
    const event_id = await param.get('id');
    console.log(event_id);

    
    //テーブルの取得
    const event_list = await window.user.get_eventlistByID(event_id);
    const candidate_list = await window.user.get_candidate(event_id, event_list[0].election_name);
    console.log(event_list);
    console.log(candidate_list);

    if(event_list){

        event_name.textContent = event_list[0].election_name;

        //epoch時間を初期値に入れられるように変換(ミリ秒)
        const start = new Date(event_list[0].vote_start*1000);
        const fin = new Date(event_list[0].vote_fin*1000);
        vote_start.textContent = formatter.format(start).replace(/\//g, '-').replace(', ', 'T');
        vote_fin.textContent = formatter.format(fin).replace(/\//g, '-').replace(', ', 'T');

    }
        //後で確認
    if(candidate_list){
        for(let i =0; i < candidate_list.length; i ++){
            candidate_list_for_json(candidate_table,candidate_list[i]);
        }
    }else{
        info.textContent = "候補者はいません";
        rem_candidate.style.display = 'none';
    }

    //候補者追加
    add_candidate.addEventListener('click',async () =>{
        //popupの作成したいね
        await window.modal.add_modal(event_id, event_list[0].author);
        //overlay.style.display = 'block';
        
    });

    //候補者削除
    rem_candidate.addEventListener('click',async () =>{
        //削除に必要なイベントのIDと候補者リストを送る
        await window.modal.rem_modal(event_id, event_list[0].author, candidate_list); 
        //overlay.style.display = 'block';

    });

    //イベント情報更新
    modification.addEventListener('click',async () =>{
        //変更に必要なイベントの情報を送信する
        await window.modal.mod_modal(event_list);
        //overlay.style.display = 'block';
    });

});
//候補者リストをテーブルに
/*function candidate_list_for_json (table_obj, vector){
    const tr_obj = document.createElement('tr');
    
    vector.forEach((candidate) => {
        const candidate_name = document.createElement('td');
        candidate_name.textContent = candidate;
        tr_obj.appendChild(candidate_name);
    });

    table_obj.appendChild(tr_obj);
}*/

function candidate_list_for_json (table_obj, json_obj){
    const tr_obj = document.createElement('tr');
    const candidate_name = document.createElement('td');
    candidate_name.textContent = json_obj.candidate;
    tr_obj.appendChild(candidate_name);
    table_obj.appendChild(tr_obj);
}

