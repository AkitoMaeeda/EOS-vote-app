const { exec, execFile } = require('child_process');
const { Api, JsonRpc } = require('eosjs');
let { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');  // development only
const fetch = require('node-fetch'); 
const { TextDecoder, TextEncoder } = require('util'); 
const rpc = new JsonRpc('https://jungle4.cryptolions.io:443', { fetch }); //required to read blockchain state

const privateKey = [/*votetestuser private key*/];
const signatureProvider = new JsSignatureProvider(privateKey);
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() }); //required to submit transactions
const ecc = require('eosjs-ecc');
const crypto = require('crypto');
const Arweave = require('arweave');
const paillierBigint = require('paillier-bigint');


const { error } = require('console');
const { throwDeprecation } = require('process');
const { decrypt } = require('dotenv');
const math = require('mathjs');
const fs = require('fs');
//test sign key.
const sign_privateKey = '5KAxuHcyV8H1izFXXfhiZJfd7LMYisqxZiQ9nZT27KpyD6JEAL3';


const arweave = Arweave.init({
    host: '127.0.0.1',
    port: 1984,
    protocol: 'http'
});

//paillier package.

//admin child process.
let exe_process;


const app_account = 'votetestuser';
const event_admin = 'voteofevents';

//------------------------get_table--------------------------//

//Get event from voteofevents
async function get_event() {
    try{
        const eventlist_Result = await rpc.get_table_rows({
            json: true,
            code: 'voteofevents',
            scope: 'voteofevents',
            table: 'neweventlist',
            limit: 50
        });
        const eventlist_Rows = eventlist_Result.rows;

        if(eventlist_Rows.length === 0){
            console.log('event list not found');
            return;
        }
        return eventlist_Rows;
    }catch(error){
        console.error('Error fetching data:', error);
        return;
    }
}

async function get_eventByName(event_name) {
    try{
        const eventlist_Result = await rpc.get_table_rows({
            json: true,
            code: 'voteofevents',
            scope: 'voteofevents',
            table: 'neweventlist',
            limit: 1,
            lower_bound: event_name,
            index_position: 2

        });
        const eventlist_Rows = eventlist_Result.rows;
        if(eventlist_Rows.length === 0){
            console.log('event list not found');
            return;
        }
        return eventlist_Rows;
    }catch(error){
        console.error('Error fetching data:', error);
        return;
    }
}

//id
async function get_eventByID(event_id) {
    try{
        const eventlist_Result = await rpc.get_table_rows({
            json: true,
            code: 'voteofevents',
            scope: 'voteofevents',
            table: 'neweventlist',
            limit: 1,
            lower_bound: event_id

        });
        const eventlist_Rows = eventlist_Result.rows;

        if(eventlist_Rows.length === 0){
            console.log('event list not found');
            return;
        }
        return eventlist_Rows;
    }catch(error){
        console.error('Error fetching data:', error);
        return;
    }
}


//Get candidate from voteofevents.
async function get_candidate(eventlist_id, event_name) {
    try{
        console.log("get-candidate");
        const candidate_Result = await rpc.get_table_rows({
            json: true,
            code: 'voteofevents',
            scope: event_name,
            table: 'newvotelists',
            limit: 1000,
            lower_bound: eventlist_id
        });
        const candidateRows = candidate_Result.rows;
        if(candidateRows.length === 0){
            console.log('candidates not found');
            return;
        }
        console.log(candidateRows[1]);
        return candidateRows;
    }catch(error){
        console.error('Error fetching data:', error);
        return;
    }
}

//verification
async function get_asset(event_id, election_name) {
    try{

        //Generate address.
        var usr_adr = await gen_eth_add(event_id);
        console.log(usr_adr.toString());
        var usr_hash = await crypto.createHash('sha256').update(usr_adr.trim()).digest('hex');

        console.log(election_name);
        console.log(usr_hash);
        try{
            console.log(usr_hash);
            const vote_info = await rpc.get_table_rows({
                json: true,
                code: 'aggregations',
                scope: election_name,
                table: 'voteboxs',
                index_position: 3,
                key_type: 'sha256',
                lower_bound: usr_hash,
                upper_bound: usr_hash,
                limit: 1,
            });
            console.log(usr_hash);

            const voteboxRows = vote_info.rows;
            console.log(vote_info.rows[0]);
            if (voteboxRows.length !== 0) {
                return;
            }else{
                console.log('No records found for the given voter.');
                throw new Error("Vote not found...");
            }
        }catch(error){
            console.error(error.message);
            throw error.message;
        }

            //??????arlocal??g?????U?N?V?????????R?[?h????
    }catch(error){
        console.log(error)
        throw error;
    }
}

