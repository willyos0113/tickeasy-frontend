(function () {
  $(function () {
    // 票種欄
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
  });
})();
