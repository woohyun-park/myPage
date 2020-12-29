function theme(){
  if ($("#wave").getAttribute("value") == 'wave') {
    var menus = document.querySelectorAll('.menu');
    var i = 0;
    while(i < menus.length){
      menus[i].style.color = 'black';
      i=i+1;
    }
    $('body').style.background='#d9d9d9';
    $("#title").setAttribute("src", "./img/normal/title.png");
    $("#contact").setAttribute("src", "./img/normal/contact.png");
    $("#icon-instagram").setAttribute("src", "./img/normal/icon-instagram.png");
    $("#icon-blog").setAttribute("src", "./img/normal/icon-blog.png");
    $("#icon-velog").setAttribute("src", "./img/normal/icon-velog.png");
    $("#wave").setAttribute("src", "./img/normal/themeButton.png");
    $("#wave").setAttribute("value", "normal");

    $("#menu-1").setAttribute("href", "index.html");
    $("#menu-2").setAttribute("href", "diary/diary.html");
    $("#menu-3").setAttribute("href", "note/note.html");
    $("#menu-4").setAttribute("href", "music/music.html");
    $("#menu-5").setAttribute("href", "design/design.html");
    $("#title-link").setAttribute("href", "index.html");
  }
  else{
    var menus = document.querySelectorAll('.menu');
    var i = 0;
    while(i < menus.length){
      menus[i].style.color = '#d9d9d9';
      i=i+1;
    }
    $('body').style.background='#3b5998';
    $("#title").setAttribute("src", "./img/wave/title-wave.png");
    $("#contact").setAttribute("src", "./img/wave/contact-wave.png");
    $("#icon-instagram").setAttribute("src", "./img/wave/icon-instagram-wave.png");
    $("#icon-blog").setAttribute("src", "./img/wave/icon-blog-wave.png");
    $("#icon-velog").setAttribute("src", "./img/wave/icon-velog-wave.png");
    $("#wave").setAttribute("src", "./img/wave/themeButton-wave.png");
    $("#wave").setAttribute("value", "wave");

    $("#menu-1").setAttribute("href", "index-wave.html");
    $("#menu-2").setAttribute("href", "diary/diary-wave.html");
    $("#menu-3").setAttribute("href", "note/note-wave.html");
    $("#menu-4").setAttribute("href", "music/music-wave.html");
    $("#menu-5").setAttribute("href", "design/design-wave.html");
    $("#title-link").setAttribute("href", "index-wave.html");
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
