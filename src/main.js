const { app, BrowserWindow, ipcMain} = require('electron');
const path = require("path");

const {
    get_event,
    get_eventByName,
    get_eventByID,
    get_candidate,
    get_logs,
    get_log_ByID,
    get_asset,
    voting,
    aggregation,
    create_account,
    create_event,
    update_event,
    update_event_name,
    update_event_time,
    add_candidate,
    rem_candidate,
    fin_event,
    stopProcess
} = require('./tx_list.js');


const createWindow = () => {
    const mainWindow =  new BrowserWindow({
        width: 800,
        height: 1000,
        title: "vote_app",
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            preload: path.join(__dirname, 'preload.js'),

    }
    });

    //f12のツールを別ウインドウに
    mainWindow.webContents.openDevTools({ mode: 'detach' });

    mainWindow.loadFile('index.html');
    //外部管理...???
    let vote_modal;
    let add_modal;
    let rem_modal;
    let mod_modal;
    let fin_modal;
    let nfc_modal;
    let aggregation_modal;

    //ポップアップの定義

    const addModal = (event_id, author) =>{
        add_modal = new BrowserWindow({
            width: 600,
            height: 400,
            parent: mainWindow,
            modal: true,
            frame: false, 
            webPreferences: {
                contextIsolation: true,
                nodeIntegration: false,
                preload: path.join(__dirname, 'preload.js'),
            }
        });

        add_modal.webContents.once('did-finish-load', () =>{
            add_modal.webContents.send('modal-data', {event_id, author});
        });

        add_modal.webContents.openDevTools({ mode: 'detach'});
        add_modal.loadFile('modal/add_modal.html');

    }

    const remModal = (event_id, author, candidate_list) =>{
        rem_modal = new BrowserWindow({
            width: 600,
            height: 400,
            parent: mainWindow,
            modal: true,
            frame: false,

            webPreferences: {
                contextIsolation: true,
                nodeIntegration: false,
                preload: path.join(__dirname, 'preload.js'),
            }
        });

        rem_modal.webContents.once('did-finish-load', () =>{
            rem_modal.webContents.send('modal-data', {event_id, author, candidate_list });
        });

        rem_modal.webContents.openDevTools({ mode: 'detach' });
        rem_modal.loadFile('modal/rem_modal.html');
    }

    const modificationModal = (event_list) =>{
        mod_modal = new BrowserWindow({
            width: 600,
            height: 400,
            parent: mainWindow,
            modal: true,
            frame: false,
            webPreferences: {
                contextIsolation: true,
                nodeIntegration: false,
                preload: path.join(__dirname, 'preload.js'),
            }
        });
        mod_modal.webContents.once('did-finish-load', () =>{
            console.log(event_list);
            mod_modal.webContents.send('modal-data', {event_list});
        });

        mod_modal.webContents.openDevTools({ mode: 'detach' });
        mod_modal.loadFile('modal/mod_modal.html');

    }

    const finModal = (event_data) => {
        fin_modal = new BrowserWindow({
            width: 600,
            height: 400,
            parent: mainWindow,
            modal: true,
            frame: false,
            webPreferences: {
                contextIsolation: true,
                nodeIntegration: false,
                preload: path.join(__dirname, 'preload.js'),
            }
        });

        fin_modal.webContents.once('did-finish-load', () =>{
            console.log(event_data);
            fin_modal.webContents.send('modal-data', {event_data});
        });

        fin_modal.webContents.openDevTools({mode: 'detach' });
        fin_modal.loadFile('modal/fin_modal.html');
    }

    const voteModal = (event_id, candidate_list) => {

        vote_modal = new BrowserWindow({
            width: 600,
            height: 400,
            parent: mainWindow,
            modal: true,
            frame: false,
            webPreferences: {
                contextIsolation: true,
                nodeIntegration: false,
                preload: path.join(__dirname, 'preload.js'),
            }
        });

        vote_modal.webContents.once('did-finish-load', () =>{
            vote_modal.webContents.send('modal-data', {event_id, candidate_list});
        });

        vote_modal.webContents.openDevTools({mode: 'detach' });
        vote_modal.loadFile('modal/vote_modal.html');
    }

    const aggregationModal = () => {

        aggregation_modal = new BrowserWindow({
            width: 600,
            height: 400,
            parent: mainWindow,
            modal: true,
            frame: false,
            webPreferences: {
                contextIsolation: true,
                nodeIntegration: false,
                preload: path.join(__dirname, 'preload.js'),
            }
        });

        aggregation_modal.webContents.openDevTools({mode: 'detach' });
        aggregation_modal.loadFile('modal/aggregation.html');

    }

    //nfcを読みとる際に用いるモーダル
    const scan_nfc_modal = () => {
        nfc_modal = new BrowserWindow({
            width: 600,
            height: 400,
            parent: mainWindow,
            modal:true,
            frame: false,
            webPreferences: {
                contextIsolation: true,
                nodeIntegration: false,
                preload: path.join(__dirname, 'preload.js'),
            }
        });
        nfc_modal.webContents.openDevTools({ mode: 'detach' });

        var message = 'nfcをかざしてください';
        nfc_modal.webContents.once('did-finish-load', () =>{
            nfc_modal.webContents.send('message', {message});
        });
        nfc_modal.loadFile('modal/scan_nfc.html');
        return nfc_modal;
    }


