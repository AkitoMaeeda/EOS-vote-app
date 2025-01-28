const info = document.getElementById('info');
const candidate_table = document.getElementById('candidate_table');

const confirm = document.getElementById('confirm');
const close = document.getElementById('close');

const execute = document.getElementById('execute');
const back_button = document.getElementById('back');
const submit_button = document.getElementById('submit');
execute.style.display = 'none';

let select_candidate_name;
let event_id;
let author;


//候補を削除するイベントidの取得
window.Data.on_Data((data) => {
    event_id = data.event_id;
    author = data.author;
    const candidate_list = data.candidate_list;
    console.log(candidate_list);

    // HTMLの特定の要素にデータを反映 
    for(let i =0; i < candidate_list.length; i ++){
        candidate_list_for_json(candidate_table,candidate_list[i]);
    }
});

close.addEventListener('click', function(){
    window.modal.close_rem_modal();
});

back_button.addEventListener('click', function(){
    execute.style.display = 'none';
    confirm.style.visibility = 'visible';
});

submit_button.addEventListener('click', async(_e, _arg) => {
    await window.adm.rem_candidate(event_id, author, select_candidate_name);
});


//受け取った候補者リストをテーブルに
function candidate_list_for_json (table_obj, json_obj){
    const tr_obj = document.createElement('tr');
    const candidate_name = document.createElement('td');
    const rem = document.createElement('td');
    const rem_button = document.createElement('button'); 
    rem_button.textContent = "削除";

        
    //候補者の削除機能
    rem_button.addEventListener('click', function() {
        select_candidate_name = json_obj.candidate;
        confirm.style.visibility = 'hidden';
        execute.style.display = 'block';
    });

    candidate_name.textContent = json_obj.candidate;
    
    table_obj.appendChild(tr_obj);
    tr_obj.appendChild(candidate_name);
    tr_obj.appendChild(rem);
    rem.appendChild(rem_button);
}