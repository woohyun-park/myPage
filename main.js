let http = require('http');
let fs = require('fs');
let url = require('url');
let qs = require('querystring');
let formidable = require('formidable');

function updateTemplate(list, theme, id, title, description){
  console.log('description is:' + description);
  if(title == 'undefined'){
    title = 'title';
  }
  if(description == 'undefined'){
    description = 'description';
  }
  let result = `
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
    <title>@iamdooddi</title>`;

  if(theme == 'wave'){
    result += `
    <style>
    body{
      background-color: #3b5998;
      color: #d9d9d9;
    }
    .left a{
      color: #d9d9d9;
    }
    </style>
    `;
  }

  return result + `
  </head>
  <body>
    <div class="container">
      <div class="top"></div>
      <div class="left">
      ${list}
      </div>
      <div class="middle">
        <h2>${id}</h2>
        <form action="/update_process" method="post" enctype="multipart/form-data">
          <input type="hidden" name="fileName" value="${title}">
          <p><input type="hidden" name="folder" value="${id}"></p>
          <p><input type="text" name="title" placeholder="title" value="${title}" style="width:100%;display:block;margin-left:auto;margin-right:auto;"></p>
          <p>
            <textarea name="description" placeholder="description" style="width:100%;height:500px;display:block;margin-left:auto;margin-right:auto;">${description}</textarea>
          </p>
          <p>
            <input type="submit" value="submit">
          </p>
        </form>
      </div>
      <div class="right">
        <a href="/?theme=${theme}"><img id="logo-right" src="/style?id=./img/${theme}/logo-right.png" alt="logo-right"></a>
      </div>
    </div>
    <div class="bottom"></div>
  </body>
  </html>
  `;
}

function createTemplate(list, theme, id){
  let result = `
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
    <title>@iamdooddi</title>`;

  if(theme == 'wave'){
    result += `
    <style>
    body{
      background-color: #3b5998;
      color: #d9d9d9;
    }
    .left a{
      color: #d9d9d9;
    }
    </style>
    `;
  }

  return result + `
  </head>
  <body>
    <div class="container">
      <div class="top"></div>
      <div class="left">
      ${list}
      </div>
      <div class="middle">
        <h2>${id}</h2>
        <form action="/create_process" method="post" enctype="multipart/form-data">
          <p><input type="hidden" name="folder" value="${id}"></p>
          <p><input type="text" name="title" placeholder="title" style="width:100%;display:block;margin-left:auto;margin-right:auto;"></p>
          <p>
            <textarea name="description" placeholder="description" style="width:100%;height:500px;display:block;margin-left:auto;margin-right:auto;"></textarea>
          </p>
          <p><input type="file" name="file" accept="image/*"></p>
          <p>
            <input type="submit">
          </p>
        </form>
      </div>
      <div class="right">
        <a href="/?theme=${theme}"><img id="logo-right" src="/style?id=./img/${theme}/logo-right.png" alt="logo-right"></a>
      </div>
    </div>
    <div class="bottom"></div>
  </body>
  </html>
  `;
}

