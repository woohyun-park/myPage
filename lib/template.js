module.exports = {
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
    <script type="text/javascript" src="/style?id=./index.js&type=js"></script>
    <title>@iamdooddi</title>
    `,
  waveTheme: `
  <style>
  input[type=submit]{
    color: #d9d9d9;
  }
  body{
    background-color: #3b5998;
    color: #d9d9d9;
  }
  .left a, .font a{
    color: #d9d9d9;
  }
  </style>
  `,
  update: function(list, theme, id, title, description){
    if(title == 'undefined'){
      title = 'title';
    }
    if(description == 'undefined'){
      description = 'description';
    }
    let result = this.header;

    if(theme == 'wave'){
      result += this.waveTheme;
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
            <p><input type="text" name="title" placeholder="title" value="${title}" style="width:100%;display:block;margin-left:auto;margin-right:auto;" autocomplete='off'></p>
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
        </html>`;
  }, create: function(list, theme, id){
    let result = this.header;

    if(theme == 'wave'){
      result += this.waveTheme;
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
          <form action="/create_process" method="post" enctype="multipart/form-data" id="menu-create">
            <p><input type="hidden" name="folder" value="${id}"></p>
            <p><input type="text" name="title" placeholder="title" style="width:100%;display:block;margin-left:auto;margin-right:auto;" autocomplete='off'></p>
            <p>
              <textarea name="description" placeholder="description" style="width:100%;height:500px;display:block;margin-left:auto;margin-right:auto;"></textarea>
            </p>
            <p><input type="file" name="file" accept="image/*"></p>
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
        </html>`;
  }, home: function(list, theme){
    let result = this.header;

    if(theme == 'wave'){
      result += this.waveTheme;
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
  }, menu: function(menulist, textlist, theme, id){
    let result =  this.header;
    if(theme == 'wave'){
        result += this.waveTheme;
      }
      if(id == 'insight'){
        return result + `
        </head>
        <body>
          <div class="container">
            <div class="top">
            </div>
            <div class="left">
            ${menulist}
            <a href="/create?theme=${theme}&id=${id}" id="menu-create" class="menu">create</a>
            <form action="/update?theme=${theme}&id=${id}" method="post" id="menu-update">
              <input type="submit" style="display:block;" value="update">
              <input type="text" name="title" style="width:50%;display:block;" autocomplete='off'>
            </form>
            <form action="/delete_process?theme=${theme}&id=${id}" method="post" id="menu-delete">
              <input type="submit" style="display:block;" value="delete">
              <input type="text" name="title" style="width:50%;display:block;" autocomplete='off'>
            </form>
            </div>
            <div class="middle">
              <div class="two">
              ${textlist}
              </div>
            </div>
            <div class="right">
              <a href="/?theme=${theme}"><img id="logo-right" src="/style?id=./img/${theme}/logo-right.png" alt="logo-right"></a>
            </div>
            </div>
            <div class="bottom"></div>
            </body>
            </html>`;
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
          <input type="text" name="title" style="width:50%;display:block;" autocomplete='off'>
        </form>
        <form action="/delete_process?theme=${theme}&id=${id}" method="post">
          <input type="submit" style="display:block;" value="delete">
          <input type="text" name="title" style="width:50%;display:block;" autocomplete='off'>
        </form>
        </div>
        <div class="middle">
          <div class="three">
          ${textlist}
          </div>
        </div>
        <div class="right">
          <a href="/?theme=${theme}"><img id="logo-right" src="/style?id=./img/${theme}/logo-right.png" alt="logo-right"></a>
        </div>
        </div>
        <div class="bottom"></div>
        </body>
        </html>`;
  }
}
