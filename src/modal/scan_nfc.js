const close = document.getElementById('close');

close.addEventListener('click', function() {
    window.modal.close_nfc_modal();
});

//モーダルに表示するメッセージを受け取り、出力
window.Data.on_Message((data) => {
    console.log(data.message);
    const text = document.getElementById('text');
    text.textContent = data.message;
});








