/* ==========================================
   YEMS GALLERY ALBUMS (static, no backend)
   To add a picture: copy the file into images/gallery/<album>/
   and add one line to that album's photos list below.
========================================== */

const albumInformation = {
    leadership: {
        title: "Leadership and Networking Training",
        description: "Pictures from leadership development, business training and networking activities.",
        photos: [
            { src: "images/gallery/leadership/01.jpg", caption: "Leadership and networking training, 9 September 2023" },
            { src: "images/gallery/leadership/02.jpg", caption: "Leadership and networking training, 9 September 2023" },
            { src: "images/gallery/leadership/03.jpg", caption: "Leadership and networking training, 9 September 2023" },
            { src: "images/gallery/leadership/04.jpg", caption: "Facilitated training session" },
            { src: "images/gallery/leadership/05.jpg", caption: "Training session in progress" },
            { src: "images/gallery/leadership/06.jpg", caption: "Participants during a training session" },
            { src: "images/gallery/leadership/07.jpg", caption: "Group training session" }
        ]
    },

    wash: {
        title: "Community WASH Project",
        description: "Pictures documenting community water, sanitation and health activities.",
        photos: [
            { src: "images/gallery/wash/01.jpg", caption: "Hygiene awareness workshop, Johannesburg CBD high school, 28 August 2023" },
            { src: "images/gallery/wash/02.jpg", caption: "Eastern Cape school toilets before construction" },
            { src: "images/gallery/wash/03.jpg", caption: "After construction: Clear Enviro toilet sanitation treatment plant" }
        ]
    },

    water: {
        title: "Water Treatment Initiative",
        description: "Pictures from water treatment and clean water initiatives.",
        photos: [
            { src: "images/gallery/water/01.jpg", caption: "Water plant powered by alternative energy" },
            { src: "images/gallery/water/02.jpg", caption: "Power plant installed in Philippi, Cape Town" },
            { src: "images/gallery/water/03.jpg", caption: "Mini water purification and testing lab" },
            { src: "images/gallery/water/04.jpg", caption: "Bottled water from the Philippi plant, September 2023" }
        ]
    },

    manufacturing: {
        title: "Community Manufacturing Training",
        description: "Pictures from local manufacturing and practical skills training.",
        photos: [
            { src: "images/gallery/manufacturing/01.jpg", caption: "Perfume making, 17 August 2023" },
            { src: "images/gallery/manufacturing/02.jpg", caption: "Body lotion making, 17 August 2023" },
            { src: "images/gallery/manufacturing/03.jpg", caption: "Soap making, 17 August 2023" },
            { src: "images/gallery/manufacturing/04.jpg", caption: "Perfumes made by learners for sale" },
            { src: "images/gallery/manufacturing/05.jpg", caption: "Body lotions made for sale" },
            { src: "images/gallery/manufacturing/06.jpg", caption: "Cleaning agents training, Braamfischerville, Soweto, 25 August 2023" },
            { src: "images/gallery/manufacturing/07.jpg", caption: "Body lotion training, Dobsonville, Soweto, 30 August 2023" },
            { src: "images/gallery/manufacturing/08.jpg", caption: "Furniture making training, Alexandra, 20 July 2023" },
            { src: "images/gallery/manufacturing/09.jpg", caption: "Mary Otigbu with factory owners" }
        ]
    },

    technology: {
        title: "Technology and Innovation",
        description: "Pictures from technology, digital skills and innovation activities.",
        photos: [
            { src: "images/gallery/technology/01.jpg", caption: "Girls in Tech: web design online training, 20 June" },
            { src: "images/gallery/technology/02.jpg", caption: "Girls in Tech: web application online training, 15 July" },
            { src: "images/gallery/technology/03.jpg", caption: "Girls in Tech: onboarding session in Soweto, 10 August" }
        ]
    },

    youth: {
        title: "Youth Development Activities",
        description: "Pictures from youth empowerment, mentoring and development programmes.",
        photos: [
            { src: "images/gallery/youth/01.jpg", caption: "Orange Farm community session, 24 August 2023" },
            { src: "images/gallery/youth/02.jpg", caption: "Orange Farm community session, 24 August 2023" },
            { src: "images/gallery/youth/03.jpg", caption: "Orange Farm community session, 24 August 2023" },
            { src: "images/gallery/youth/04.jpg", caption: "The Young Executive Minds team at a community event" },
            { src: "images/gallery/youth/05.jpg", caption: "The YEMs team with community members" },
            { src: "images/gallery/youth/06.jpg", caption: "Group photo with the YEMs banner" },
            { src: "images/gallery/youth/07.jpg", caption: "Sales and distributorship training, East London, 27 May" },
            { src: "images/gallery/youth/08.jpg", caption: "Sales and distributorship training session" }
        ]
    }
};

const albumKey = new URLSearchParams(window.location.search).get("album");
const album = albumInformation[albumKey];

if (!album) {
    window.location.replace("gallery.html");
} else {
    document.title = album.title + " | YEMs Gallery";
    document.getElementById("albumTitle").textContent = album.title;
    document.getElementById("albumDescription").textContent = album.description;

    const grid = document.getElementById("albumPhotoGrid");
    const count = document.getElementById("photoCount");
    const photos = album.photos || [];
    count.textContent = photos.length + (photos.length === 1 ? " picture" : " pictures");

    const lightbox = document.getElementById("photoLightbox");
    const lbImage = lightbox.querySelector("img");
    const lbCaption = lightbox.querySelector("p");
    let current = 0;

    function show(i) {
        current = (i + photos.length) % photos.length;
        lbImage.src = photos[current].src;
        lbImage.alt = photos[current].caption;
        lbCaption.textContent = photos[current].caption + "  (" + (current + 1) + " of " + photos.length + ")";
    }

    if (!photos.length) {
        grid.innerHTML = '<div class="album-empty"><h3>No pictures available yet</h3><p>Pictures for this album will appear here soon.</p></div>';
    }

    photos.forEach(function (photo, i) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "album-photo-card album-photo-button";
        button.innerHTML = '<img loading="lazy" alt=""><span class="album-photo-caption"></span>';
        button.querySelector("img").src = photo.src;
        button.querySelector("img").alt = photo.caption;
        button.querySelector("span").textContent = photo.caption;
        button.addEventListener("click", function () { show(i); lightbox.showModal(); });
        grid.appendChild(button);
    });

    lightbox.querySelector(".lb-close").addEventListener("click", function () { lightbox.close(); });
    lightbox.querySelector(".lb-prev").addEventListener("click", function () { show(current - 1); });
    lightbox.querySelector(".lb-next").addEventListener("click", function () { show(current + 1); });
    lightbox.addEventListener("click", function (e) { if (e.target === lightbox) lightbox.close(); });
    document.addEventListener("keydown", function (e) {
        if (!lightbox.open) return;
        if (e.key === "ArrowLeft") show(current - 1);
        if (e.key === "ArrowRight") show(current + 1);
    });
}
