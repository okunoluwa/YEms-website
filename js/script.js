/* ==========================================
   YEMs SITE SCRIPT (used on every page)
   - Mobile menu open/close
   - Footer year
   - Highlights the current page in the menu
========================================== */
(function () {
    "use strict";

    /* ---------- Mobile menu ---------- */
    var button = document.getElementById("menuBtn");
    var menu = document.querySelector(".nav-links");

    function setMenu(open) {
        if (!button || !menu) return;
        menu.classList.toggle("open", open);
        button.setAttribute("aria-expanded", open ? "true" : "false");
        button.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    }

    if (button && menu) {
        button.setAttribute("aria-expanded", "false");
        button.addEventListener("click", function (e) {
            e.stopPropagation();
            setMenu(!menu.classList.contains("open"));
        });
        // Close after choosing a link
        menu.addEventListener("click", function (e) {
            if (e.target.closest("a")) setMenu(false);
        });
        // Close when tapping outside the menu
        document.addEventListener("click", function (e) {
            if (!menu.contains(e.target) && !button.contains(e.target)) setMenu(false);
        });
        // Close with the Escape key
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") setMenu(false);
        });
        // Reset when the window grows past the mobile breakpoint
        window.addEventListener("resize", function () {
            if (window.innerWidth > 850) setMenu(false);
        });
    }

    /* ---------- Footer year ---------- */
    var year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();

    /* ---------- Highlight the current page ---------- */
    if (menu) {
        var page = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
        // Album pages belong to the Gallery menu item
        if (page.indexOf("album-") === 0) page = "gallery.html";
        var links = menu.querySelectorAll("a");
        var matched = false;
        links.forEach(function (a) {
            var target = (a.getAttribute("href") || "").split("#")[0].split("?")[0].toLowerCase();
            if (target === page) { a.classList.add("active"); matched = true; }
            else { a.classList.remove("active"); }
        });
        // Keep the original highlight if nothing matched (e.g. a custom page name)
        if (!matched) {
            var original = menu.querySelector("a[href='index.html']");
            if (original && (page === "" || page === "index.html")) original.classList.add("active");
        }
    }
})();