function homeTemplate(list, theme){
  let result = `
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
    <title>@iamdooddi</title>`;

  if(theme == 'wave'){
    result += `
    <style>
    body{
      background-color: #3b5998;
      color: #d9d9d9;
    }
    .left a{
      color: #d9d9d9;
    }
    </style>
    `;
  }

  return result + `
  </head>
  <body>
    <div class="container">
      <div class="top"></div>
      <div class="left">
      ${list}
      </div>
      <div class="middle">
        <a href="/?theme=${theme}" id="title-link"><img id="title" class="main-img" src="/style?id=./img/${theme}/title.png" alt="title"></a>
        <img id="contact" class="main-img" src="/style?id=./img/${theme}/contact.png" alt="contact">
        <button onclick="theme()"><img id='theme' src="/style?id=./img/${theme}/themeButton.png" alt="wave" value="${theme}" cite="wave by Phoenix Dungeon from the Noun Project"></button>
      </div>
      <div class="right">
        <h1>
          <a href="https://www.instagram.com/iamdooddi/" target="_blank"><img class="icon" id="icon-instagram" src="/style?id=./img/${theme}/icon-instagram.png" alt="instagram"></a>
          <a href="https://blog.naver.com/a-eve" target="_blank"><img class="icon" id="icon-blog" src="/style?id=./img/${theme}/icon-blog.png" alt="blog"></a>
          <a href="https://velog.io/@woohyun_park" target="_blank"><img class="icon" id="icon-velog" src="/style?id=./img/${theme}/icon-velog.png" alt="velog"></a>
        </h1>
      </div>
    </div>
    <div class="bottom"></div>
  </body>
  </html>
  `;
}

function menuTemplate(menulist, textlist, theme, id){
  let result =  `
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
    `
  if(theme == 'wave'){
      result += `
      <style>
      body{
        background-color: #3b5998;
        color: #d9d9d9;
      }
      .left a{
        color: #d9d9d9;
      }
      </style>
      `;
    }
  return result + `
  </head>
  <body>
    <div class="container">
      <div class="top">
      </div>
      <div class="left">
      ${menulist}
      <a href="/create?theme=${theme}&id=${id}" id="menu-create" class="menu">create</a>
      <form action="/update?theme=${theme}&id=${id}" method="post">
        <input type="submit" style="display:block;" value="update">
        <input type="text" name="title" style="width:50%;display:block;">
      </form>
      <form action="/delete_process?theme=${theme}&id=${id}" method="post">
        <input type="submit" style="display:block;" value="delete">
        <input type="text" name="title" style="width:50%;display:block;">
      </form>
      </div>
      <div class="middle">
        <div class="three">
        ${textlist}
        </div>
      </div>
      <div class="right">
        <a href="?theme=${theme}"><img id="logo-right" src="/style?id=./img/${theme}/logo-right.png" alt="logo-right"></a>
      </div>
    </div>
  </body>
  </html>
  `;
}

function getList(list, theme, id){
  let resultList = `<a href='/?theme=${theme}' id="menu-0" class="menu">home</a>`;
  let i = 0;
  while(i < list.length){
    resultList = resultList + `<a href="/?id=${list[i]}&theme=${theme}" id="menu-${i+1}" class="menu">${list[i]} </a>`;
    i = i + 1;
  }
  return resultList;
}

function getListAndText(title, list, imgList){
  let resultList = '';
  let i = 0;
  if(imgList == null){
    while(i < list.length){
      resultList = resultList + `
      <div class="imgBlock">
        <h2>${list[i]}</h2>
        <div class="font">
      `
      let text = fs.readFileSync(`./tab/${title}/data/${list[i]}`, 'utf8');
      resultList = resultList + `${text}
        </div>
        <br>
      </div>
      `;
      i = i + 1;
    }
  }
  else{
    while(i < list.length){
      resultList = resultList + `
      <div class="imgBlock">
        <img src="/style?id=./tab/${title}/img/${imgList[i]}" alt="${imgList[i]}">
        <h2>${list[i]}</h2>
        <div class="font">
      `
      let text = fs.readFileSync(`./tab/${title}/data/${list[i]}`, 'utf8');
      resultList = resultList + `${text}
        </div>
        <br>
      </div>
      `;
      i = i + 1;
    }
  }
  return resultList;
}



