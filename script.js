// ========================================
// LOAD REUSABLE HTML PARTS
// ========================================
function loadHTML(id, file, callback = null) {

  const el = document.getElementById(id);

  // stop if target does not exist
  if (!el) {
    console.warn("Element not found:", id);
    return;
  }

  fetch(file)

    .then(res => {

      // handle fetch errors
      if (!res.ok) {
        throw new Error("Could not load " + file);
      }

      return res.text();
    })

    .then(data => {

      // inject html
      el.innerHTML = data;

      // 🔥 reinitialize mobile menu AFTER header loads
      if (id === "header") {

        // slight delay ensures DOM is ready
        setTimeout(() => {

          if (typeof initMobileMenu === "function") {
            initMobileMenu();
          }

        }, 50);
      }

      // optional callback support
      if (callback && typeof callback === "function") {
        callback();
      }

    })

    .catch(err => console.error(err));
}

//========================================
// // INIT MOBILE menu
//========================================
function initMobileMenu() {

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");

  if (!toggle || !nav) {
    console.warn("Mobile menu elements missing");
    return;
  }

  // prevent duplicate listeners
  toggle.onclick = function () {
    nav.classList.toggle("mobile-menu-hide");
  };
}

// ========================================
// PAGE CLASS MAP
// ========================================
const pageClassMap = {
  "about_me": "pt-page-1",
  "resume": "pt-page-2",
  "case-studies": "pt-page-4"
};


// ========================================
// ANIMATION MAP
// ========================================
function getAnimation(id) {

  const map = {

    "58": [
      "pt-page-moveFromRight",
      "pt-page-moveToLeft"
    ],

    "59": [
      "pt-page-moveFromLeft",
      "pt-page-moveToRight"
    ],

    "60": [
      "pt-page-moveFromBottom",
      "pt-page-moveToTop"
    ],

    "61": [
      "pt-page-rotateCubeBottomIn",
      "pt-page-rotateCubeBottomOut pt-page-ontop"
    ]

  };

  return map[id] || map["61"];
}


// ========================================
// APPLY MULTIPLE CLASSES SAFELY
// ========================================
function addClasses(el, classes) {

  classes.split(" ").forEach(c => {

    if (c.trim() !== "") {
      el.classList.add(c);
    }

  });

}


// ========================================
// LOAD NORMAL TEMPLATE PAGE
// ========================================
function loadPage(hash, animationId = "61") {

  const container = document.getElementById("pt-content");

  if (!container) return;

  const clean = hash.replace("#", "");

  const file = "pages/" + clean + ".html";

  const pageClass = pageClassMap[clean] || "pt-page-1";

  const anim = getAnimation(animationId);


  // OUT ANIMATION
  container.className = "pt-page";

  addClasses(container, anim[1]);


  setTimeout(() => {

    fetch(file)

      .then(res => {

        if (!res.ok) {
          throw new Error("Page not found: " + file);
        }

        return res.text();

      })

      .then(html => {

        // LOAD CONTENT
        container.innerHTML = html;

        // RESET CLASSES
        container.className = "pt-page";

        // APPLY TEMPLATE PAGE CLASS
        container.classList.add("pt-page");

        container.classList.add(pageClass);

        container.classList.add("pt-page-current");

        // APPLY ENTRY ANIMATION
        addClasses(container, anim[0]);

      })

      .catch(err => console.error(err));

  }, 300);

}


// ========================================
// LOAD CASE STUDY / EXTERNAL PAGE
// ========================================
function loadExternalPage(file, animationId = "61") {

  const container = document.getElementById("pt-content");

  if (!container) return;

  const anim = getAnimation(animationId);


  // OUT ANIMATION
  container.className = "pt-page";

  addClasses(container, anim[1]);


  setTimeout(() => {

    fetch(file)

      .then(res => {

        if (!res.ok) {
          throw new Error("External page not found: " + file);
        }

        return res.text();

      })

      .then(html => {

        // LOAD CONTENT
        container.innerHTML = html;

        // RESET
        container.className = "pt-page";

        container.classList.add("pt-page");

        container.classList.add("pt-page-current");

        // APPLY ENTRY ANIMATION
        addClasses(container, anim[0]);

      })

      .catch(err => console.error(err));

  }, 300);

}
// ========================================
// WAIT UNTIL HTML LOADS
// ========================================
document.addEventListener("DOMContentLoaded", () => {

  // LOAD HEADER / FOOTER
  loadHTML("header", "header.html");

  loadHTML("footer", "footer.html");


 // LOAD CURRENT PAGE OR DEFAULT
const currentHash = location.hash || "#about_me";

loadPage(currentHash, "58");

  // ====================================
  // MAIN TEMPLATE NAVIGATION
  // ====================================
  document.querySelectorAll(".pt-trigger").forEach(link => {

    link.addEventListener("click", function(e) {

      e.preventDefault();

      const target = this.getAttribute("href");

      const animation = this.dataset.animation || "61";

      loadPage(target, animation);

      // UPDATE URL
      history.pushState(null, "", target);

    });

  });


  // ====================================
  // CASE STUDY LINKS
  // ====================================
  document.addEventListener("click", function(e) {

    const link = e.target.closest(".case-study-link");

    if (!link) return;

    e.preventDefault();

    const file = link.dataset.file;

// optional URL update
history.pushState(
  null,
  "",
  "?case=ga4"
);


    const animation = link.dataset.animation || "61";

    loadExternalPage(file, animation);

  });


  // ====================================
  // HANDLE BACK / FORWARD BUTTONS
  // ====================================
  window.addEventListener("popstate", () => {

    const hash = location.hash || "#about_me";

    loadPage(hash);

  });

});
document.addEventListener("click", function(e){

  const next = e.target.closest(".snap-btn.next");
  const prev = e.target.closest(".snap-btn.prev");

  if(!next && !prev) return;

  const slider = e.target.closest(".snap-wrapper").querySelector(".snap-slideshow");

  const scrollAmount = slider.offsetWidth;

  if(next){
    slider.scrollBy({ left: scrollAmount, behavior: "smooth" });
  }

  if(prev){
    slider.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  }

});
document.querySelectorAll(".gallery-scroll img").forEach(img => {
  img.addEventListener("click", () => {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");

    lightboxImg.src = img.src;
    lightbox.style.display = "flex";
  });
});

document.getElementById("lightbox").addEventListener("click", () => {
  document.getElementById("lightbox").style.display = "none";
});
document.querySelectorAll(".gallery-scroll img").forEach(img => {
  img.style.cursor = "zoom-in";

  img.onclick = function () {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");

    lightboxImg.src = this.src;
    lightbox.style.display = "flex";
  };
});

document.getElementById("lightbox").onclick = function () {
  this.style.display = "none";
};