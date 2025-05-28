(function () {
  $(function () {
    // 載入所有組件位置
    const urls = {
      nav: "./components/nav/",
      footer: "./components/footer/",
    };

    // nav 導覽列(載入 html + js + css)
    fetch(urls.nav + "nav.html")
      .then((resp) => resp.text())
      .then((navHTML) => {
        $(".navbar").append(navHTML);
        // 動態生成 <link>, <script>
        const newScript = document.createElement("script");
        newScript.src = urls.nav + "nav.js";
        $(".main-script").after(newScript);
        const newLink = document.createElement("link");
        newLink.rel = "stylesheet";
        newLink.href = urls.nav + "nav.css";
        $(".main-css").after(newLink);
      });

    // section 主內容
    $(".back").on("click", () => {
      location.href = "bookStep.html";
    });
    $(".next").on("click", () => {
      location.href = "bookStep2.html";
    });

    // footer 頁底列(載入 html + js + css)
    fetch(urls.footer + "footer.html")
      .then((resp) => resp.text())
      .then((footerHTML) => {
        $("footer").append(footerHTML);
        // 動態生成元素 <link>, <script>
        const newScript = document.createElement("script");
        newScript.src = urls.footer + "footer.js";
        $(".main-script").after(newScript);
        const newLink = document.createElement("link");
        newLink.rel = "stylesheet";
        newLink.href = urls.footer + "footer.css";
        $(".main-css").after(newLink);
      });
  });
})();