//Get log
async function get_logs() {
    try{
        const list = await rpc.get_table_rows({
            json: true,
            code: 'aggregations',
            scope: 'aggregations',
            table: 'votelogs',
            limit: 50,
        });
        const list_rows = list.rows;
        if(list_rows.length === 0){
            console.log('Nothing log....');
            return null;
        }
        console.log(list_rows[0]);
        return list_rows;
    }catch(error){
        console.error('Error fetching data:', error);
        return null;
    }  
}

async function get_log_ByID(event_id){
    try{
        const list = await rpc.get_table_rows({
            json: true,
            code: 'aggregations',
            scope: 'aggregations',
            table: 'votelogs',
            limit: 50,
            lower_bound: event_id,
        });
        const list_rows = list.rows;
        if(list_rows.length === 0){
            console.log('Nothing log....');
            return;
        }
        console.log(list.rows[0]);
        return list_rows;
    }catch(error){
        console.log('Error fetching data:', error);
        return;
    }
}

//------------------------push_action--------------------------//

//createaccount
async function create_account(new_account_name) {
    try{
        console.log("account_name:"+new_account_name);
        const usr_private_key = await gen_private_key();
        const usr_public_key = await gen_public_key(usr_private_key.trim());
        console.log("publickey_n:"+usr_public_key);
        try{
            const result = await api.transact({
                actions:[
                    //?A?J?E???g???
                    {
                    account: 'eosio',
                    name: 'newaccount',
                    authorization: [{
                        actor: 'votetestuser',
                        permission: 'active',
                    }],
                    data: {
                        creator: 'votetestuser',
                        name: new_account_name,
                        owner: {
                            threshold: 1,
                            keys: [{
                                key: usr_public_key,
                                weight: 1
                            }],
                            accounts: [],
                            waits: []
                        },
                        active: {
                            threshold: 1,
                            keys: [{
                                key: usr_public_key,
                                weight: 1
                            }],
                            accounts: [],
                            waits: []
                        },
                    },
                },
                //???????A?J?E???g????\?[?X??m??
                {
                    account: 'eosio',
                    name: 'buyram',
                    authorization: [{
                        actor: 'votetestuser',
                        permission: 'active',
                    }],
                    data: {
                        payer: 'votetestuser',
                        receiver: new_account_name,
                        quant: '5.0000 EOS'
                    },
                },
                //???\?[?X????L
                {
                    account: 'eosio',
                    name: 'delegatebw',
                    authorization: [{
                        actor: 'votetestuser',
                        permission: 'active',
                    }],
                    data: {
                        from: 'votetestuser',
                        receiver: new_account_name,
                        stake_net_quantity: '10.0000 EOS',
                        stake_cpu_quantity: '10.0000 EOS',
                        //???n????????L??
                        transfer: false,
                    }
                }]
            },{
                blocksBehind: 3,
                expireSeconds: 30,
            });
            if(result.processed.receipt.status === 'executed'){
                return result.processed.action_traces[0].act.data.name;
            }else{
                return false;
            }
        //?g?????U?N?V????????M?G???[
        }catch(error){
            console.error('Create Error :', error);
            return new Error("トランザクションが正常に承認されませんでした");
        }

    }catch(error){
        console.log(error)
        throw new Error(error.message);
    }

}

