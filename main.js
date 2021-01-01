let http = require('http');
let fs = require('fs');
let url = require('url');

function homeTemplateHTML(list){
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="icon" href="/style?id=./img/favicon.ico">
    <link rel="shortcut icon" href="/style?id=./img/favicon.ico">
    <meta property="og:image" content="/style?id=kakao.png">
    <meta property="og:title" content="@iamdooddi">
    <meta property="og:description" content="wachu lookin">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
    <link rel="stylesheet" href="/style?id=./style.css&type=css">
    <script type="text/javascript" src="/style?id=./index.js&type=js"></script>
    <script src="https://s3.ap-northeast-2.amazonaws.com/materials.spartacodingclub.kr/xmas/snow.js"></script>
    <title>@iamdooddi</title>
  </head>
  <body>
    <div class="container">
      <div class="top"></div>
      <div class="left">
      <a href="/" id="menu-1" class="menu">home</a>
      ${list}
      </div>
      <div class="middle">
        <a href="/" id="title-link"><img id="title" class="main-img" src="/style?id=./img/normal/title.png" alt="title"></a>
        <img id="contact" class="main-img" src="/style?id=./img/normal/contact.png" alt="contact">
        <button onclick="theme()"><img id="wave" src="/style?id=./img/normal/themeButton.png" alt="wave" value="normal" cite="wave by Phoenix Dungeon from the Noun Project"></button>
      </div>
      <div class="right">
        <h1>
          <a href="https://www.instagram.com/iamdooddi/" target="_blank"><img class="icon" id="icon-instagram" src="/style?id=./img/normal/icon-instagram.png" alt="instagram"></a>
          <a href="https://blog.naver.com/a-eve" target="_blank"><img class="icon" id="icon-blog" src="/style?id=./img/normal/icon-blog.png" alt="blog"></a>
          <a href="https://velog.io/@woohyun_park" target="_blank"><img class="icon" id="icon-velog" src="/style?id=./img/normal/icon-velog.png" alt="velog"></a>
        </h1>
      </div>
    </div>
    <div class="bottom"></div>
  </body>
  </html>
  `;
}

function menuTemplate(menulist, textlist){
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="icon" href="./img/favicon.ico">
    <link rel="shortcut icon" href="../img/favicon.ico">
    <title>@iamdooddi</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
    <link rel="stylesheet" href="/style?id=./style.css&type=css">
  </head>
  <body>
    <div class="container">
      <div class="top">
      </div>
      <div class="left">
      <a href="/" id="menu-1" class="menu">Home</a>
      ${menulist}
      </div>
      <div class="middle">
        <div class="three">
        ${textlist}
        </div>
      </div>
      <div class="right">
        <a href="/"><img id="logo-right" src="/style?id=./img/normal/logo-right.png" alt="logo-right"></a>
      </div>
    </div>
  </body>
  </html>
  `
}

function getList(list){
  let resultList = '';
  let i = 0;
  while(i < list.length){
    resultList = resultList + `<a href='?id=${list[i]}' id="menu-${i+2}" class="menu">${list[i]} </a>`;
    i = i + 1;
  }
  return resultList;
}

function getListAndText(title, list){
  let resultList = '';
  let i = 0;
  while(i < list.length){
    resultList = resultList + `
    <div class="imgBlock">
      <h2>${list[i]}</h2>
      <div class="font">
    `
    //<img src="./img/sogumm-위로.jpg" alt="sogumm-위로">
    let text = fs.readFileSync(`./tab/${title}/data/${list[i]}`, 'utf8');
    resultList = resultList + `${text}
      </div>
      <br>
    </div>
    `;
    i = i + 1;
  }
  return resultList;
}



let app = http.createServer(function(request, response){
  let _url = request.url;
  let queryData = url.parse(_url, true).query;
  let title = queryData.id;
  let template = '';
  let pathname = url.parse(_url, true).pathname;

  if(pathname === '/'){
    if(queryData.id === undefined){
      fs.readdir('./tab', function(error, filelist){

        let list = getList(filelist);

        template = homeTemplateHTML(list);

        response.writeHead(200);
        response.end(template);
      })
    }
    else{
      fs.readdir('./tab', function(error, tempMenulist){
        fs.readdir(`./tab/${title}/data`, function(error, tempTextlist){

          let menulist = getList(tempMenulist);
          let textlist = getListAndText(title, tempTextlist);

          template = menuTemplate(menulist, textlist);

          response.writeHead(200);
          response.end(template);
        })
      })
    }
  }
  else if(pathname === '/style'){
    let file = url.parse(_url, true).query.id;
    console.log(url.parse(_url, true).query.id);
    console.log(url.parse(_url, true).query.type);
    fs.readFile(file, function(err, file){
      if(url.parse(_url, true).query.type == 'css'){
        response.writeHead(200, {'Content-Type': 'text/css'});
      }
      else if(url.parse(_url, true).query.type == 'js'){
        response.writeHead(200, {'Content-Type': 'text/javascript'});
      }
      else{
        response.writeHead(200, {'Content-Type': 'image/png'});
      }
      response.end(file);
    })
  }
  else{
    response.writeHead(404);
    response.end('Not Found');
  }
  // 한글이 포함된 파일이 이상하게 인코딩되어 decodeURI을 사용하였다
  // response.writeHead(200);
  // response.end(fs.readFileSync(__dirname + decodeURI(_url)));
})
app.listen(3000);
