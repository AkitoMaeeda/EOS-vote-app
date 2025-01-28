const admin = document.getElementById("admin");
const get_table = document.getElementById("get_table");
const get_log = document.getElementById("get_log");

admin.addEventListener('click', function(){
    window.location.href = 'adm/admin.html';
});

get_table.addEventListener('click', function(){
    window.location.href = 'user/eventlist.html';
});

get_log.addEventListener('click', function(){
    window.location.href = 'user/eventlog.html';
});