//???[
async function voting(event_id, candidate_name, candidate_num) {

    try{

        var usr_adr;
        //Generate address.
        try{
            usr_adr = await gen_eth_add(event_id);
            usr_adr = usr_adr.trim();
        }catch(error){
            throw new Error("アドレスの生成に失敗しました");
        }

        //Set param
        const event_info = await get_eventByID(event_id);
        const election_name = event_info[0].election_name;
        const arlocal_trx_id = event_info[0].enckey_trx_id;

        //Get Publickkey from Arlocal transaction ID
        const seachTransaction = await arweave.transactions.get(arlocal_trx_id);
        const data = JSON.parse(Buffer.from(seachTransaction.data).toString());
        console.log(data.election_name);

        //Ceate publickkey object
        const restore_publicKey = new paillierBigint.PublicKey(
            BigInt(data.publickey_n),
            BigInt(data.publicKey_g)
        );

        //encrypt
        const encrypt = restore_publicKey.encrypt(candidate_num); 

        //set vote data 
        const vote_data = {
            event_id: event_id,
            voter: usr_adr,
            encrypt: encrypt.toString(),
        }

        //create arlocal transaction
        const vote_trx_id = await create_arlocal(vote_data);

        //create sign
        const msg = usr_adr + vote_trx_id;
        console.log("mdg="+msg.trim());
        const hash = ecc.sha256(msg.trim());
        console.log("hash: "+hash.toString('hex'));

        const signature = await ecc.signHash(hash, sign_privateKey);
        const binSignature = ecc.Signature.fromString(signature).toBuffer();
        const hex_signature = binSignature.toString('hex');
        console.log('signature:',hex_signature);

        try{
            const result = await api.transact({
                actions: [
                    {
                    account: 'voteofevents',
                    name: 'voting',
                    authorization:[{
                        actor: 'votetestuser',
                        permission: 'active',
                    }],
                    data: {
                        vote_list_id: event_id,
                        voter: usr_adr,
                        arlocal_trx_id: vote_trx_id,
                        sig: hex_signature
                    }
                }]
            },{
                blocksBehind: 3,
                expireSeconds: 30,
            });

            console.log("vote ok..."+JSON.stringify(result));
        }catch(error){
            console.error('Create Error :', error);
            throw new Error("トランザクションが正常に承認されませんでした");
        }
    }catch(error){
        throw new Error(error);
    }

}

