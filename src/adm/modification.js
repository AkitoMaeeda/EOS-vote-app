import { formatter } from '../base.js';

const info = document.getElementById("info");
const eventlist = document.getElementById("event_table");
const back = document.getElementById('back');

back.addEventListener('click', function() {
    window.location.href = 'admin.html';
});

//イベントリストの読み取りと表示
window.addEventListener('load', async () => {

    const list = await window.user.get_eventlist();

    if(list && list.length > 0 ){
        info.textContent = "イベント一覧";

        for(let i =0; i < list.length; i ++){
            event_list_for_json(eventlist, list[i]);
        }
    }else{
        info.textContent = "イベントが無いよん";
    }
});

function event_list_for_json (table_obj, json_obj) {
    const tr_obj = document.createElement('tr');
    const event_id = document.createElement('td');
    const event_name = document.createElement('td');
    const vote_start = document.createElement('td');
    const vote_fin = document.createElement('td');
    const modi = document.createElement('td');
    const modification_button = document.createElement('button');
    modification_button.id = "modification_button";
    modification_button.textContent = "編集";

    modi.classList.add('event_cmp');
    modification_button.classList.add('select_btn');

    event_id.textContent = json_obj.vote_list_id;
    event_name.textContent = json_obj.election_name;
    const start = new Date(json_obj.vote_start*1000);
    const fin = new Date(json_obj.vote_fin*1000);
    vote_start.textContent = formatter.format(start).replace(/\//g, '-').replace(', ', 'T');
    vote_fin.textContent = formatter.format(fin).replace(/\//g, '-').replace(', ', 'T');

    const url = `detail.html?id=${encodeURIComponent(json_obj.vote_list_id)}`;
    modification_button.addEventListener('click', ()=>{
        window.location.href = url;
    });

    modi.appendChild(modification_button);
    table_obj.appendChild(tr_obj);
    tr_obj.appendChild(event_id);
    tr_obj.appendChild(event_name);
    tr_obj.appendChild(vote_start);
    tr_obj.appendChild(vote_fin);
    tr_obj.appendChild(modi);

};