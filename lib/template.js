module.exports = {
  getPosts: function (folder, posts, isImgExist){
    let sanitizeHtml = require('sanitize-html');
    let result = '';
    let i = 0;
    while(i < posts.length){
      let sTitle = sanitizeHtml(posts[i].title);
      let sDescription = sanitizeHtml(posts[i].description);
      //이미지가 없는 폴더의 경우
      if(isImgExist == false){
        //guest일 경우 제목 h4, author 표시
        if(folder == 'guest'){
          let author = posts[i].author;
          result = result + `
          <div class="imgBlock">
            <h4>${sTitle}</h4>
            <div class="font">`;
          result = result + `${sDescription}
            </div>
            <div style="text-align: right;">-${author}</div>
            <br>
          </div>`;
          i = i + 1;
        }
        //그 외의 경우 제목 h2, author 미표시
        else{
          result = result + `
          <div class="imgBlock">
            <h2>${sTitle}</h2>
            <div class="font">`;
          result = result + `${sDescription}
            </div>
            <br>
          </div>`;
          i = i + 1;
        }
      }
      //이미지가 있는 폴더의 경우
      else{
        let dir = posts[i].dir;
        result = result + `
        <div class="imgBlock">
          <img src="/style?id=${dir}" alt="${sTitle}">
          <h2>${sTitle}</h2>
          <div class="font">`;
        let text = posts[i].description;
        result = result + `${sDescription}
          </div>
          <br>
        </div>`;
        i = i + 1;
      }
    }
    return result;
  },
  getMenus: function (menus, theme){
    let result = `<a href='/?theme=${theme}' class="left__menu">home</a>`;
    let i = 0;
    while(i < menus.length){
      result = result + `<a href="/?id=${menus[i].title}&theme=${theme}" class="left__menu">${menus[i].title} </a>`;
      i = i + 1;
    }
    return result;
  },
  header: `
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
    <script type="text/javascript" src="/style?id=./lib/theme.js&type=js"></script>
    <title>@iamdooddi</title>
  </head>
  <body>
    <div class="container">
      <div class="top"></div>
      <div class="left">`,
  waveTheme: `
  <style>
  input[type=submit]{
    color: #d9d9d9;
  } body{
    background-color: #3b5998;
    color: #d9d9d9;
  } .left a, .font a{
    color: #d9d9d9;
  }
  </style>`,
  update: function(list, theme, folder, post){
    let result = this.header;
    let author = '';
    let title = post[0].title;
    let description = post[0].description;
    let file = '';

    if(theme == 'wave'){
      result += this.waveTheme;
    }
    if(folder == 'guest'){
      author = `
      <p><input type="text" name="author" placeholder="author" value="${post[0].author}" style="width:100%;display:block;margin-left:auto;margin-right:auto;" autocomplete='off'></p>`;
    }
    if(folder == 'music' || folder == 'design'){
      file = `<p><input type="file" name="file" accept="image/*"></p>`;
    }

    return result + `
        ${list}
        </div>
        <div class="middle">
          <h2>${folder}</h2>
          <form action="/update_process?theme=${theme}" method="post" enctype="multipart/form-data">
            <input type="hidden" name="fileName" value="${title}">
            <input type="hidden" name="folder" value="${folder}">
            <p><input type="text" name="title" placeholder="title" value="${title}" style="width:100%;display:block;margin-left:auto;margin-right:auto;" autocomplete='off'></p>
            ${author}
            <p>
              <textarea name="description" placeholder="description" style="width:100%;height:500px;display:block;margin-left:auto;margin-right:auto;">${description}</textarea>
            </p>
            ${file}
            <p>
              <input type="submit" value="submit">
            </p>
          </form>
        </div>
        <div class="right">
          <a href="/?theme=${theme}"><img class="right__img" src="/style?id=./img/${theme}/right__img.png" alt="right__img"></a>
        </div>
        </div><div class="bottom"></div>
        </body>
        </html>`;
  }, create: function(menus, theme, folder){
    let result = this.header;
    let author = '';
    let file = '';

    if(theme == 'wave'){
      result += this.waveTheme;
    }
    if(folder == 'guest'){
      author = `
      <p><input type="text" name="author" placeholder="author" style="width:100%;display:block;margin-left:auto;margin-right:auto;" autocomplete='off'></p>`
    }
    if(folder == 'music' || folder == 'design'){
      file = '<p><input type="file" name="file" accept="image/*"></p>';
    }

    return result + `
        ${menus}
        </div>
        <div class="middle">
          <h2>${folder}</h2>
          <form action="/create_process?theme=${theme}" method="post" enctype="multipart/form-data">
            <p><input type="hidden" name="folder" value="${folder}"></p>
            <p><input type="text" name="title" placeholder="title" style="width:100%;display:block;margin-left:auto;margin-right:auto;" autocomplete='off'></p>
            ${author}
            <p>
              <textarea name="description" placeholder="description" style="width:100%;height:500px;display:block;margin-left:auto;margin-right:auto;"></textarea>
            </p>
            ${file}
            <p>
              <input type="submit" value="submit">
            </p>
          </form>
        </div>
        <div class="right">
          <a href="/?theme=${theme}"><img class="right__img" src="/style?id=./img/${theme}/right__img.png" alt="right__img"></a>
        </div>
        </div><div class="bottom"></div>
        </body>
        </html>`;
  }, home: function(menus, theme){
    let result = this.header;

    if(theme == 'wave'){
      result += this.waveTheme;
    }

    return result + `
        ${menus}
        </div>
        <div class="middle">
          <a href="/?theme=${theme}" class="middle__a"><img class="middle__img--logo" src="/style?id=./img/${theme}/middle__img--logo.png" alt="middle__img"></a>
          <a href="/?theme=${theme}" class="middle__a"><img class="middle__img--contact" src="/style?id=./img/${theme}/middle__img--contact.png" alt="middle__contact"></a>
          <button onclick="theme()"><img class="middle__theme" src="/style?id=./img/${theme}/middle__theme.png" alt="middle__theme" value="${theme}" cite="wave by Phoenix Dungeon from the Noun Project"></button>
        </div>
        <div class="right">
          <h1>
            <a href="https://www.instagram.com/iamdooddi/" target="_blank"><img class="right__icon--instagram" src="/style?id=./img/${theme}/right__icon--instagram.png" alt="right__icon--instagram"></a>
            <a href="https://blog.naver.com/a-eve" target="_blank"><img class="right__icon--blog" src="/style?id=./img/${theme}/right__icon--blog.png" alt="right__icon--blog"></a>
            <a href="https://velog.io/@woohyun_park" target="_blank"><img class="right__icon--velog" src="/style?id=./img/${theme}/right__icon--velog.png" alt="right__icon--velog"></a>
          </h1>
        </div>
      </div><div class="bottom"></div>
    </body>
    </html>`;
  }, menu: function(menus, posts, theme, folder){
    let result =  this.header;
    let column = 'three';

    if(theme == 'wave'){
        result += this.waveTheme;
    }
    if(folder == 'insight'){
      column = 'two';
    }

    return result + `
        ${menus}
        <p></p>
        <a href="/create?theme=${theme}&id=${folder}" class="left__menu">create</a>
        <form action="/update?theme=${theme}&id=${folder}" method="post" class="left__menu">
          <input type="submit" style="display:block;" value="update">
          <input type="text" name="title" style="width:50%;display:block;" autocomplete='off'>
        </form>
        <form action="/delete_process?theme=${theme}&id=${folder}" method="post" class="left__menu">
          <input type="submit" style="display:block;" value="delete">
          <input type="text" name="title" style="width:50%;display:block;" autocomplete='off'>
        </div>
        <div class="middle">
          <div class="${column}">
          ${posts}
          </div>
        </div>
        <div class="right">
          <a href="/?theme=${theme}"><img class="right__img" src="/style?id=./img/${theme}/right__img.png" alt="right__img"></a>
        </div>
        </div><div class="bottom"></div>
        </body>
        </html>`;
  }
}
