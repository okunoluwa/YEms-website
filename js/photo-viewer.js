(function () {
    var links = [].slice.call(document.querySelectorAll("a.zoom"));
    var counter = document.getElementById("photoCount");
    if (counter) counter.textContent = links.length + (links.length === 1 ? " picture" : " pictures");
    if (!links.length) return;

    /* Viewer styles live here so the viewer works even if css/style.css is replaced */
    var style = document.createElement("style");
    style.textContent = 
        ".album-photo-card a.zoom{display:block;cursor:zoom-in}\n" +
        ".album-photo-card a.zoom:focus-visible{outline:3px solid #4f8fd0;outline-offset:-3px}\n" +
        ".album-photo-caption{display:block;padding:12px 14px;font-size:.9rem;line-height:1.4;color:#444}\n" +
        ".pv{position:fixed;top:0;right:0;bottom:0;left:0;z-index:99999;display:none;flex-direction:column;background:#050814;color:#fff;touch-action:none}\n" +
        ".pv.open{display:flex}\n" +
        ".pv-bar{display:flex;flex-wrap:wrap;gap:8px;padding:10px 12px;background:#0b1020}\n" +
        ".pv-bar button{font:inherit;font-weight:600;color:#fff;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.3);border-radius:6px;padding:8px 14px;cursor:pointer}\n" +
        ".pv-bar button:hover{background:rgba(255,255,255,.26)}\n" +
        ".pv-bar .pv-close{margin-left:auto;background:#d8171f;border-color:#d8171f}\n" +
        ".pv-stage{flex:1;overflow:hidden;display:flex;align-items:center;justify-content:center;cursor:grab;min-height:0}\n" +
        ".pv-stage.drag{cursor:grabbing}\n" +
        ".pv-stage img{max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;transform-origin:center;user-select:none;-webkit-user-drag:none;will-change:transform}\n" +
        ".pv-cap{margin:0;padding:10px 16px 14px;text-align:center;font-size:.95rem;background:#0b1020}\n";
    document.head.appendChild(style);

    var v = document.createElement("div");
    v.className = "pv";
    v.setAttribute("role", "dialog");
    v.setAttribute("aria-label", "Photo viewer");
    v.innerHTML =
        '<div class="pv-bar">' +
        '<button type="button" data-a="prev">&larr; Previous</button>' +
        '<button type="button" data-a="next">Next &rarr;</button>' +
        '<button type="button" data-a="out" aria-label="Zoom out">&minus;</button>' +
        '<button type="button" data-a="in" aria-label="Zoom in">+</button>' +
        '<button type="button" data-a="reset">Reset</button>' +
        '<button type="button" data-a="close" class="pv-close">Close</button></div>' +
        '<div class="pv-stage"><img alt=""></div><p class="pv-cap"></p>';
    document.body.appendChild(v);

    var stage = v.querySelector(".pv-stage"), img = stage.querySelector("img"), cap = v.querySelector(".pv-cap");
    var cur = 0, s = 1, x = 0, y = 0, pts = {}, last = null, pinch = 0;

    function clamp() {
        var mx = Math.max(0, (img.offsetWidth * s - stage.clientWidth) / 2);
        var my = Math.max(0, (img.offsetHeight * s - stage.clientHeight) / 2);
        x = Math.min(mx, Math.max(-mx, x));
        y = Math.min(my, Math.max(-my, y));
    }
    function apply() {
        if (s <= 1) { s = 1; x = 0; y = 0; }
        clamp();
        img.style.transform = "translate(" + x + "px," + y + "px) scale(" + s + ")";
    }
    function zoom(f) { s = Math.min(6, Math.max(1, s * f)); apply(); }
    function show(i) {
        cur = (i + links.length) % links.length;
        s = 1; x = 0; y = 0; apply();
        img.src = links[cur].href;
        img.alt = links[cur].dataset.caption || "";
        cap.textContent = (links[cur].dataset.caption || "") + "  (" + (cur + 1) + " of " + links.length + ")";
    }
    function open(i) { show(i); v.classList.add("open"); document.body.style.overflow = "hidden"; }
    function close() { v.classList.remove("open"); document.body.style.overflow = ""; img.removeAttribute("src"); }

    links.forEach(function (a, i) {
        a.addEventListener("click", function (e) { e.preventDefault(); open(i); });
    });
    v.querySelector(".pv-bar").addEventListener("click", function (e) {
        var a = e.target.getAttribute("data-a");
        if (a === "prev") show(cur - 1);
        else if (a === "next") show(cur + 1);
        else if (a === "in") zoom(1.4);
        else if (a === "out") zoom(1 / 1.4);
        else if (a === "reset") { s = 1; apply(); }
        else if (a === "close") close();
    });
    stage.addEventListener("wheel", function (e) { e.preventDefault(); zoom(e.deltaY < 0 ? 1.15 : 1 / 1.15); }, { passive: false });
    stage.addEventListener("dblclick", function () { if (s > 1) { s = 1; } else { s = 2.5; } apply(); });
    stage.addEventListener("pointerdown", function (e) {
        stage.setPointerCapture(e.pointerId);
        pts[e.pointerId] = { x: e.clientX, y: e.clientY };
        last = { x: e.clientX, y: e.clientY };
        stage.classList.add("drag");
        if (Object.keys(pts).length === 2) pinch = 0;
    });
    stage.addEventListener("pointermove", function (e) {
        if (!pts[e.pointerId]) return;
        pts[e.pointerId] = { x: e.clientX, y: e.clientY };
        var ids = Object.keys(pts);
        if (ids.length === 2) {
            var d = Math.hypot(pts[ids[0]].x - pts[ids[1]].x, pts[ids[0]].y - pts[ids[1]].y);
            if (pinch) zoom(d / pinch);
            pinch = d;
        } else if (s > 1 && last) {
            x += e.clientX - last.x; y += e.clientY - last.y; apply();
        }
        last = { x: e.clientX, y: e.clientY };
    });
    function up(e) { delete pts[e.pointerId]; pinch = 0; last = null; if (!Object.keys(pts).length) stage.classList.remove("drag"); }
    stage.addEventListener("pointerup", up);
    stage.addEventListener("pointercancel", up);
    document.addEventListener("keydown", function (e) {
        if (!v.classList.contains("open")) return;
        if (e.key === "Escape") close();
        else if (e.key === "ArrowLeft") show(cur - 1);
        else if (e.key === "ArrowRight") show(cur + 1);
        else if (e.key === "+" || e.key === "=") zoom(1.4);
        else if (e.key === "-") zoom(1 / 1.4);
    });
    window.addEventListener("resize", apply);
})();
