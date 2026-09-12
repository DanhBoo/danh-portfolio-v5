(function(){
  "use strict";

  /* ---------- Gallery data (ordered ascending = client priority order) ---------- */
  var galleries = [
    { id:"illustrationGrid", group:"illustration", folder:"assets/illustration/", count:9, prefix:"Illustration" },
    { id:"charAnimeGrid",    group:"char-anime",   folder:"assets/character/anime/", count:3, prefix:"Character — Anime" },
    { id:"charChibiGrid",    group:"char-chibi",   folder:"assets/character/chibi/", count:5, prefix:"Character — Chibi" },
    { id:"charRealGrid",     group:"char-real",    folder:"assets/character/real/", count:3, prefix:"Character — Realistic" },
    { id:"charStylizedGrid", group:"char-stylized",folder:"assets/character/stylized/", count:3, prefix:"Character — Stylized" },
    { id:"bgRealGrid",       group:"bg-real",      folder:"assets/background/real/", count:2, prefix:"Background — Realistic" },
    { id:"bgStylizedGrid",   group:"bg-stylized",  folder:"assets/background/stylized/", count:6, prefix:"Background — Stylized" },
    { id:"skillGrid",        group:"skill",        folder:"assets/skill/", count:6, prefix:"Skill Concept" }
  ];

  function buildGrid(cfg){
    var container = document.getElementById(cfg.id);
    if(!container) return;

    for(var i=1;i<=cfg.count;i++){
      var src = cfg.folder + i + ".jpg";
      var a = document.createElement("a");
      a.className = "art-card";
      a.href = src;
      a.setAttribute("data-caption", cfg.prefix + " " + i);
      var img = document.createElement("img");
      img.src = src;
      img.alt = cfg.prefix + " artwork " + i;
      var frame = document.createElement("span");
      frame.className = "art-card-frame";
      var num = document.createElement("span");
      num.className = "art-card-number";
      num.textContent = (i<10 ? "0"+i : i);
      a.appendChild(img);
      a.appendChild(frame);
      a.appendChild(num);
      container.appendChild(a);
    }
  }

  galleries.forEach(buildGrid);

  /* ---------- Nav mobile toggle ---------- */
  var burger = document.getElementById("navBurger");
  var navLinks = document.querySelector(".nav-links");
  if(burger && navLinks){
    burger.addEventListener("click", function(){
      navLinks.classList.toggle("open");
    });
    navLinks.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click", function(){ navLinks.classList.remove("open"); });
    });
  }

  /* ---------- Lightbox ---------- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxCaption = document.getElementById("lightboxCaption");
  var closeBtn = document.getElementById("lightboxClose");
  var prevBtn = document.getElementById("lightboxPrev");
  var nextBtn = document.getElementById("lightboxNext");

  var currentGroup = [];
  var currentIndex = 0;

  function collectGroup(groupName){
    var nodes = document.querySelectorAll('[data-group="'+groupName+'"] .art-card');
    return Array.prototype.map.call(nodes, function(a){
      return { href:a.getAttribute("href"), caption:a.getAttribute("data-caption") || "" };
    });
  }

  function openLightbox(groupName, index){
    currentGroup = collectGroup(groupName);
    currentIndex = index;
    showCurrent();
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  var lightboxStage = document.querySelector(".lightbox-stage");

  function resetZoom(){
    lightboxImg.classList.remove("zoomed");
    if(lightboxStage){ lightboxStage.classList.remove("zoomed"); }
    lightboxStage && (lightboxStage.scrollTop = 0, lightboxStage.scrollLeft = 0);
  }

  function toggleZoom(){
    lightboxImg.classList.toggle("zoomed");
    if(lightboxStage){ lightboxStage.classList.toggle("zoomed"); }
  }

  function showCurrent(){
    if(!currentGroup.length) return;
    resetZoom();
    var item = currentGroup[currentIndex];
    lightboxImg.src = item.href;
    lightboxImg.alt = item.caption;
    lightboxCaption.textContent = item.caption;
  }

  function closeLightbox(){
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
    lightboxImg.src = "";
    resetZoom();
  }

  function step(dir){
    if(!currentGroup.length) return;
    currentIndex = (currentIndex + dir + currentGroup.length) % currentGroup.length;
    showCurrent();
  }

  document.addEventListener("click", function(e){
    var card = e.target.closest(".art-card");
    if(card){
      e.preventDefault();
      var wrap = card.closest("[data-group]");
      var group = wrap ? wrap.getAttribute("data-group") : "default";

      var siblings = Array.prototype.slice.call(document.querySelectorAll('[data-group="'+group+'"] .art-card'));
      var index = siblings.indexOf(card);
      openLightbox(group, index < 0 ? 0 : index);
    }
  });

  closeBtn.addEventListener("click", closeLightbox);
  prevBtn.addEventListener("click", function(e){ e.stopPropagation(); step(-1); });
  nextBtn.addEventListener("click", function(e){ e.stopPropagation(); step(1); });

  lightboxImg.addEventListener("click", function(e){
    e.stopPropagation();
    toggleZoom();
  });

  lightbox.addEventListener("click", function(e){
    if(e.target === lightbox){ closeLightbox(); }
  });

  document.addEventListener("keydown", function(e){
    if(!lightbox.classList.contains("open")) return;
    if(e.key === "Escape") closeLightbox();
    if(e.key === "ArrowLeft") step(-1);
    if(e.key === "ArrowRight") step(1);
  });

  /* ---------- Nav background on scroll ---------- */
  var nav = document.getElementById("siteNav");
  window.addEventListener("scroll", function(){
    if(window.scrollY > 40){ nav.style.boxShadow = "0 6px 20px rgba(0,0,0,0.4)"; }
    else{ nav.style.boxShadow = "none"; }
  });

})();
