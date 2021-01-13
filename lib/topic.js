let db = require('./db.js');
let template = require('./template.js');
let fs = require('fs');
let url = require('url');
let formidable = require('formidable');
let qs = require('querystring');
let path = require('path');

exports.home = function(request, response){
  let _url = request.url;
  let queryData = url.parse(_url, true).query;
  let theme = queryData.theme;
  if(theme == undefined){
    theme = 'normal';
  }
  db.query('select * from list', function (err, tempMenus){
    if(err){throw err;}
    let menus = template.getMenus(tempMenus, theme);
    html = template.home(menus, theme);
    response.writeHead(200);
    response.end(html);
  });
}

exports.page = function(request, response){
  let _url = request.url;
  let queryData = url.parse(_url, true).query;
  let folder = queryData.id;
  let theme = queryData.theme;
  if(theme == undefined){
    theme = 'normal';
  }
  db.query('select * from list', function (err, tempMenus){
    if(err){throw err;}
    db.query(`select * from ${folder}`, function (err2, tempPosts){
      if(err2){throw err2;}
      let menus = template.getMenus(tempMenus, theme);
      let posts = null;
      if(fs.existsSync(`./tab/${folder}`)){
        posts = template.getPosts(folder, tempPosts, true);
      } else{
        posts = template.getPosts(folder, tempPosts, false);
      }
      html = template.menu(menus, posts, theme, folder);
      response.writeHead(200);
      response.end(html);
    });
  });
}

exports.style = function(request, response){
  let _url = request.url;
  let file = url.parse(_url, true).query.id;
  fs.readFile(file, function(err, file){
    if(err){throw err;}
    if(url.parse(_url, true).query.type == 'css'){
      response.writeHead(200, {'Content-Type': 'text/css'});
    } else if(url.parse(_url, true).query.type == 'js'){
      response.writeHead(200, {'Content-Type': 'text/javascript'});
    } else{
      response.writeHead(200, {'Content-Type': 'image/png'});
    }
    response.end(file);
  })
}

exports.create = function(request, response){
  let _url = request.url;
  let queryData = url.parse(_url, true).query;
  let folder = queryData.id;
  let theme = queryData.theme;
  if(theme == undefined){
    theme = 'normal';
  }
  db.query('select * from list', function (err, tempMenus){
    if(err){throw err;}
    let menus = template.getMenus(tempMenus, theme);
    html = template.create(menus, theme, folder);
    response.writeHead(200);
    response.end(html);
  });
}

exports.create_process = function(request, response){
  let _url = request.url;
  let queryData = url.parse(_url, true).query;
  let form = new formidable.IncomingForm();
  let theme = queryData.theme;
  if(theme == undefined){
    theme = 'normal';
  }
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
    //이미지가 있는 경우
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
    //이미지가 없는 경우
    else{
      db.query(`insert into ${folder}(title, description, created) values('${title}', '${description}', now())`, function (err2){
        if(err2){throw err2;}
        response.writeHead(302, {'Location': `/?id=${folder}&theme=${theme}`});
        response.end();
      });
    }
  })
}

exports.update = function(request, response){
  let _url = request.url;
  let queryData = url.parse(_url, true).query;
  let folder = queryData.id;
  let theme = queryData.theme;
  if(theme == undefined){
    theme = 'normal';
  }
  let body = '';
  request.on('data', function(data){
      body = body + data;
  });
  request.on('end', function(){
    db.query('select * from list', function (err, tempMenus){
      if(err){throw err;}
      let post = qs.parse(body);
      let title = post.title;
      let menus = template.getMenus(tempMenus, theme);
      //제목을 입력하지 않았을 경우
      if(title == ''){
        response.writeHead(302, {'Location': `/?id=${folder}&theme=${theme}`});
        response.end();
      }
      //guest인 경우
      if(folder == 'guest'){
        db.query(`select * from ${folder} where title = '${title}'`, function(err2, tempPost){
          if(err2){throw err2;}
          html = template.update(menus, theme, folder, tempPost);
          response.writeHead(200);
          response.end(html);
        })
      }
      //이미지가 있는 경우
      else if(folder == 'design' || folder == 'music'){
        db.query(`select * from ${folder} where title = '${title}'`, function(err2, tempPost){
          if(err2){throw err2;}
          html = template.update(menus, theme, folder, tempPost);
          response.writeHead(200);
          response.end(html);
        })
      }
      //이미지가 없는 경우
      else{
        db.query(`select * from ${folder} where title = '${title}'`, function(err2, tempPost){
          if(err2){throw err2;}
          //잘못된 타이틀을 입력한 경우
          if(tempPost[0] == undefined){
            response.writeHead(302, {'Location': `/?id=${folder}&theme=${theme}`});
            response.end();
          }
          let description = tempPost[0].description;
          html = template.update(menus, theme, folder, tempPost);
          response.writeHead(200);
          response.end(html);
        })
      }
    });
  });
}

exports.update_process = function(request, response){
  let form = new formidable.IncomingForm();
  let _url = request.url;
  let queryData = url.parse(_url, true).query;
  let theme = queryData.theme;
  if(theme == undefined){
    theme = 'normal';
  }
  form.parse(request, function(err, fields, files){
    if(err){throw err;}
    let oldTitle = fields.fileName;
    let folder = fields.folder;
    let newTitle = fields.title;
    let description = fields.description;
    let fFolder = path.parse(folder).base;
    let fTitle = path.parse(newTitle).base;
    //guest일 경우
    if(folder == 'guest'){
      let author = fields.author;
      db.query(`update ${fFolder} set title='${fTitle}', description='${description}', author='${author}' where title='${oldTitle}'`, function(err){
        response.writeHead(302, {'Location': `/?id=${fFolder}&theme=${theme}`});
        response.end();
      })
    }
    //이미지가 있는 경우
    else if(folder == 'design' || folder == 'music'){
      db.query(`update ${fFolder} set title='${fTitle}', description='${description}' where title='${oldTitle}'`, function(err){
        if(err){throw err;}
        //이미지를 업로드하지 않은 경우
        if(files.file.name == ''){
          response.writeHead(302, {'Location': `/?id=${fFolder}&theme=${theme}`});
          response.end();
        }
        //이미지를 업로드 한 경우
        else{
          db.query(`select * from ${fFolder} where title='${fTitle}'`, function(err2, result){
            if(err2){throw err;}
            let oldpath = files.file.path;
            let imgType = files.file.type.split('/')[1];
            let newpath = result[0].dir;
            fs.rename(oldpath, newpath, function(err3){
              if(err3){throw err3;}
              response.writeHead(302, {'Location': `/?id=${fFolder}&theme=${theme}`});
              response.end();
            })
          })
        }
      })
    }
    //이미지가 없는 경우
    else{
      db.query(`update ${fFolder} set title='${fTitle}', description='${description}' where title='${oldTitle}'`, function(err){
        response.writeHead(302, {'Location': `/?id=${fFolder}&theme=${theme}`});
        response.end();
      })
    }
  });
}

exports.delete_process = function(request, response){
  let _url = request.url;
  let queryData = url.parse(_url, true).query;
  let theme = queryData.theme;
  if(theme == undefined){
    theme = 'normal';
  }
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
