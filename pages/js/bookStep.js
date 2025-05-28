// ====== section 主內容 ======
// API "票種表" 資料
let ticketTypeLst;
const ticketTypeQuery = async () => {
  const resp = await fetch("./data/typeSample.json"); // 暫時的假資料!!!
  const data = await resp.json();
  ticketTypeLst = data;
  console.log(ticketTypeLst);
  ticketTypeLst.forEach((eachType) => {
    // 動態生成 HTML
    typeBoxHTMLLoader(eachType);
  });
};
ticketTypeQuery();
// ------ 票種區塊 ------
const typeBoxHTMLLoader = async (eachType) => {
  const resp = await fetch("./components/typeBox/typeBox.html");
  let typeBoxHTML = await resp.text();
  typeBoxHTML = typeBoxHTML
    .replace("{{typeName}}", eachType.name)
    .replace("{{price}}", eachType.price.toLocaleString());
  $(".type-container").append(typeBoxHTML);
};
const typeBoxJSLoader = () => {
  $(document).on("click", ".substract", (e) => {
    const control = $(e.target).parent();
    const input = control.next().find("input");
    let count = input.val();
    if (count > 0) {
      count--;
      input.val(count);
    }
  });
  $(document).on("click", ".add", (e) => {
    const control = $(e.target).parent();
    const input = control.prev().find("input");
    let count = input.val();
    count++;
    input.val(count);
    console.log(input.val());
  });
};
// 事件委派方式，監聽後來出現的 HTML
typeBoxJSLoader();
// ------ 上/下一步按鈕區塊 ------
$(".back").on("click", () => {
  location.href = "https://www.google.com";
});
$(".next").on("click", () => {
  location.href = "bookStep2.html";
});
