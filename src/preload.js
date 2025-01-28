const { contextBridge, ipcRenderer, ipcMain } = require('electron');

contextBridge.exposeInMainWorld('modal', {

    vote_modal: (event_id, candidate_list) => ipcRenderer.invoke('vote-modal', event_id, candidate_list),

    add_modal: (event_id, author) => ipcRenderer.invoke('add-modal', event_id, author),

    rem_modal: (event_id, author, candidate_list) => ipcRenderer.invoke('rem-modal', event_id, author, candidate_list),

    mod_modal: (event_list) => ipcRenderer.invoke('mod-modal', event_list),

    fin_modal: (event_data) => ipcRenderer.invoke('fin-modal', event_data),

    close_vote_modal: () => ipcRenderer.invoke('close-vote-modal'),

    close_add_modal: () => ipcRenderer.invoke('close-add-modal'),

    close_rem_modal: () => ipcRenderer.invoke('close-rem-modal'),

    close_mod_modal: () => ipcRenderer.invoke('close-mod-modal'),

    close_fin_modal: () => ipcRenderer.invoke('close-fin-modal'),

    close_nfc_modal: () => ipcRenderer.invoke('close-nfc-modal'),

    close_aggregation_modal: () => ipcRenderer.invoke('close-aggregation-modal'),
});

contextBridge.exposeInMainWorld('user', {

    get_eventlist: () => ipcRenderer.invoke('get-eventlist'),

    get_eventlistByName: (name) => ipcRenderer.invoke('get-eventlistByName', name),

    get_eventlistByID: (event_id) => ipcRenderer.invoke('get-eventlistByID', event_id),

    get_candidate: (event_id, event_name) => ipcRenderer.invoke('get-candidate', event_id, event_name),

    get_logs: () => ipcRenderer.invoke('get-logs'),

    get_logByID: (event_id) => ipcRenderer.invoke('get-logByID', event_id),

    verification: (event_id, election_name) => ipcRenderer.invoke('verification', event_id, election_name),

    voting: (event_id, candidate_name, candidate_num) => ipcRenderer.invoke('vote', event_id, candidate_name, candidate_num),

    aggregation: (event_id) => ipcRenderer.invoke('aggregation', event_id),
});

contextBridge.exposeInMainWorld('adm', {

    create_account: (account_name) => ipcRenderer.invoke('create-account', account_name),

    create_new_event: (author, event_name, vote_start, vote_fin) => ipcRenderer.invoke('create-new-event', author, event_name, vote_start, vote_fin),

    change_event: (event_id, author, update_name, vote_start, vote_fin) => ipcRenderer.invoke('change-event', event_id, author, update_name, vote_start, vote_fin),

    change_event_name: (event_id, author, update_name) => ipcRenderer.invoke('change-event-name', event_id, author, update_name),

    change_time: (event_id, author, vote_start, vote_fin) => ipcRenderer.invoke('change-time', event_id, author, vote_start, vote_fin),

    add_candidate: (event_id, author, candidate_name) => ipcRenderer.invoke('add-candidate', event_id, author, candidate_name),

    rem_candidate: (event_id, author, candidate_name) => ipcRenderer.invoke('rem-candidate', event_id, author, candidate_name),

    fin_event: (event_id, privatekey_lamda, privatekey_mu) => ipcRenderer.invoke('fin-event', event_id, privatekey_lamda, privatekey_mu),
});

contextBridge.exposeInMainWorld('Data', {

    //nfcを読みとるモーダルとのデータの受け渡し
    on_Message: (callback) => {
        ipcRenderer.on('message', (_e, data,) => {
            console.log(data);
            callback(data);
        })
    },

    //モーダルとのメインウィンドウでデータの受け渡しを行う
    on_Data: (callback) => {
        ipcRenderer.on('modal-data', (_e,data) => {
            console.log(data);
            callback(data);
        })
    },

    on_Result: (callback) => {
        ipcRenderer.on('result', (_e,data) => {
            console.log(data);
            callback(data);
        })
    },

    on_Verification: (callback) => {
        ipcRenderer.on('asset', (_e,data) => {
            callback(data);
        })
    },


});

