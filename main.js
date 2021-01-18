let http = require('http');
let url = require('url');
let template = require('./lib/template.js');
let topic = require('./lib/topic')

let app = http.createServer(function(request, response){
  let _url = request.url;
  let queryData = url.parse(_url, true).query;
  let folder = queryData.id;
  let theme = queryData.theme;
  if(theme == undefined){
    theme = 'normal';
  }
  let pathname = url.parse(_url, true).pathname;
  if(pathname === '/'){
    if(folder === undefined){
      topic.home(request, response);
    } else{
      topic.page(request, response);
    }
  } else if(pathname === '/style'){
    topic.style(request, response);
  } else if(pathname === '/create'){
    topic.create(request, response);
  } else if(pathname === '/create_process'){
    topic.create_process(request, response);
  } else if(pathname === '/update'){
    topic.update(request, response);
  } else if(pathname === '/update_process'){
    topic.update_process(request, response);
  } else if(pathname === '/delete_process'){
    topic.delete_process(request, response);
  } else{
    response.writeHead(404);
    response.end('Not Found');
  }
})
app.listen(3000);
