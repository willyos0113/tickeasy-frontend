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
  location.href = "https://www.google.com";
});
$(".next").on("click", () => {
  location.href = "bookStep2.html";
});

$(".subtract").on("click", (e) => {
  $(e.target);
  let count = $(".count").val();
  if (count > 0) {
    count--;
    $(".count").val(count);
  }
});
$(".add").on("click", () => {
  let count = $(".count").val();
  count++;
  $(".count").val(count);
});
