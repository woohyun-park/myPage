function night(){
  if ($("#wave").getAttribute("value") == 'night') {
    var menus = document.querySelectorAll('#menu');
    var i = 0;
    while(i < menus.length){
      menus[i].style.color = 'black';
      i=i+1;
    }
    $('body').style.background='#d9d9d9';
    $("#title").setAttribute("src", "title.png");
    $("#contact").setAttribute("src", "contact.png");
    $("#icon-instagram").setAttribute("src", "icon-instagram.png");
    $("#icon-blog").setAttribute("src", "icon-blog.png");
    $("#icon-velog").setAttribute("src", "icon-velog.png");
    $("#wave").setAttribute("src", "wave.png");
    $("#wave").setAttribute("value", "day");
  }
  else{
    var menus = document.querySelectorAll('#menu');
    var i = 0;
    while(i < menus.length){
      menus[i].style.color = '#d9d9d9';
      i=i+1;
    }
    $('body').style.background='#3b5998';
    $("#title").setAttribute("src", "title-night.png");
    $("#contact").setAttribute("src", "contact-night.png");
    $("#icon-instagram").setAttribute("src", "icon-instagram-night.png");
    $("#icon-blog").setAttribute("src", "icon-blog-night.png");
    $("#icon-velog").setAttribute("src", "icon-velog-night.png");
    $("#wave").setAttribute("src", "wave-night.png");
    $("#wave").setAttribute("value", "night");
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