async function aggregation(event_log_id){

    const log_data = await get_log_ByID(event_log_id);

    //イベント名
    const election_name = log_data[0].election_name;
    //候補者リスト
    const candidate = log_data[0].candidate;

    const candidate_list = candidate.map(data => JSON.parse(data).candidate);

    const candidate_values = candidate.map(data => JSON.parse(data).candidate_num);
    
    //Create left side hand
    const lhs = math.matrix([
        candidate_values,
        new Array(candidate_values.length).fill(1)
    ]);
    console.log(lhs);

    //取得する票数
    const total = log_data[0].total_vote;
    console.log(total);
    
    //鍵
    const enckey_trx_id = log_data[0].enckey_trx_id;
    const deckey_trx_id = log_data[0].deckey_trx_id;

    const enc_seachTransaction = await arweave.transactions.get(enckey_trx_id);
    const enckey_data = JSON.parse(Buffer.from(enc_seachTransaction.data).toString());

    const dec_seachTransaction = await arweave.transactions.get(deckey_trx_id);
    const deckey_data = JSON.parse(Buffer.from(dec_seachTransaction.data).toString());

    const restore_publicKey = new paillierBigint.PublicKey(
        BigInt(enckey_data.publickey_n),
        BigInt(enckey_data.publicKey_g)
    );

    const restore_privateKey = new paillierBigint.PrivateKey(
        BigInt(deckey_data.privatekey_lamda),
        BigInt(deckey_data.privateKey_mu),
        restore_publicKey
    );

    //結果を入れる用の配列[0,0,0,....]
    let result = new Array(candidate_values.length).fill(0);
    console.log("result"+result);

    let result_info;
    //100票ずつ処理
    for(let iscm = 0; iscm <= total; iscm+=100){
        try{
            const vote_info = await rpc.get_table_rows({
                json: true,
                code: 'aggregations',
                scope: election_name,
                table: 'voteboxs',
                lower_bound: iscm,
                upper_bound: iscm+99,
                limit: 100,
            });

            const voteboxRows = vote_info.rows;
            if (voteboxRows.length !== 0) {
                console.log("vote_sum: "+voteboxRows.length);
                //合計値の保管
                let block_sum;
                //票の値を取り出して足す(後々map関数にしたいかも　下の奴も)
                for(let j = 0; j < voteboxRows.length; j++){
                    const seachTransaction = await arweave.transactions.get(voteboxRows[j].vote_trx_id);
                    console.log(voteboxRows[j].vote_trx_id);
                    const vote_data = JSON.parse(Buffer.from(seachTransaction.data).toString()).encrypt;
                    const vote = BigInt(vote_data.trim());
                    //add
                    if(j === 0){
                        block_sum = vote;
                    }else{
                        block_sum = restore_publicKey.addition(block_sum, vote);
                        }
                }

                //合計値の復号
                const decrypt_votes = Number(restore_privateKey.decrypt(block_sum));
                console.log(decrypt_votes);

                //Ceate right hand side 右辺を作成 
                const rhs = math.matrix([[decrypt_votes], [total]]);
                console.log(rhs);

                //連立を解く
                try{
                    var solution = math.lusolve(lhs, rhs);
                    solution = solution._data;
                    console.log("sol="+solution[1][0]);

                    //解に小数点が含まれているとき
                    if(solution.some(row => row.some(value => !Number.isInteger(value)))){
                        console.log("let's get again.....");
                        //仕分け用の箱
                        let vote_box = new Array(candidate_values.length).fill(0);
                        //再取得
                        for(let l = 0; l < voteboxRows.length; l++){
                            const seachTransaction = await arweave.transactions.get(voteboxRows[l].vote_trx_id);
                            const vote_data = JSON.parse(Buffer.from(seachTransaction.data).toString()).encrypt;
                            const vote = BigInt(vote_data);
                            const decrypt_vote = restore_privateKey.decrypt(vote);

                            //候補者ナンバーのリストに等しいものがあればok
                            candidate_values.forEach((value, index) => {
                               if(value == decrypt_vote){
                                vote_box[index] +=1;
                                }
                            });
                        }
                        //結果に有効票の追加
                        result = result.map((value,index) => value + vote_box[index][0]);

                    //正常に解けたとき
                    }else{
                        console.log("ok...!");
                        result = result.map((value,index) => value + solution[index][0]);
                        result_info = Array.from(candidate_list).map((candidate, index) => ({
                            candidate: candidate,
                            vote_result: result[index]
                        }));
                        console.log(result_info);
                    }
                }catch(error){
                    //そもそも解けなかったとき
                    console.log("error");
                    console.log("let's get again.....");
                    //仕分け用の箱
                    let vote_box = new Array(candidate_values.length).fill(0);
                    //再取得
                    for(let l = 0; l < voteboxRows.length; l++){
                        const seachTransaction = await arweave.transactions.get(voteboxRows[l].vote_trx_id);
                        const vote_data = JSON.parse(Buffer.from(seachTransaction.data).toString()).encrypt;
                        const vote = BigInt(vote_data.trim());
                        const decrypt_vote = restore_privateKey.decrypt(vote);
                        console.log("num="+decrypt_vote);

                        //候補者ナンバーのリストに等しいものがあればok
                        candidate_values.forEach((value, index) => {
                            console.log(value);
                           if(value == decrypt_vote){
                            console.log("ok");
                            vote_box[index] +=1;
                            }
                        });
                    }
                    //結果に有効票の追加
                    result = result.map((value,index) => value + vote_box[index]);
                    result_info = Array.from(candidate_list).map((candidate, index) => ({
                        candidate: candidate,
                        vote_result: result[index]
                    }));
                }
            }

            return result_info;
        }catch(error){
            console.error(error.message);
            throw error.message;
        }
    }
}












//-------------------------------------------------------------//
//--------------------管理者の処理-----------------------//
//-------------------------------------------------------------//


//???[?C?x???g???
async function create_event(usr_name, eventname, start, fin) {

    //?????????o?^
    const {publicKey, privateKey} = await paillierBigint.generateRandomKeys(2048);

    console.log(eventname);

    //?L?^??????f?[?^???
    const key_data = {
        election_name: eventname.toString(),
        publickey_n: publicKey.n.toString(),
        publicKey_g: publicKey.g.toString(),
    };

    //???????o??
    console.log('privatekey_lamda: '+privateKey.lambda.toString());
    console.log('privatekey_mu: '+privateKey.mu.toString());

    //???f?[?^??o?^

    const arlocal_trx_id = await create_arlocal(key_data);

    //eos?A?N?V???????
    const action = [{
        account: 'voteofevents',
        name: 'createevent',
            authorization: [{
            actor: usr_name,
            permission: 'active',
            }],
            data: {
                election_name: eventname,
                author: usr_name,
                authorized_accounts: [usr_name],
                vote_start: start,
                vote_fin: fin,
                arlocal_trx_id: arlocal_trx_id,
            }
        }];
    
    try{
        await admin_event(action);
        console.log('create_complete\n');
    }catch(error){
        console.error('Create Error :', error);
        throw new Error("トランザクションが正常に承認されませんでした");
    }
}

