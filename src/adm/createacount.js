const create_account_form = document.getElementById('create_account');
const info = document.getElementById('info');
create_account_form.addEventListener('submit', async(event) => {
    //検証のためいったん送信の停止を行い、ページのリロードを防止する
    event.preventDefault();

    const account_name = document.getElementById('account_name').value;
    if((account_name.length === 12) || !/^[a-z0-9]+$/.test(account_name)){
        console.log (account_name);

        const result = await window.adm.create_account(account_name);

        if(result){
            info.textContent = 'ユーザー['+result+']の作成が完了しました。';
        }else{
            info.textContent = 'トランザクションの送信に失敗しました';
        }

    }else{
        info.textContent = 'フォーマットが間違っています';
    }
});