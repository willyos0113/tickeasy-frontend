// ====== section 主內容 ======
// ------ 上/下一步按鈕區塊 ------
$(".back").on("click", () => {
  location.href = "https://www.google.com";
});
$(".next").on("click", () => {
  // post 東西出去...
  const formValues = $(".count")
    .map((index, el) => {
      const coreParent = $(el).closest(".level");
      const typeName = coreParent.find(".type-name").text();
      const typePrice = coreParent.find(".type-price").text();
      return {
        "type-count": $(el).val(),
        "type-name": typeName,
        "type-price": typePrice,
      };
    })
    .get();
  console.log(formValues);
  // location.href = "bookStep2.html";
});
