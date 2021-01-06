let http = require('http');
let fs = require('fs');
let url = require('url');
let qs = require('querystring');
let formidable = require('formidable');
let template = require('./lib/template.js');
let path = require('path');

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
      let filteredTitle = path.parse(title).base;
      let filteredList = path.parse(list[i]).base;
      let text = fs.readFileSync(`./tab/${filteredTitle}/data/${filteredList}`, 'utf8');
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
      let filteredTitle = path.parse(title).base;
      let filteredList = path.parse(list[i]).base;
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
  let html = '';
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

        html = template.home(list, theme);

        response.writeHead(200);
        response.end(html);
      })
    }
    //home이 아닐때
    else{
      fs.readdir('./tab', function(error, tempMenulist){
        let filteredTitle = path.parse(title).base;
        fs.readdir(`./tab/${filteredTitle}/data`, function(error, tempTextlist){


          let menulist = getList(tempMenulist, theme, title);
          let textlist = null;
          if(fs.existsSync(`./tab/${filteredTitle}/img`)){
            tempImglist = fs.readdirSync(`./tab/${filteredTitle}/img`)
            textlist = getListAndText(title, tempTextlist, tempImglist);
          }
          else{
            textlist = getListAndText(title, tempTextlist, null);
          }

          html = template.menu(menulist, textlist, theme, title);

          response.writeHead(200);
          response.end(html);
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

      html = template.create(menulist, theme, title);

      response.writeHead(200);
      response.end(html);
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
        let filteredFolder = path.parse(folder).base;
        let filteredTitle = path.parse(title).base;
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
        let filteredTitle = path.parse(title).base;
        let filteredTextTitle = path.parse(textTitle).base;
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

      let oldpathText = `./tab/${folder}/data/${fileName}`;
      let newpathText = `./tab/${folder}/data/${title}`;
      let oldpathImg = `./tab/${folder}/img/${fileName}.png`;
      let newpathImg = `./tab/${folder}/img/${title}.png`;

      fs.rename(oldpathText, newpathText, function(err){
        fs.writeFile(newpathText, description, 'utf8', function(err){
          fs.rename(oldpathImg, newpathImg, function(err){
            let filteredFolder = path.parse(folder).base;
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
      let filteredFolder = path.parse(folder).base;
      let filteredTitle = path.parse(title).base;
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
