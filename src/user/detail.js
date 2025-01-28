import { formatter } from '../base.js';

const info = document.getElementById("info");
const candidate_table = document.getElementById("candidate_table");
const event_name = document.getElementById("event_name");
const vote_start = document.getElementById("vote_start");
const vote_fin = document.getElementById("vote_fin");
const vote_button = document.getElementById("vote");

//引数を受け取って呼び出し
window.addEventListener('load', async() => {

    const param = new URLSearchParams(window.location.search);
    console.log(param);
    const event_id = await param.get('id');
    console.log(event_id);

    const event_list = await window.user.get_eventlistByID(event_id);
    const candidate_list = await window.user.get_candidate(event_id,event_list[0].election_name);

    //console.log(candidate_list[0]);
    if(event_list){

        event_name.textContent = event_list[0].election_name;

        //epoch時間を初期値に入れられるように変換(ミリ秒)
        const start = new Date(event_list[0].vote_start*1000);
        const fin = new Date(event_list[0].vote_fin*1000);
        vote_start.textContent = formatter.format(start).replace(/\//g, '-').replace(', ', 'T');
        vote_fin.textContent = formatter.format(fin).replace(/\//g, '-').replace(', ', 'T');
    }

    if(candidate_list){
        for(let i =0; i < candidate_list.length; i ++){
            candidate_list_for_json(candidate_table,candidate_list[i]);
        }
    }else{
        info.textContent = "候補者はいません";
        vote_button.style.display = 'none';
    }

    vote_button.addEventListener('click', async ()=>{
        //投票に必要な候補者リストを送信する
        await window.modal.vote_modal(event_id,candidate_list);
    })
});




function candidate_list_for_json (table_obj, json_obj){
    const tr_obj = document.createElement('tr');
    const candidate_name = document.createElement('td');
    candidate_name.textContent = json_obj.candidate;
    tr_obj.appendChild(candidate_name);
    table_obj.appendChild(tr_obj);
}