let app = http.createServer(function(request, response){
  let _url = request.url;
  let queryData = url.parse(_url, true).query;
  let title = queryData.id;
  let template = '';
  let pathname = url.parse(_url, true).pathname;
  let theme = queryData.theme;
  if(theme == undefined){
    theme = 'normal';
  }

  if(pathname === '/'){
    //home일때
    if(queryData.id === undefined){
      fs.readdir('./tab', function(error, filelist){

        let list = getList(filelist, theme);

        template = homeTemplate(list, theme);

        response.writeHead(200);
        response.end(template);
      })
    }
    //home이 아닐때
    else{
      fs.readdir('./tab', function(error, tempMenulist){
        fs.readdir(`./tab/${title}/data`, function(error, tempTextlist){


          let menulist = getList(tempMenulist, theme, title);
          let textlist = null;
          if(fs.existsSync(`./tab/${title}/img`)){
            tempImglist = fs.readdirSync(`./tab/${title}/img`)
            textlist = getListAndText(title, tempTextlist, tempImglist);
          }
          else{
            textlist = getListAndText(title, tempTextlist, null);
          }

          template = menuTemplate(menulist, textlist, theme, title);

          response.writeHead(200);
          response.end(template);
        })
      })
    }
  }
  else if(pathname === '/style'){
    let file = url.parse(_url, true).query.id;
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
  else if(pathname === '/create'){
    fs.readdir('./tab', function(error, tempMenulist){
      let menulist = getList(tempMenulist, theme);

      template = createTemplate(menulist, theme, title);

      response.writeHead(200);
      response.end(template);
    })
  }
  else if(pathname === '/create_process'){
    let form = new formidable.IncomingForm();
    form.parse(request, function(err, fields, files){
      let folder = fields.folder;
      let title = fields.title;
      let description = fields.description;
      let oldpath = files.file.path;
      let imgType = files.file.type.split('/')[1];
      let newpath = `./tab/${folder}/img/${title}.${imgType}`;
      fs.rename(oldpath, newpath, function(err){
        fs.writeFile(`./tab/${folder}/data/${title}`, description, 'utf8', function(err){
          response.writeHead(302, {'Location': `/?id=${folder}&theme=${theme}`});
          response.end();
        });
      });
    });
  }
  else if(pathname === '/update'){
    fs.readdir('./tab', function(error, tempMenulist){
      let body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
        let post = qs.parse(body);
        let textTitle = post.title;
        let menulist = getList(tempMenulist, theme);
        fs.readFile(`./tab/${title}/data/${textTitle}`, 'utf8', function(error, text){
          template = updateTemplate(menulist, theme, title, textTitle, text);
          response.writeHead(200);
          response.end(template);
        });
      });
    })
  }
  else if(pathname === '/update_process'){
    let form = new formidable.IncomingForm();
    form.parse(request, function(err, fields, files){
      let fileName = fields.fileName;
      let folder = fields.folder;
      let title = fields.title;
      let description = fields.description;

      let oldpathText = `./tab/${folder}/data/${fileName}`;
      let newpathText = `./tab/${folder}/data/${title}`;
      let oldpathImg = `./tab/${folder}/img/${fileName}.png`;
      let newpathImg = `./tab/${folder}/img/${title}.png`;

      console.log(oldpathImg);
      console.log(newpathImg);

      fs.rename(oldpathText, newpathText, function(err){
        fs.writeFile(newpathText, description, 'utf8', function(err){
          fs.rename(oldpathImg, newpathImg, function(err){
            response.writeHead(302, {'Location': `/?id=${folder}&theme=${theme}`});
            response.end();
          })
        });
      });
    });
  }
  else if(pathname === '/delete_process'){
    let body = '';
    request.on('data', function(data){
      body = body + data;
    })
    request.on('end', function(){
      let post = qs.parse(body);
      let title = post.title;
      let folder = queryData.id;
      fs.unlink(`./tab/${folder}/data/${title}`, function(error){
        fs.unlink(`./tab/${folder}/img/${title}.png`, function(error){
          response.writeHead(302, {'Location': `/?id=${folder}&theme=${theme}`});
          response.end();
        });
      })
    })
  }
  else{
    response.writeHead(404);
    response.end('Not Found');
  }
})
app.listen(3000);
