let http = require('http');
let fs = require('fs');
let url = require('url');
let qs = require('querystring');
let formidable = require('formidable');
let template = require('./lib/template.js');
let path = require('path');
let sanitizeHtml = require('sanitize-html');
let mysql = require('mysql');
let db = mysql.createConnection({
  host    : 'localhost',
  user    : 'root',
  password: 'zxcvZXCV',
  database: 'myPage'
});
db.connect();

function getMenus(menus, theme){
  let result = `<a href='/?theme=${theme}' id="menu-0" class="menu">home</a>`;
  let i = 0;
  while(i < menus.length){
    result = result + `<a href="/?id=${menus[i].title}&theme=${theme}" id="menu-${i+1}" class="menu">${menus[i].title} </a>`;
    i = i + 1;
  }
  return result;
}

function getPosts(folder, posts, isImgExist){
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
}

let app = http.createServer(function(request, response){
  let _url = request.url;
  let queryData = url.parse(_url, true).query;
  let folder = queryData.id;
  let html = '';
  let pathname = url.parse(_url, true).pathname;
  let theme = queryData.theme;
  if(theme == undefined){
    theme = 'normal';
  }
  if(pathname === '/'){
    //home일때
    if(folder === undefined){
      db.query('select * from list', function (err, tempMenus){
        if(err){throw err;}
        let menus = getMenus(tempMenus, theme);
        html = template.home(menus, theme);
        response.writeHead(200);
        response.end(html);
      });
    }
    //home이 아닐때
    else{
      db.query('select * from list', function (err, tempMenus){
        if(err){throw err;}
        db.query(`select * from ${folder}`, function (err2, tempPosts){
          if(err2){throw err2;}
          let menus = getMenus(tempMenus, theme);
          let posts = null;
          if(fs.existsSync(`./tab/${folder}`)){
            posts = getPosts(folder, tempPosts, true);
          }
          else{
            posts = getPosts(folder, tempPosts, false);
          }
          html = template.menu(menus, posts, theme, folder);
          response.writeHead(200);
          response.end(html);
        });
      });
    }
  }
  else if(pathname === '/style'){
    let file = url.parse(_url, true).query.id;
    fs.readFile(file, function(err, file){
      if(err){throw err;}
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
    db.query('select * from list', function (err, tempMenus){
      if(err){throw err;}
      let menus = getMenus(tempMenus, theme);
      html = template.create(menus, theme, folder);
      response.writeHead(200);
      response.end(html);
    });
  }
  else if(pathname === '/create_process'){
    let form = new formidable.IncomingForm();
    form.parse(request, function(err, fields, files){
      if(err){throw err;}
      let folder = fields.folder;
      let title = fields.title;
      let description = fields.description;
      //guest일 경우
      if(folder == 'guest'){
        let author = fields.author;
        db.query(`insert into ${folder}(title, description, created, author) values('${title}', '${description}', now(), '${author}')`, function (err2){
          if(err2){throw err2;}
          response.writeHead(302, {'Location': `/?id=${folder}&theme=${theme}`});
          response.end();
        });
      }
      //design 또는 music일 경우
      else if(folder == 'design' || folder == 'music'){
        db.query(`insert into ${folder}(title, description, created) values('${title}', '${description}', now())`, function (err2){
          if(err2){throw err2;}
          db.query(`select id FROM ${folder} order by id desc limit 1`, function(err3, result){
            if(err3){throw err3;}
            let id = result[0].id;
            let oldpath = files.file.path;
            let imgType = files.file.type.split('/')[1];
            let newpath = `./tab/${folder}/${id}.${imgType}`;
            db.query(`update ${folder} set dir='${newpath}' where id='${id}'`, function(err4){
              if(err4){throw err4;}
              fs.rename(oldpath, newpath, function(err5){
                if(err5){throw err5;}
                response.writeHead(302, {'Location': `/?id=${folder}&theme=${theme}`});
                response.end();
              });
            })
          });
        });
      }
      //그 외의 경우
      else{
        db.query(`insert into ${folder}(title, description, created) values('${title}', '${description}', now())`, function (err2){
          if(err2){throw err2;}
          response.writeHead(302, {'Location': `/?id=${folder}&theme=${theme}`});
          response.end();
        });
      }
    })
  }
  else if(pathname === '/update'){
    fs.readdir('./tab', function(err, tempMenulist){
      if(err){throw err;}
      let body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
        let post = qs.parse(body);
        let textTitle = post.title;
        let menulist = getMenus(tempMenulist, theme);
        fs.readFile(`./tab/${title}/data/${textTitle}`, 'utf8', function(err2, text){
          if(err2){throw err2;}
          html = template.update(menulist, theme, title, textTitle, text);
          response.writeHead(200);
          response.end(html);
        });
      });
    })
  }
  else if(pathname === '/update_process'){
    let form = new formidable.IncomingForm();
    form.parse(request, function(err, fields, files){
      if(err){throw err;}
      let fileName = fields.fileName;
      let folder = fields.folder;
      let title = fields.title;
      let description = fields.description;
      let filteredFolder = path.parse(folder).base;
      let filteredTitle = path.parse(title).base;
      let oldpathText = `./tab/${filteredFolder}/data/${fileName}`;
      let newpathText = `./tab/${filteredFolder}/data/${filteredTitle}`;
      let oldpathImg = `./tab/${filteredFolder}/img/${fileName}.png`;
      let newpathImg = `./tab/${filteredFolder}/img/${filteredTitle}.png`;
      fs.rename(oldpathText, newpathText, function(err){
        if(err2){throw err2;}
        fs.writeFile(newpathText, description, 'utf8', function(err){
          if(err3){throw err3;}
          fs.rename(oldpathImg, newpathImg, function(err){
            if(err4){throw err4;}
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
    });
    request.on('end', function(){
      let post = qs.parse(body);
      let title = post.title;
      let folder = queryData.id;
      //제목을 입력하지 않았을 경우
      if(title == ''){
        response.writeHead(302, {'Location': `/?id=${folder}&theme=${theme}`});
        response.end();
      }
      //이미지가 있는 경우
      if(folder == 'design' || folder == 'music'){
        db.query(`SELECT * FROM ${folder} WHERE title = '${title}'`, function(err, result){
          if(err){throw err;}
          fs.unlink(result[0].dir, function(err2){
            if(err2){throw err2;}
            db.query(`DELETE FROM ${folder} WHERE title = '${title}'`, function(){
              response.writeHead(302, {'Location': `/?id=${folder}&theme=${theme}`});
              response.end();
            });
          });
        });
      }
      //이미지가 없는 경우
      else{
        db.query(`DELETE FROM ${folder} WHERE title = '${title}'`, function(err){
          if(err){throw err;}
          response.writeHead(302, {'Location': `/?id=${folder}&theme=${theme}`});
          response.end();
        });
      }
    });
  }
  else{
    response.writeHead(404);
    response.end('Not Found');
  }
})
app.listen(1218);
