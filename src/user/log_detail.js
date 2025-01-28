import { formatter } from '../base.js';

const event_name = document.getElementById("event_name");
const vote_start = document.getElementById("vote_start");
const vote_fin = document.getElementById("vote_fin");
const candidate_list = document.getElementById("candidate_table");
const back = document.getElementById("back");
const aggregation = document.getElementById("aggregation");

back.addEventListener('click', function(){
    window.location.href = 'eventlog.html';
});

window.addEventListener('load', async() => {
    const param = new URLSearchParams(window.location.search);
    console.log(param);
    const event_id = await param.get('id');
    console.log(event_id);

    const event_log =  await window.user.get_logByID(event_id);
    console.log(event_log);

    if(event_log){
        event_name.textContent = event_log[0].election_name;
        var start = new Date(event_log[0].vote_start*1000);
        var fin = new Date(event_log[0].vote_fin*1000);
        vote_start.textContent = formatter.format(start).replace(/\//g, '-').replace(', ', 'T');
        vote_fin.textContent = formatter.format(fin).replace(/\//g, '-').replace(', ', 'T');

        //候補者とかの記録の仕方忘れちったや
        candidate_list_for_json(candidate_list,event_log[0].candidate);

        //集計をモーダルで表示したいよねって話
        aggregation.addEventListener('click', async()=>{
            await window.user.aggregation(event_log[0].vote_list_id);
        });


    }
});

function candidate_list_for_json (table_obj, vector){

    const candidate_list = vector.map(data => JSON.parse(data).candidate);
    candidate_list.map((value) => {
        const tr_obj = document.createElement('tr');
        const candidate_name = document.createElement('td');
        candidate_name.textContent = value;
        tr_obj.appendChild(candidate_name);
        table_obj.appendChild(tr_obj);
    });
    
}