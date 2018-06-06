import $ from 'jquery'
import fetch from 'node-fetch';
var crypto = require('crypto');
var bip39 = require('bip39');
var sha256 = require('sha256');
let Dispatcher = require('flux').Dispatcher
let Emitter = require('events').EventEmitter

let dispatcher = new Dispatcher()
let emitter = new Emitter()

let config = require('../config')

let apiUrl = config.apiUrl;

var Store = () => {

  dispatcher.register(function(payload) {
    switch (payload.type) {
    case 'login':
      this.login(payload);
      break;
    case 'search':
      this.search(payload);
      break;
    case 'update':
      this.update(payload);
      break;
    }
  }.bind(this))

  this.login = function(payload) {
    var url = 'login'
    var version = 'api/v2/'
    var postJson = {
      email: payload.content.emailAddress,
      sha: payload.content.sha
    }

    this.callApi(url,
      version,
      'POST',
      postJson,
      payload)
  }

  this.search = function(payload) {
    var url = 'search'
    var version = 'api/v1/'
    var postJson = {
      email: payload.content.email
    }

    /*var res = {
      success: true,
      decodedMessage: {
        searchResults: [
          { emailAddress: postJson.emailAddress, allocation: 1000, ethereumAddress: '0x0', wanchainAddress: '0x0' }
        ]
      }
    }
    emitter.emit(payload.type, null, res)*/

    this.callApi(url,
      version,
      'POST',
      postJson,
      payload)
  }

  this.update = function(payload) {
    var url = 'update'
    var version = 'api/v1/'
    var postJson = {
      uuid: payload.content.uuid,
      email: payload.content.email,
      ethAddress: payload.content.ethAddress,
      wanAddress: payload.content.wanAddress,
      allocation: payload.content.allocation
    }

    payload.type = 'update_'+payload.content.uuid

    this.callApi(url,
      version,
      'POST',
      postJson,
      payload)
  }

  this.callApi = function(url, version, method, postData, payload) {
    var call = apiUrl+version+url

    if(method == 'GET') {
      postData = null
    } else {
      const signJson = JSON.stringify(postData);
      const signMnemonic = bip39.generateMnemonic();
      const cipher = crypto.createCipher('aes-256-cbc', signMnemonic);
      const signEncrypted = cipher.update(signJson, 'utf8', 'base64') + cipher.final('base64');
      var signData = {
        e: signEncrypted.hexEncode(),
        m: signMnemonic.hexEncode(),
        u: sha256(url).toUpperCase(),
        p: sha256(sha256(url).toUpperCase()).toUpperCase(),
        t: new Date().getTime(),
      }
      const signSeed = JSON.stringify(signData)
      const signSignature = sha256(signSeed)
      signData.s = signSignature
      postData = JSON.stringify(signData)
    }

    fetch(call, {
      method: method,
      body: postData,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': config.apiHeader,
        'x-access-token': payload.token,
        'x-key': payload.tokenKey }
    })
    .then(res => {
      if(res.status == 401) {
        emitter.emit('Unauthorised', null, null)
        return res;
      } else if(res.status == 404) {
        emitter.emit('Unauthorised', null, null)
        return res;
      }

      if (res.ok) {
        return res;
      } else {
        throw Error(res.statusText);
      }
    })
    .then(res => res.json())
    .then((res) => {
      if(res.success) {
        res.decodedMessage = this.decodeResponse(res.message)
      }
      emitter.emit(payload.type, null, res)
    })
    .catch((error) => {
      emitter.emit(payload.type, error, null)
    });
  }

  this.decodeResponse = function(message) {
    const mnemonic = message.m.hexDecode()
    const encrypted = message.e.hexDecode()
    const time = message.t
    const signature = message.s

    const sig = {
      e: message.e,
      m: message.m,
      u: message.u,
      p: message.p,
      t: message.t
    }
    const seed = JSON.stringify(sig)
    const compareSignature = sha256(seed)

    if (compareSignature !== signature) {
      return null
    }

    const payload = decrypt(encrypted, mnemonic)
    var data = null
    try {
      data = JSON.parse(payload)
    } catch (ex) {
      return null
    }

    return data;
  }
}


function decrypt(text,seed){
  var decipher = crypto.createDecipher('aes-256-cbc', seed)
  var dec = decipher.update(text,'base64','utf8')
  dec += decipher.final('utf8');
  return dec;
}
String.prototype.hexEncode = function(){
    var hex, i;
    var result = "";
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }
    return result
}
String.prototype.hexDecode = function(){
    var j;
    var hexes = this.match(/.{1,4}/g) || [];
    var back = "";
    for(j = 0; j<hexes.length; j++) {
        back += String.fromCharCode(parseInt(hexes[j], 16));
    }

    return back;
}

var store = new Store()

export default ({
  store: store,
  dispatcher: dispatcher,
  emitter: emitter
})
