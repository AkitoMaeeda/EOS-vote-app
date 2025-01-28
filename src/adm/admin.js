const event_button = document.getElementById("create_event");
const account_button = document.getElementById("create_account");
const mod_button = document.getElementById("modification");
const agg_button = document.getElementById("aggregation");

event_button.addEventListener('click', function() {
    window.location.href = 'createevent.html';
});
account_button.addEventListener('click', function() {
    window.location.href = 'createaccount.html';
});
mod_button.addEventListener('click', function() {
    window.location.href = 'modification.html';
});
agg_button.addEventListener('click', function() {
    window.location.href = 'finevent.html';
});
