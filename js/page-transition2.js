// Minimal replacement for PageTransitions (no jQuery required)

document.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById("pt-content");
  
    // 🔁 Animation map (copied from your system)
    function getAnimation(id) {
      const map = {
        1: { in: 'pt-page-moveFromRight', out: 'pt-page-moveToLeft' },
        2: { in: 'pt-page-moveFromLeft', out: 'pt-page-moveToRight' },
        61: { in: 'pt-page-rotateCubeBottomIn', out: 'pt-page-rotateCubeBottomOut pt-page-ontop' },
        62: { in: 'pt-page-rotateCarouselLeftIn', out: 'pt-page-rotateCarouselLeftOut pt-page-ontop' }
        // 👉 add more if needed from your original list
      };
  
      return map[id] || map[61];
    }
  
    // 🚀 Load external page with animation
    function loadPage(page, animationId) {
      const anim = getAnimation(parseInt(animationId));
  
      // exit animation
      container.classList.remove("pt-page-current");
      anim.out.split(" ").forEach(cls => container.classList.add(cls));
  
      fetch(page)
        .then(res => {
          if (!res.ok) throw new Error("Page not found");
          return res.text();
        })
        .then(html => {
  
          // replace content
          container.innerHTML = html;
  
          // reset classes
          container.className = "pt-page";
  
          // entry animation
          anim.in.split(" ").forEach(cls => container.classList.add(cls));
          container.classList.add("pt-page-current");
  
          // scroll top like original
          window.scrollTo({ top: 0, behavior: "smooth" });
  
        })
        .catch(err => console.error("Load error:", err));
    }
  
    // 🧭 Handle menu clicks
    document.querySelectorAll(".pt-trigger").forEach(link => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
  
        const target = this.getAttribute("href").replace("#", "");
        const animation = this.dataset.animation || 61;
  
        // update URL (like original system)
        window.location.hash = target;
  
        loadPage("pages/" + target + ".html", animation);
  
        // active menu state
        document.querySelectorAll(".site-main-menu li")
          .forEach(li => li.classList.remove("active"));
  
        this.parentElement.classList.add("active");
      });
    });
  
    // 🔄 Handle direct URL / refresh (#about etc.)
    function loadFromHash() {
      let hash = window.location.hash.replace("#", "");
  
      if (!hash) hash = "about_me";
  
      const link = document.querySelector(`.pt-trigger[href="#${hash}"]`);
      const animation = link ? link.dataset.animation : 61;
  
      loadPage("pages/" + hash + ".html", animation);
  
      // set active menu
      document.querySelectorAll(".site-main-menu li")
        .forEach(li => li.classList.remove("active"));
  
      if (link) link.parentElement.classList.add("active");
    }
  
    window.addEventListener("hashchange", loadFromHash);
  
    // 🔥 Initial load
    loadFromHash();
  
  });