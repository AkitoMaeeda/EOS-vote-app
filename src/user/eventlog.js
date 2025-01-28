import { formatter } from '../base.js';

const info = document.getElementById("info");
const eventlist = document.getElementById("event_table");

window.addEventListener('load', async() => {

    const list = await window.user.get_logs();

    if(list){
        console.log('リストの取得に成功したよん');
        console.log('list : '+list[0].vote_start);

        for(let i =0; i < list.length; i ++){
            event_list_for_json(eventlist, list[i]);
        }
    }else{
        info.textContent = "イベントの記録はありません";
    }
});

function event_list_for_json (table_obj, json_obj) {
    const tr_obj = document.createElement('tr');
    const event_id = document.createElement('td');
    const event_name = document.createElement('td');
    const event_period = document.createElement('td');

    tr_obj.classList.add('select_hov');
    event_id.classList.add('event_cmp');
    event_name.classList.add('event_cmp');
    event_period.classList.add('event_cmp');

    var start = new Date(json_obj.vote_start*1000);
    var fin = new Date(json_obj.vote_fin*1000);
    start = formatter.format(start).replace(/\//g, '-').replace(', ', 'T');
    fin = formatter.format(fin).replace(/\//g, '-').replace(', ', 'T');

    tr_obj.onclick = function (){
        const url = `log_detail.html?id=${encodeURIComponent(json_obj.vote_list_id)}`;
        console.log("Navigating to:", url);
        window.location.href = url;
    };

    event_id.textContent = json_obj.vote_list_id;
    event_name.textContent = json_obj.election_name;
    event_period.textContent = start+"~"+fin;

    table_obj.appendChild(tr_obj);
    tr_obj.appendChild(event_id);
    tr_obj.appendChild(event_name);
    tr_obj.appendChild(event_period);

};