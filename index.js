function night(){
  $('body').style.background='black';
  $("#title").setAttribute("src", "title-night.png");
  $("#contact").setAttribute("src", "contact-night.png");
}

function day(){
  $('body').style.background='#d9d9d9';
  $("#title").setAttribute("src", "title.png");
  $("#contact").setAttribute("src", "contact.png");
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