//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

    //user関係の処理
    ipcMain.handle('get-eventlist', async (_e, _arg) => {
        console.log('get-eventlsit');
        const eventlist = await get_event();
        return eventlist;
    });

    ipcMain.handle('get-eventlistByName', async (_e, _arg) => {
        console.log('get-eventlsitByName');
        const eventlist = await get_eventByName();
        return eventlist;
    });

    ipcMain.handle('get-eventlistByID', async (_e, event_id) => {
        console.log('get-eventlsitByID');
        const eventlist = await get_eventByID(event_id);
        return eventlist;
    });

    ipcMain.handle('get-candidate', async (_e, event_id, event_name) => {
        console.log('get-candidate');
        const candidate = await get_candidate(event_id, event_name);
        return candidate;
    });

    ipcMain.handle('get-logs', async (_e, _args) => {
        const logs = await get_logs();
        return logs;
    });

    ipcMain.handle('get-logByID', async(_e, event_id) => {
        const log = await get_log_ByID(event_id);
        return log;
    });

    ipcMain.handle('verification', async (_e, event_id, election_name) => {
        console.log('verification');
        var modal = scan_nfc_modal();
        var message;
        try{
            await get_asset(event_id, election_name);
            message = '投票済みです';
            modal.webContents.send('message', {message});
        }catch(error){
            //エラーメッセージをモーダルのレンダラープロセスへ送信
            message = error;
            modal.webContents.send('message', {message});
      }
    });



    ipcMain.handle('vote', async (_e, event_id, candidate, candidate_num) => {
        var modal = scan_nfc_modal();
        var message;
        console.log('lets vote');
        try{
            vote_modal.destroy();
            await voting(event_id, candidate, candidate_num);
            message = '候補"'+candidate+'"への投票が完了しました';
            modal.webContents.send('message', {message});
        }catch(error){
            message = error.message;
            modal.webContents.send('message', {message});
            throw new Error();
        }
    });

    //集計処理
    ipcMain.handle('aggregation', async(_e, event_id) => {
        //aggregation_modalの作成
        var modal = aggregationModal();
        console.log('aggregation');
        var message;
        try{
            const result = await aggregation(event_id);
            aggregation_modal.webContents.send('modal-data', {result});
        }catch(error){
            message = error.message;
            aggregation_modal.webContents.send('modal-data', {message});
            throw new Error();
        }


    });





    //管理者系の操作

    ipcMain.handle('create-account', async (_e,new_account_name) => {
        console.log('create-accountするよん');
        //モーダルの作成
        var modal = scan_nfc_modal();
        var message;
        try{
            const result = await create_account(new_account_name);
            message = 'アカウント：'+ result + 'の作成が完了しました。';
            modal.webContents.send('message', {message});
            return result;
        }catch(error){
            //エラーメッセージをモーダルのレンダラープロセスへ送信
            message = error;
            modal.webContents.send('message', {message});
      }

    });

    ipcMain.handle('create-new-event', async(_e, author, eventname, vote_start, vote_fin) => {
        var modal = scan_nfc_modal();
        var message;
        console.log('create-new-event');
        try{
            await create_event(author, eventname, vote_start, vote_fin);
            message = '新規イベント"'+eventname+'"の作成が完了しました';
            modal.webContents.send('message', {message});
        }catch(error){
            message = error;
            modal.webContents.send('message', {message});
            throw new Error();
        }
    });

    ipcMain.handle('change-event', async (_e, event_id, author, update_name, vote_start, vote_fin)=>{
        var modal = scan_nfc_modal();
        var message;
        console.log('change-event');
        try{
            mod_modal.destroy();
            await update_event(event_id, author, update_name, vote_start, vote_fin);
            message = 'イベント名を"'+ update_name +'"に変更しました\nイベント期間を変更しました。';
            modal.webContents.send('message', {message});
            await mainWindow.reload();
            mainWindow.webContents.send('result', { message });
            return;
            
        }catch(error){
            message = error;
            modal.webContents.send('message', {message});
            throw new Error();
        }
    });

    ipcMain.handle('change-event-name', async (_e,event_id, author, update_name) => {
        var modal = scan_nfc_modal();
        var message;
        console.log('change-event-name');
        try{
            mod_modal.destroy();
            await update_event_name(event_id, author, update_name);
            message = 'イベント名を"'+ update_name +'"に変更しました';
            modal.webContents.send('message', {message});
            await mainWindow.reload();
            mainWindow.webContents.send('result', { message });
            return;
        }catch(error){
            message = error;
            modal.webContents.send('message', {message});
            throw new Error();
        }
    });

    ipcMain.handle('change-time', async (_e,event_id, author, vote_start, vote_fin) => {
        var modal = scan_nfc_modal();
        var message;
        console.log('change-time');
        try{
            mod_modal.destroy();
            await update_event_time(event_id, author, vote_start, vote_fin);
            const start = new Date(vote_start*1000);
            const fin = new Date(vote_fin*1000);
            vote_start= start.toISOString().slice(0,16);
            vote_fin = fin.toISOString().slice(0,16);
            message = 'イベント期間を'+ vote_start +'~'+ vote_fin +'に変更しました';
            modal.webContents.send('message', {message});
            await mainWindow.reload();
            mainWindow.webContents.send('result', { message });
            return;
        }catch(error){
            message = error;
            modal.webContents.send('message', {message});
            mainWindow.webContents.send('result', {message});
            throw new Error();
        }
    });

    ipcMain.handle('add-candidate', async (_e,event_id, author, candidate_name) => {
        var modal = scan_nfc_modal();
        var message;
        console.log('add-candidate');
        try{
            add_modal.destroy();
            await add_candidate(event_id, author, candidate_name);
            message = '候補"'+ candidate_name +'"が追加されました';
            modal.webContents.send('message', {message});
            await mainWindow.reload();
            mainWindow.webContents.send('result', { message });
            return;
        }catch(error){
            message = error;
            modal.webContents.send('message', {message});
            mainWindow.webContents.send('result', {message});
            throw new Error();
        }
    });

    ipcMain.handle('rem-candidate', async (_e,event_id, author, candidate_name) => {
        var modal = scan_nfc_modal();
        var message;
        console.log('rem-candidate');
        try{
            rem_modal.destroy();
            await rem_candidate(event_id, author, candidate_name);
            message = '候補"'+ candidate_name +'"が削除されました';
            modal.webContents.send('message', {message});
            await mainWindow.reload();
            mainWindow.webContents.send('result', { message });
            return;
        }catch(error){
            message = error;
            modal.webContents.send('message', {message});
            mainWindow.webContents.send('result', {message});
            throw new Error();
        }
    });

    ipcMain.handle('fin-event', async (_e, event_id, privatekey_lamda, privatekey_mu)=>{
        var modal = scan_nfc_modal();
        var message;
        console.log('fin-event');
        //面倒だからここで集計期間内かどうかを確認する
        try{
            fin_modal.destroy();
            await fin_event(event_id, privatekey_lamda, privatekey_mu);
            message = '集計が可能になりました';
            modal.webContents.send('message', {message});
            await mainWindow.reload();
            mainWindow.webContents.send('result', {message});
            return;
        }catch(error){
            message = error;
            modal.webContents.send('message', {message});
            mainWindow.webContents.send('result', {message});
            throw new Error();
        }
    });

    //モーダル関連の処理
    ipcMain.handle('add-modal', async (_e, event_id, author) => {
        addModal(event_id, author);
    });
    ipcMain.handle('rem-modal', async (_e, event_id, author, candidate_list) => {
        remModal(event_id, author, candidate_list);
    });
    ipcMain.handle('mod-modal', async (_e, event_list) => {
        modificationModal(event_list);
    });
    ipcMain.handle('fin-modal', async (_e, event_data) => {
        finModal(event_data);
    });
    ipcMain.handle('vote-modal', async (_e, event_id, candidate_list) => {
        try{
            voteModal(event_id,candidate_list);
        }catch(error){
            throw error;
        }
    });

    ipcMain.handle('close-add-modal', () => {
        if(add_modal){
            add_modal.destroy();
        }
    });
    ipcMain.handle('close-rem-modal', () => {
        if(rem_modal){
            rem_modal.destroy();
        }
    });
    ipcMain.handle('close-mod-modal', () => {
        if(mod_modal){
            mod_modal.destroy();
        }
    });
    ipcMain.handle('close-fin-modal', () => {
        if(fin_modal){
            fin_modal.destroy();
        }
    });
    ipcMain.handle('close-vote-modal', ()=>{
        if(vote_modal){
            vote_modal.destroy();
        }
    });
    ipcMain.handle('close-nfc-modal', async (_e, _arg)=>{
        if(nfc_modal){
            await stopProcess();
            nfc_modal.destroy();
        }
    });
    ipcMain.handle('close-aggregation-modal', ()=>{
        if(aggregation_modal){
            aggregation_modal.destroy();
        }
    });
}




app.once('ready', () => {
    createWindow();
});

app.once('window-all-closed', () => app.quit());