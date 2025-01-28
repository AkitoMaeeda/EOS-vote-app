const info = document.getElementById('info');
const add_form = document.getElementById('add_candidate');

const confirm = document.getElementById('confirm');
const close = document.getElementById('close');
const next_button = document.getElementById('next');

const execute = document.getElementById('execute');
const back_button = document.getElementById('back');
execute.style.display = 'none';

let candidate_name;
let event_id;
let author;


// ポップアップウィンドウでデータを受け取る

window.Data.on_Data((data)=>{
    event_id = data.event_id;
    author = data.author;
});

//候補者の追加に関する処理


close.addEventListener('click', function(){
    window.modal.close_add_modal();
});

back_button.addEventListener('click', function(){
    execute.style.display = 'none';
    confirm.style.visibility = 'visible';
    info.textContent = '';
});

next_button.addEventListener('click', async(_e,_arg) => {
    candidate_name = document.getElementById('candidate_name').value;
    //メッセージの作成
    info.textContent = '候補”'+candidate_name+'”を追加します';
    confirm.style.visibility = 'hidden';
    execute.style.display = 'block';
});

add_form.addEventListener('submit', async () => {
    await window.adm.add_candidate(event_id, author, candidate_name );

});