//名前と時間どっちも
async function update_event(event_id, usr_name, update_name, vote_start, vote_fin){

    const action = [{
        account: 'voteofevents',
            name: 'updeventtime',
            authorization: [{
            actor: usr_name,
            permission: 'active',
            }],
            data: {
                vote_list_id: event_id,
                authorized_account: usr_name,
                vote_start: vote_start,
                vote_fin: vote_fin
            }
    },

    {
        account: 'voteofevents',
            name: 'updeventname',
            authorization: [{
            actor: usr_name,
            permission: 'active',
            }],
            data: {
                vote_list_id: event_id,
                authorized_account: usr_name,
                election_name: update_name
            }
    }];

    try{
        await admin_event(action);
    }catch(error){
        console.error('Transaction Error :', error);
        throw new Error("トランザクションが正常に承認されませんでした");
    }
}

//名前限定
async function update_event_name(event_id, usr_name, update_name) {

    const action = [{
        account: 'voteofevents',
            name: 'updeventname',
            authorization: [{
            actor: usr_name,
            permission: 'active',
            }],
            data: {
                vote_list_id: event_id,
                authorized_account: usr_name,
                election_name: update_name
            }
    }];
    try{
        await admin_event(action);
    }catch(error){
        console.error('Transaction Error :', error);
        throw new Error("トランザクションが正常に承認されませんでした");
    }
}

//時間限定
async function update_event_time(event_id, usr_name, vote_start, vote_fin) {

    const action = [{
        account: 'voteofevents',
            name: 'updeventtime',
            authorization: [{
            actor: usr_name,
            permission: 'active',
            }],
            data: {
                vote_list_id: event_id,
                authorized_account: usr_name,
                vote_start: vote_start,
                vote_fin: vote_fin
            }
    }];
    console.log(action);
    try{
        await admin_event(action);
    }catch(error){
        console.error('Transaction Error :', error);
        throw new Error("トランザクションが正常に承認されませんでした");
    }
}

//???????
async function add_candidate(event_id, usr_name, candidate_name) {
    console.log(event_id+"||"+usr_name+"||"+candidate_name);
    const action = [{
        account: 'voteofevents',
            name: 'addvotingli',
            authorization: [{
            actor: usr_name,
            permission: 'active',
            }],
            data: {
                vote_list_id: event_id,
                candidate: candidate_name,
                author: usr_name
            }
    }];
    try{
        await admin_event(action);
    }catch(error){
        console.error('Create Error :', error);
        throw new Error("トランザクションが正常に承認されませんでした");
    }
}

//候補者の削除
async function rem_candidate(event_id, usr_name, candidate_name) {

    const action = [{
        account: 'voteofevents',
            name: 'remvotingli',
            authorization: [{
            actor: usr_name,
            permission: 'active',
            }],
            data: {
                vote_list_id: event_id,
                candidate: candidate_name,
                author: usr_name
            }
    }];
    console.log(action);

    try{
        await admin_event(action);
    }catch(error){
        console.error('Create Error :', error);
        throw new Error("トランザクションが正常に承認されませんでした");
    }
}


//?W?v
async function fin_event(event_id, privatekey_lamda, privatekey_mu){
    console.log("fin_vote");

    //Get enckey_trx_id
    const event_info = await get_eventByID(event_id);
    const enckey_trx_id = event_info[0].enckey_trx_id;
    const author = event_info[0].author;
    console.log(author);

    //Get Publickkey from Arlocal transaction ID
    const seachTransaction = await arweave.transactions.get(enckey_trx_id);
    const data = JSON.parse(Buffer.from(seachTransaction.data).toString());

    //Create_enckey_obj
    const restore_publicKey = new paillierBigint.PublicKey(
        BigInt(data.publickey_n),
        BigInt(data.publicKey_g)
    );

    //Create_deckey_obj
    const include_privateKey = new paillierBigint.PrivateKey(
        BigInt(privatekey_lamda),
        BigInt(privatekey_mu),
        restore_publicKey
    );

    //check_keypair
    try{
        const check_privatekey = await check_keypair(restore_publicKey, include_privateKey);
        if(check_privatekey !== true){
            throw new Error("秘密鍵が異なります");
        }
    }catch(error){
        throw error;
    }

    //Create dekey_json
    const key_data = {
        election_name: event_info[0].election_name.toString(),
        privatekey_lamda: privatekey_lamda.toString(),
        privateKey_mu: privatekey_mu.toString(),
    };

    const arlocal_trx_id = await create_arlocal(key_data);

    console.log(arlocal_trx_id);
    const action =[{
        account: 'voteofevents',
            name: 'finevent',
            authorization: [{
                actor: author,
                permission: 'active',
            }],
            data: {
                vote_list_id: event_id,
                deckey_trx_id: arlocal_trx_id,
            }
    }];
    console.log(action);
    try{
        await admin_event(action);
        console.log('fin_event_complete\n');
        return;
    }catch(error){
        console.error('fin Error :', error);
        throw new Error("トランザクションが正常に承認されませんでした");
    }
}

