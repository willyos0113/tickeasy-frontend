// nav 導覽列
$(".navbar-burger").on("click", (e) => {
  $(e.currentTarget).toggleClass("is-active");
  $(".navbar-menu").toggleClass("is-active");
});
$(".navbar-item button").hover((e) => {
  $(e.target).toggleClass("is-focused");
});

// section 主內容
$(".back").on("click", () => {
  location.href = "bookStep.html";
});
$(".next").on("click", () => {
  location.href = "bookStep2.html";
});
