const info = document.getElementById('info');
const add_form = document.getElementById('add_deckey');

const close = document.getElementById('close');

let event_data;
let privatekey_lamda;
let privatekey_mu;

window.Data.on_Data((data)=>{
    event_data = data.event_data;
    console.log(event_data.vote_list_id);
    info.textContent = event_data.election_name+"の復号鍵を入力してください"
});

close.addEventListener('click', function(){
    window.modal.close_fin_modal();
});

add_form.addEventListener('submit', async () => {
    privatekey_lamda = document.getElementById('key_lamda').value;
    privatekey_mu = document.getElementById('key_mu').value;
    try{
        await window.adm.fin_event(event_data.vote_list_id, privatekey_lamda, privatekey_mu);
        info.textContent = '復号鍵の追加が完了しました。集計が可能になりました';
    }catch(error){
        info.textContent = '復号鍵の追加に失敗しました';
    }
});





