const info = document.getElementById('info');
const candidate_table = document.getElementById('candidate_table');

const confirm = document.getElementById('confirm');
const close = document.getElementById('close');

const execute = document.getElementById('execute');
const back_button = document.getElementById('back');
const submit_button = document.getElementById('submit');
execute.style.display = 'none';

let select_candidate_name;
let select_candidate_num;
let event_id;

//候ベント
window.Data.on_Data((data) => {
    event_id = data.event_id;
    const candidate_list = data.candidate_list;
    console.log(candidate_list);
    // HTMLの特定の要素にデータを反映
    for(let i =0; i < candidate_list.length; i ++){
        candidate_list_for_json(candidate_table,candidate_list[i]);
    }
});

close.addEventListener('click', function(){
    window.modal.close_vote_modal();
});

back_button.addEventListener('click', function(){
    execute.style.display = 'none';
    confirm.style.visibility = 'visible';
    
});

submit_button.addEventListener('click', async(_e, _arg) => {
    try{
        await window.user.voting(event_id,select_candidate_name, select_candidate_num);
        info.textContent = '候補者"'+ select_candidate_name +'"への投票が完了しました';
    }catch(error){
        info.textContent = '投票に失敗しました';
    }
    execute.style.display = 'none';
    confirm.style.visibility = 'visible';
});


//受け取った候補者リストをテーブルに
function candidate_list_for_json (table_obj, json_obj){
    const tr_obj = document.createElement('tr');
    const candidate_name = document.createElement('td');
    const vote = document.createElement('td');
    const vote_button = document.createElement('button'); 
    vote_button.textContent = "投票";

    vote_button.addEventListener('click', function() {
        select_candidate_num = json_obj.candidate_num;
        select_candidate_name = json_obj.candidate;
        info.textContent = '候補"'+select_candidate_name+'"に投票します';
        execute.style.display = 'block';
        confirm.style.visibility = 'hidden';
    });

    candidate_name.textContent = json_obj.candidate;
    
    table_obj.appendChild(tr_obj);
    tr_obj.appendChild(candidate_name);
    tr_obj.appendChild(vote);
    vote.appendChild(vote_button);
}