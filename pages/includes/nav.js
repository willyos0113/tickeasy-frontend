// nav 導覽列(邏輯部分)
export const navLogic = () => {
  $(".navbar-burger").on("click", (e) => {
    $(e.currentTarget).toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");
  });
  $(".navbar-item button").hover((e) => {
    $(e.target).toggleClass("is-focused");
  });
};
