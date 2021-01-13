function theme(){
  let theme = $(".middle__theme").getAttribute("value");
  if(theme == 'wave'){
    let newTheme = 'normal'
    createTheme(newTheme, '#d9d9d9', 'black');
  } else{
    let newTheme = 'wave'
    createTheme(newTheme, '#3b5998', '#d9d9d9');
  }
}

function createTheme(newTheme, bgColor, textColor){
  $('body').style.background= bgColor;
  $(".middle__img--logo").setAttribute("src", `/style?id=./img/${newTheme}/middle__img--logo.png`);
  $(".middle__img--contact").setAttribute("src", `/style?id=./img/${newTheme}/middle__img--contact.png`);
  $(".right__icon--instagram").setAttribute("src", `/style?id=./img/${newTheme}/right__icon--instagram.png`);
  $(".right__icon--blog").setAttribute("src", `/style?id=./img/${newTheme}/right__icon--blog.png`);
  $(".right__icon--velog").setAttribute("src", `/style?id=./img/${newTheme}/right__icon--velog.png`);
  $(".middle__theme").setAttribute("src", `/style?id=./img/${newTheme}/middle__theme.png`);
  $(".middle__theme").setAttribute("value", "newTheme");

  let left__menus = $(".left__menu");
  left__menus[0].setAttribute("href", `/?theme=${newTheme}`);
  left__menus[0].style.color = textColor;
  let i = 1;
  while(i < left__menus.length){
    left__menus[i].setAttribute("href", `/?id=${left__menus[i].innerText}&theme=${newTheme}`);
    left__menus[i].style.color = textColor;
    i=i+1;
  }
  let middle__a = $(".middle__a")
  i = 0;
  while(i < middle__a.length){
    middle__a[i].setAttribute("href", `/?theme=${newTheme}`);
    i = i + 1;
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
