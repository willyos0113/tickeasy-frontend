// nav 導覽列
$(".navbar-burger").on("click", (e) => {
    $(e.currentTarget).toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");
  });
  $(".navbar-item button").hover((e) => {
    $(e.target).toggleClass("is-focused");
  });
