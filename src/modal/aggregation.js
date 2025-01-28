

//集計結果のjson({candidate: "", result: ""})を受け取り、それをテーブルにして表示する。
const info = document.getElementById('info');
const aggregation_table = document.getElementById('aggregation');

const close = document.getElementById('close');

window.Data.on_Data((data) => {
    const aggregation_json = data.result;
    console.log(aggregation_json);

    for(let i=0; i<aggregation_json.length; i++){
        aggregation_list_for_json(aggregation_table, aggregation_json[i]);
    }
});

close.addEventListener('click', function(){
    window.modal.close_aggregation_modal();
});

function aggregation_list_for_json(table_obj, json_data){
    const tr_obj = document.createElement('tr');
    const candidate_name = document.createElement('td');
    const result = document.createElement('td');

    candidate_name.textContent = json_data.candidate;
    result.textContent = json_data.vote_result;
    table_obj.appendChild(tr_obj);
    tr_obj.appendChild(candidate_name);
    tr_obj.appendChild(result);
}