import { formatter } from '../base.js';
const info = document.getElementById("info");
const eventlist = document.getElementById("event_table");
window.addEventListener('load', async () => {

    const list = await window.user.get_eventlist();

    if(list && list.length > 0 ){
        console.log('リストの取得に成功したよん');
        console.log('list : '+list);
        info.textContent = "現在開催しているイベント";

        const now = Math.floor(new Date().getTime()/1000);
        for(let i =0; i < list.length; i ++){
            event_list_for_json(eventlist, list[i], now);
        }
    }else{
        info.textContent = "現在開催中のイベントはありません";
    }
});

function event_list_for_json (table_obj, json_obj, now) {

    
    if(now < json_obj.vote_fin && json_obj.vote_start < now ){
        const tr_obj = document.createElement('tr');
        const event_id = document.createElement('td');
        const event_name = document.createElement('td');
        const event_fin = document.createElement('td');
        const candidate = document.createElement('td');
        const verification = document.createElement('td');
        const candidate_button = document.createElement('button');
        const verification_button = document.createElement('button');
        candidate_button.id = "table_button";
        candidate_button.textContent = "投票へ進む";
        verification_button.id = "table_button";
        verification_button.textContent = "投票の検証";


        candidate.classList.add('event_cmp');
        verification.classList.add('event_cmp');
        candidate_button.classList.add('select_btn');
        verification_button.classList.add('select_btn');
    
        candidate_button.addEventListener('click',function (){
            const url = `detail.html?id=${encodeURIComponent(json_obj.vote_list_id)}`;
            console.log("Navigating to:", url);
            window.location.href = url;    
        });

        verification_button.addEventListener('click',function(){
        window.user.verification(json_obj.vote_list_id, json_obj.election_name);
        });

        event_id.textContent = json_obj.vote_list_id;
        event_name.textContent = json_obj.election_name;
        event_fin.textContent = formatter.format(json_obj.vote_fin).replace(/\//g, '-').replace(', ', 'T');

        candidate.appendChild(candidate_button);
        verification.appendChild(verification_button);
        table_obj.appendChild(tr_obj);
        tr_obj.appendChild(event_id);
        tr_obj.appendChild(event_name);
        tr_obj.appendChild(event_fin);
        tr_obj.appendChild(candidate);
        tr_obj.appendChild(verification);
    }

};

