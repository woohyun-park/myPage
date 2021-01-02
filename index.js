function theme(){
  if ($("#theme").getAttribute("value") == 'wave') {
    var menus = document.querySelectorAll('.menu');
    var i = 0;
    while(i < menus.length){
      menus[i].style.color = 'black';
      i=i+1;
    }
    $('body').style.background='#d9d9d9';
    $("#title").setAttribute("src", "/style?id=./img/normal/title.png");
    $("#contact").setAttribute("src", "/style?id=./img/normal/contact.png");
    $("#icon-instagram").setAttribute("src", "/style?id=./img/normal/icon-instagram.png");
    $("#icon-blog").setAttribute("src", "/style?id=./img/normal/icon-blog.png");
    $("#icon-velog").setAttribute("src", "/style?id=./img/normal/icon-velog.png");
    $("#theme").setAttribute("src", "/style?id=./img/normal/themeButton.png");
    $("#theme").setAttribute("value", "normal");
    // let fs = require('fs');
// <a href='?id=${list[i]}' id="menu-${i+1}" class="menu">${list[i]} </a>
    // fs.readdir('./tab', function(error, list){
    //   console.log(list);
    //   let i = 0;
    //   while(i < list.length){
    //     $(`#menu-${i+1}`).setAttribute("href", `?id=${list[i]}&theme=normal`);
    //   }
    // })

    $("#menu-0").setAttribute("href", "/");
    $("#menu-1").setAttribute("href", "?id=diary");
    $("#menu-2").setAttribute("href", "?id=note");
    $("#menu-3").setAttribute("href", "?id=music");
    $("#menu-4").setAttribute("href", "?id=design");
    $("#title-link").setAttribute("href", "/");
  }
  else{
    var menus = document.querySelectorAll('.menu');
    var i = 0;
    while(i < menus.length){
      menus[i].style.color = '#d9d9d9';
      i=i+1;
    }
    $('body').style.background='#3b5998';
    $("#title").setAttribute("src", "/style?id=./img/wave/title.png");
    $("#contact").setAttribute("src", "/style?id=./img/wave/contact.png");
    $("#icon-instagram").setAttribute("src", "/style?id=./img/wave/icon-instagram.png");
    $("#icon-blog").setAttribute("src", "/style?id=./img/wave/icon-blog.png");
    $("#icon-velog").setAttribute("src", "/style?id=./img/wave/icon-velog.png");
    $("#theme").setAttribute("src", "/style?id=./img/wave/themeButton.png");
    $("#theme").setAttribute("value", "wave");

    // let fs = require('fs');
    // fs.readdir('./tab', function(error, list){
    //   let i = 0;
    //   while(i < list.length){
    //     $(`#menu-${i+1}`).setAttribute("href", `?id=${list[i]}&theme=wave`);
    //   }
    // })

    $("#menu-0").setAttribute("href", "/?theme=wave");
    $("#menu-1").setAttribute("href", "?id=diary&theme=wave");
    $("#menu-2").setAttribute("href", "?id=note&theme=wave");
    $("#menu-3").setAttribute("href", "?id=music&theme=wave");
    $("#menu-4").setAttribute("href", "?id=design&theme=wave");
    $("#title-link").setAttribute("href", "/?theme=wave");
  }
}

// function $
// 사용방법 - 제이쿼리와 동일하게 작성할 수 있습니다.
// $( 'div.yaho' ) 하나의 엘리먼트를 잡고 싶은 경우
// $( 'ul > li' ) 여러개의 엘리먼트를 잡고 싶은 경우
var $ = function ( elem ) {
 var dom = document.querySelectorAll( elem ) , rtnVal = null ;
 if ( dom.length == 0 ) rtnVal = undefined ;
 if ( dom.length == 1 ) rtnVal = dom[0] ;
 if ( dom.length > 1 ) rtnVal = dom ;
 return rtnVal ;
} ;
