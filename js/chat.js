// Your web app's Firebase configuration

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const ref = firebase.database().ref(); //.ref()=ユニークキーを自動で降ってください

const date = new Date();
let character_id = null;
let character_img = null;

//テキストを送信
function send() {
  let text_send = null;
  //テキストエリアに文字が入力されている場合、trueを返す
  if ($('#text').val()) {
    text_send = true;
  } else {
    //入力されていない場合、送信していいか確認する
    const result = confirm('未入力のまま送信しますか？');
    if (result) {
      text_send = true;
    } else {
      return;
    }
  }

  if (text_send == true) {
    getCharaImage();
    //firebaseに送信

    //mycharaとbotで2つ作ればOK?
    const chara = character_img;
    const uname = $('#uname').val();
    const time =
      date.getFullYear() +
      '年' +
      (date.getMonth() + 1) +
      '月' +
      date.getDate() +
      '日' +
      date.getHours() +
      '時' +
      date.getMinutes() +
      '分';
    const text = $('#text').val();
    const msg = {
      chara: chara,
      uname: uname,
      time: time,
      text: text,
      type: 'mine',
    };
    ref.push(msg); //set = 決まった名前、push=ユニーク setは上書きになる

    //botのデータ作成

    pageDown();
    deleteInput();

    //botのデータ作成

    let bot_reply = talkApi(text);

    const bot_msg = {
      chara: chara,
      uname: 'bot',
      time: time,
      text: bot_reply,
      type: 'bot',
    };
    // ref.push(bot_msg);
  }
}

//文字を送信
$('#send').on('click', function () {
  if ($('#uname').val()) {
    send();
  } else {
    alert('名前を入れてください！');
  }
});

//DBのデータを受信、表示
ref.on('child_added', function (data) {
  const v = data.val(); //送信されたオブジェクトを取得
  const k = data.key; //ユニークキーの取得
  const h =
    '<div class="baloon_l"><div class="faceicon"><img src=' +
    v.chara +
    ' alt="" ><p class="name">' +
    v.uname +
    '</p></div><div class = "talk"><p class="says"><br>' +
    v.text +
    '<br>' +
    v.time +
    '</p></div></div>';

  //パラメータを作って、ifで自分とbotで分岐するようにする if(v.side == mine) など

  $('#output').append(h);
});

//イベント情報取得・エンターで送信
$('#text').on('keydown', function (e) {
  // console.log(e);
  if (e.keyCode == 13) {
    if ($('#uname').val()) {
      send();
    } else {
      alert('名前を入れてください！');
    }
  }
});

//最下部に移動
function pageDown() {
  const lastElement = document.querySelector('#output').lastElementChild; //最後の要素を取得
  lastElement.scrollIntoView({ behavior: 'smooth' }); //最後の要素が見えるまでスクロール
}

//入力したテキストを削除
function deleteInput() {
  $('#text').val('');
  $('#uname').val('');
  document.getElementById('text').blur();
  document.getElementById('uname').blur();
}

//キャラクター選択
let $buke_img = document.getElementById('buke-img');
let $caram_img = document.getElementById('caram-img');
let $tuku_img = document.getElementById('tuku-img');

reset_styles = function () {
  $buke_img.style.opacity = 1;
  $caram_img.style.opacity = 1;
  $tuku_img.style.opacity = 1;
};

change_style = function (button) {
  button.style.opacity = 0.5;
  character_id = button.id;
};

$buke_img.addEventListener('click', function () {
  reset_styles();
  change_style(this);
});

$caram_img.addEventListener('click', function () {
  reset_styles();
  change_style(this);
});

$tuku_img.addEventListener('click', function () {
  reset_styles();
  change_style(this);
});

//デフォルトのキャラクターを決定
reset_styles();
change_style($buke_img);

//キャラクターIDと画像を紐付け
function getCharaImage() {
  if (character_id === 'buke-img') {
    character_img = 'imgs/buke.png';
  } else if (character_id === 'caram-img') {
    character_img = 'imgs/caram.png';
  } else if (character_id === 'tuku-img') {
    character_img = 'imgs/tuku.jpg';
  }
}

function talkApi(talk_input) {
  input_reply = null;

  const base_url = 'https://api.a3rt.recruit-tech.co.jp/talk/v1/smalltalk';
  const apikey = '';

  let talk = talk_input;
  let re = null;

  let params = new URLSearchParams();
  params.append('apikey', apikey);
  params.append('query', talk);

  async function asyncFunc() {
    await axios.post(base_url, params).then((response) => {
      const get_reply = response.data.results[0].reply;
      console.log(get_reply);
    });
  }

  const get_reply = asyncFunc().then();
  return input_reply;
}
