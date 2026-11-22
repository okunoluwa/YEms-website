
/* ==========================================
   YOUNG EXECUTIVE MINDS
   MAIN JAVASCRIPT
========================================== */


/* ==========================================
   1. MOBILE NAVIGATION
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const menuBtn = document.getElementById("menuBtn");
    const navbar = document.getElementById("navbar");

    if (menuBtn && navbar) {

        function openMenu() {
            navbar.classList.add("active", "open");
            menuBtn.classList.add("active");
            menuBtn.setAttribute("aria-expanded", "true");
        }

        function closeMenu() {
            navbar.classList.remove("active", "open");
            menuBtn.classList.remove("active");
            menuBtn.setAttribute("aria-expanded", "false");
        }

        menuBtn.addEventListener("click", function () {

            const isOpen =
                navbar.classList.contains("active") ||
                navbar.classList.contains("open");

            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }

        });


        // Close menu after selecting a navigation link
        const navLinks = navbar.querySelectorAll("a");

        navLinks.forEach(function (link) {

            link.addEventListener("click", function () {
                closeMenu();
            });

        });


        // Close menu when clicking outside it
        document.addEventListener("click", function (event) {

            const clickedInsideMenu = navbar.contains(event.target);
            const clickedMenuButton = menuBtn.contains(event.target);

            if (!clickedInsideMenu && !clickedMenuButton) {
                closeMenu();
            }

        });


        // Close menu with Escape key
        document.addEventListener("keydown", function (event) {

            if (event.key === "Escape") {
                closeMenu();
            }

        });


        // Close mobile menu when returning to desktop size
        window.addEventListener("resize", function () {

            if (window.innerWidth > 900) {
                closeMenu();
            }

        });

    }


    /* ==========================================
       2. AUTOMATIC COPYRIGHT YEAR
    ========================================== */

    const yearElements = document.querySelectorAll("#year");

    yearElements.forEach(function (element) {
        element.textContent = new Date().getFullYear();
    });


});
