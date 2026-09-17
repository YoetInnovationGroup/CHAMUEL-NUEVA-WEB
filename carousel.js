(() => {
  const $=window.jQuery;
  if(!$ || !$.fn.slick) return;
  const section=$('.chamuel-testimonials');
  $('#reviews-carousel').slick({slidesToShow:3,slidesToScroll:1,speed:500,autoplay:true,autoplaySpeed:5000,infinite:true,arrows:true,dots:true,pauseOnHover:true,pauseOnFocus:true,rows:0,prevArrow:section.find('.slick-prev'),nextArrow:section.find('.slick-next'),appendDots:section.find('.dl-carousel-dots'),customPaging:(_,i)=>'<button type="button" aria-label="Ver opinión '+(i+1)+'"></button>',responsive:[{breakpoint:1025,settings:{slidesToShow:2}},{breakpoint:768,settings:{slidesToShow:1}}]});
})();