//???????C?x???g??????ACTION?????‘o?????????p?????
async function admin_event(action){
    try{
        //?????????
        const usr_privatekey = await gen_private_key();
        console.log(ecc.isValidPrivate(usr_privatekey.trim()));
        const multi_privateKeys = [privateKey[0], usr_privatekey.trim()];

        const multi_signatureProvider = new JsSignatureProvider(multi_privateKeys);
        const multi_api = new Api({ rpc, signatureProvider: multi_signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

        try{
            const result = await multi_api.transact({
                actions: action
            },{
                blocksBehind: 3,
                expireSeconds: 30,
            });

            console.log("admin ok..."+JSON.stringify(result));

            
       }catch(error){
            console.error(`transaction field...\n${error.message}`);
            throw error;
       }
    }catch(error){
        console.error(`NFC Error: ${error.message}`);
        throw error;
    }
}












////////////EOS///////////////

//Generate privatekey for EOS
async function gen_private_key(){
    return new Promise((resolve, reject) => {

        exe_process = execFile('exe/nfc_read.exe', (error, stdout, stderr)=>{
            if(error){
                console.error(`error: ${error.message}`);
                return reject("?f?o?C?X?????????????");
            }
            if(stderr){
                console.error(`stderr: ${stderr}`);
                return reject("?????G???[");
            }
            else{
                console.log(`stdout: ${stdout}`);
                resolve(stdout);
            }
        });
        console.log(exe_process.pid)
    })
}


async function gen_public_key(privateKey){
    return ecc.privateToPublic(privateKey);
}


//Gen voter address
async function gen_eth_add(path){
    return new Promise((resolve, reject) => {
        console.log("kokomadeok");
        exe_process = execFile('exe/gen_eth_add.exe',[path], (error, stdout, stderr)=>{
            if(error){
                console.error(`error: ${error.message}`);
                return reject(new Error("gen_eth_add error..."));
            }
            if(stderr){
                console.error(`stderr: ${stderr}`);
                return reject(new Error("?????G???["));
            }
            else{
                console.log(`stdout: ${stdout}`);
                resolve(stdout);
            }
        });


    });

}

//nfc process stop
async function stopProcess(){
    if(exe_process){
        console.log(exe_process.pid);

        exec(`taskkill /PID ${exe_process.pid} /T /F`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error stopping process: ${error}`);
                return;
            }
            console.log('??????~');
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
        });

        setTimeout(() => {
            if (exe_process) {
                console.log('??????????');
            } else {
                console.log('?v???Z?X????????I?????????');
            }
        }, 1000);
        exe_process = null;
        
    }else{
        console.log('???????????????');
    }
}


////////////////////////////
//create arlocal transaction
async function create_arlocal (JSON_data){
    const wallet = await arweave.wallets.generate();
    const address = await arweave.wallets.getAddress(wallet);
    await arweave.api.get(`mint/${address}/10000000000000000`);
    const data = Buffer.from(JSON.stringify(JSON_data)).toString();
    const now = new Date();
    const epochTime = now.getTime()/1000;

    const trx = await arweave.createTransaction({
        data: data,
    },
        wallet
    );
    trx.addTag('Content-Type', 'vote/json');
    trx.addTag('Time', epochTime);

    await arweave.transactions.sign(trx,wallet);
    await arweave.transactions.post(trx).then(console.log).catch(console.log);

    return trx.id;
}

async function check_keypair(publicKey, privateKey){
    const bytes = Math.ceil(64 / 8);
    const buffer = crypto.randomBytes(bytes);
    const test =  BigInt('0x' + buffer.toString('hex'));
    const encrypt = publicKey.encrypt(test);
    const decrypt = privateKey.decrypt(encrypt);

    return decrypt === test;

}


module.exports = {
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
  };

