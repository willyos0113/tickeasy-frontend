// nav 導覽列
$(".navbar-burger").on("click", (e) => {
  $(e.currentTarget).toggleClass("is-active");
  $(".navbar-menu").toggleClass("is-active");
});
$(".user-enter button").hover((e) => {
  //   alert("yyy");
  console.log($(e.target));
  $(e.target).toggleClass("is-focused");
});
