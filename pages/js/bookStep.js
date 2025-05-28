(function () {
  $(function () {
    // 載入所有組件位置
    const urls = {
      nav: "./components/nav/",
      typeBox: "./components/typeBox/",
      footer: "./components/footer/",
    };

    // nav 導覽列(載入 html + js + css)
    fetch(urls.nav + "nav.html")
      .then((resp) => resp.text())
      .then((navHTML) => {
        $(".navbar").append(navHTML);
        // 動態生成 <link>, <script>
        const newScript = document.createElement("script");
        const newLink = document.createElement("link");
        newScript.src = urls.nav + "nav.js";
        $(".main-script").after(newScript);
        newLink.rel = "stylesheet";
        newLink.href = urls.nav + "nav.css";
        $(".main-css").after(newLink);
      });

    // section 主內容
    $(".back").on("click", () => {
      location.href = "https://www.google.com";
    });
    $(".next").on("click", () => {
      location.href = "bookStep2.html";
    });
    // fetch() 票種表
    // let ticketTypeLst;
    // fetch("http://localhost:8080/maven-tickeasy-v1/buy/ticket-types?eventId=1")
    //   .then((resp) => resp.json())
    //   .then((ticketTypes) => {
    //     ticketTypeLst = ticketTypes;
    //   });
    // 票種欄(載入 html + js + css)
    fetch(urls.typeBox + "typeBox.html")
      .then((resp) => resp.text())
      .then((typeBoxHTML) => {
        $(".type-container").append(typeBoxHTML);
        // 動態生成元素 <script>
        const newScript = document.createElement("script");
        newScript.src = urls.typeBox + "typeBox.js";
        $(".main-script").after(newScript);
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
