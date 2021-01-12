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

function getList(list, theme){
  let resultList = `<a href='/?theme=${theme}' id="menu-0" class="menu">home</a>`;
  let i = 0;
  while(i < list.length){
    resultList = resultList + `<a href="/?id=${list[i].title}&theme=${theme}" id="menu-${i+1}" class="menu">${list[i].title} </a>`;
    i = i + 1;
  }
  return resultList;
}

function getListAndText(title, list, isImgExist){
  let resultList = '';
  let i = 0;
  if(isImgExist == false){
    while(i < list.length){
      let sanitizeTitle = sanitizeHtml(list[i].title);
      if(title == 'guest'){
        resultList = resultList + `
        <div class="imgBlock">
          <h4>${sanitizeTitle}</h4>
          <div class="font">`;
        let text = list[i].description;
        let author = list[i].author;
        resultList = resultList + `${text}
          </div>
          <div style="text-align: right;">-${author}</div>
          <br>
        </div>`;
        i = i + 1;
      }
      else{
        resultList = resultList + `
        <div class="imgBlock">
          <h2>${sanitizeTitle}</h2>
          <div class="font">`;
        let text = list[i].description;
        let sanitizeText = sanitizeHtml(text);
        resultList = resultList + `${sanitizeText}
          </div>
          <br>
        </div>`;
        i = i + 1;
      }
    }
  }
  else{
    while(i < list.length){
      resultList = resultList + `
      <div class="imgBlock">
        <img src="/style?id=${list[i].dir}" alt="${list[i].title}">
        <h2>${list[i].title}</h2>
        <div class="font">`;
      let text = list[i].description;
      resultList = resultList + `${text}
        </div>
        <br>
      </div>`;
      i = i + 1;
    }
  }
  return resultList;
}

let app = http.createServer(function(request, response){
  let _url = request.url;
  let queryData = url.parse(_url, true).query;
  let title = queryData.id;
  let html = '';
  let pathname = url.parse(_url, true).pathname;
  let theme = queryData.theme;
  if(theme == undefined){
    theme = 'normal';
  }
  if(pathname === '/'){
    //home일때
    if(queryData.id === undefined){
      db.query('select * from list', function (error, filelist, fields){
        let list = getList(filelist, theme);
        html = template.home(list, theme);
        response.writeHead(200);
        response.end(html);
      });
    }
    //home이 아닐때
    else{
      db.query('select * from list', function (error, tempMenulist, fields){
        db.query(`select * from ${title}`, function (error, tempTextlist, fields){
          let menulist = getList(tempMenulist, theme);
          let textlist = null;
          if(fs.existsSync(`./tab/${title}/img`)){
            textlist = getListAndText(title, tempTextlist, true);
          }
          else{
            textlist = getListAndText(title, tempTextlist, false);
          }
          html = template.menu(menulist, textlist, theme, title);
          response.writeHead(200);
          response.end(html);
        });
      });
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
    db.query('select * from list', function (error, tempMenulist, fields){
      let menulist = getList(tempMenulist, theme);
      html = template.create(menulist, theme, title);
      response.writeHead(200);
      response.end(html);
    });
  }
  else if(pathname === '/create_process'){
    // let body = '';
    // request.on('data', function(data){
    //   body = body + data;
    // });
    // request.on('end', function(){
    //   let post = qs.parse(body);
      // if(post.folder == 'guest'){
      //   db.query(`insert into ${post.folder}(title, description, created, author) values(?, ?, now(), ?)`,
      //     [post.title, post.description, post.author], function (error, result){
      //       if(error){
      //         throw error;
      //       }
      //     response.writeHead(302, {'Location': `/?id=${post.folder}&theme=${theme}`});
      //     response.end();
      //   });
      // }
    //   else{
    //     db.query(`insert into ${post.folder}(title, description, created) values(?, ?, now())`,
    //       [post.title, post.description], function (error, result){
    //         if(error){
    //           throw error;
    //         }
    //       response.writeHead(302, {'Location': `/?id=${post.folder}&theme=${theme}`});
    //       response.end();
    //     });
    //   }
    // });
    let form = new formidable.IncomingForm();
    form.parse(request, function(err, fields, files){
      let folder = fields.folder;
      let title = fields.title;
      let description = fields.description;
      if(folder == 'guest'){
        let author = fields.author;
        db.query(`insert into ${folder}(title, description, created, author) values('${title}', '${description}', now(), '${author}')`, function (error, result){
            if(error){
              throw error;
            }
          response.writeHead(302, {'Location': `/?id=${folder}&theme=${theme}`});
          response.end();
        });
      }
      else if(folder == 'design' || folder == 'music'){
        db.query(`insert into ${folder}(title, description, created) values('${title}', '${description}', now())`, function (error, result){
          db.query(`select id FROM ${folder} order by id desc limit 1`, function(error2, result2, fields2){
            let id = result2[0].id;
            let oldpath = files.file.path;
            let imgType = files.file.type.split('/')[1];
            let newpath = `./tab/${folder}/img/${id}.${imgType}`;
            db.query(`update ${folder} set dir='${newpath}' where id='${id}'`, function(error3){
              fs.rename(oldpath, newpath, function(err){
                db.query('')
                response.writeHead(302, {'Location': `/?id=${folder}&theme=${theme}`});
                response.end();
              });
            })
          });
        });
      }
      else{
        db.query(`insert into ${folder}(title, description, created) values('${title}', '${description}', now())`, function (error, result){
            if(error){
              throw error;
            }
          response.writeHead(302, {'Location': `/?id=${folder}&theme=${theme}`});
          response.end();
        });
      }
    })
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
      if(folder == 'design' || folder == 'music'){
        db.query(`SELECT * FROM ${folder} WHERE title = '${title}'`, function(error, result){
          fs.unlink(result[0].dir, function(error){
            db.query(`DELETE FROM ${folder} WHERE title = '${title}'`, function(){
              response.writeHead(302, {'Location': `/?id=${folder}&theme=${theme}`});
              response.end();
            });
          });
        });
      }
      else{
        db.query(`SELECT * FROM ${folder} WHERE title = '${title}'`, function(error, result){
          db.query(`DELETE FROM ${folder} WHERE title = '${title}'`, function(){
            response.writeHead(302, {'Location': `/?id=${folder}&theme=${theme}`});
            response.end();
          });
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
