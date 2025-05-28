import { navLogic } from "./includes/nav.js";

// nav 導覽列
fetch("./includes/nav.html")
  .then((resp) => resp.text())
  .then((navContent) => {
    $(".navbar").append(navContent);
    navLogic();
  });

// section 主內容
$(".back").on("click", () => {
  location.href = "https://www.google.com";
});
$(".next").on("click", () => {
  location.href = "bookStep2.html";
});
$(".substract").on("click", (e) => {
  const control = $(e.target).parent();
  const input = control.next().find("input");
  let count = input.val();
  if (count > 0) {
    count--;
    input.val(count);
  }
});
$(".add").on("click", (e) => {
  const control = $(e.target).parent();
  const input = control.prev().find("input");
  let count = input.val();
  count++;
  input.val(count);
  console.log(input.val());
});
// fetch() 票種表
// let ticketTypeLst;
// fetch("http://localhost:8080/maven-tickeasy-v1/buy/ticket-types?eventId=1")
//   .then((resp) => resp.json())
//   .then((ticketTypes) => {
//     ticketTypeLst = ticketTypes;
//   });
// fetch() 票種欄
// fetch("./includes/typeComponent.html")
//   .then((resp) => resp.text())
//   .then((htmlContent) => {
//     for (let i = 0; i < 5; i++) {
//       $(".type-container").append(htmlContent);
//     }
//   });
