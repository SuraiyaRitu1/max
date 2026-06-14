document.addEventListener("DOMContentLoaded", () => {
  // Swiper Initialization
  new Swiper(".ugc-slider", {
    slidesPerView: 2,
    spaceBetween: 20,
    loop: false,
    rewind: true,
    speed: 600,
    slidesPerGroup: 1,
    watchOverflow: false,
    navigation: { nextEl: ".ugc-next", prevEl: ".ugc-prev" },
    breakpoints: {
      480: { slidesPerView: 2, slidesPerGroup: 1 },
      768: { slidesPerView: 3, slidesPerGroup: 1 },
      1024: { slidesPerView: 4, slidesPerGroup: 1 },
    },
  });

  // Grid Slider Helper
  const setupGridSlider = (id, laid, raid) => {
    const grid = document.getElementById(id);
    const al = document.getElementById(laid);
    const ar = document.getElementById(raid);

    if (!grid || !al || !ar) return;

    const update = () => {
      al.style.display = grid.scrollLeft <= 5 ? "none" : "flex";
      ar.style.display =
        Math.ceil(grid.scrollLeft) >= grid.scrollWidth - grid.clientWidth - 5
          ? "none"
          : "flex";
    };

    update();
    grid.addEventListener("scroll", update);
    window.addEventListener("resize", update);

    [al, ar].forEach((arrow, i) => {
      arrow.onclick = () => {
        const cats = document.querySelectorAll(".cat-item").length;
        let amt = grid.clientWidth;

        if (cats > 1) {
          amt =
            id === "icon-grid-container"
              ? (grid.scrollWidth - grid.clientWidth) / (cats - 1)
              : grid.scrollWidth / cats;
        }

        grid.scrollBy({
          left: (i ? 1 : -1) * Math.max(amt, 20),
          behavior: "smooth",
        });
      };
    });

    let down = false;
    let sx;
    let sl;

    grid.onmousedown = (e) => {
      down = true;
      grid.style.scrollSnapType = "none";
      grid.style.scrollBehavior = "auto";
      sx = e.pageX - grid.offsetLeft;
      sl = grid.scrollLeft;
    };

    grid.onmouseleave = grid.onmouseup = () => {
      down = false;
      grid.style.scrollSnapType = "";
      grid.style.scrollBehavior = "";
    };

    grid.onmousemove = (e) => {
      if (!down) return;
      e.preventDefault();
      grid.scrollLeft = sl - (e.pageX - grid.offsetLeft - sx) * 2;
    };

    return update;
  };

  setupGridSlider("icon-grid-container", "grid-arrow-left", "grid-arrow-right");
  setupGridSlider(
    "category-icons-container",
    "category-arrow-left",
    "category-arrow-right"
  );

  // Dynamic Inputs
  const wrap = document.getElementById("inputs-wrapper");
  const btn = document.getElementById("add-line-btn");

  if (wrap && btn) {
    const bind = (input, limit) => {
      input.oninput = (e) => {
        limit.textContent = `${e.target.value.length}/15`;
      };
    };

    const updateBtn = () => {
      btn.style.display =
        wrap.querySelectorAll(".input-group").length >= 3 ? "none" : "flex";
    };

    wrap.querySelectorAll(".input-group").forEach((group) => {
      bind(group.querySelector("input"), group.querySelector(".char-limit"));
    });

    btn.onclick = (e) => {
      e.preventDefault();

      const count = wrap.querySelectorAll(".input-group").length;

      if (count < 3) {
        const div = document.createElement("div");
        div.className = "input-line-container dynamic-added-line";
        div.style = "display:flex;align-items:center;gap:10px";

        div.innerHTML = `
          <div class="input-group" style="flex:1;margin-bottom:0">
            <input type="text" placeholder="Line ${
              count + 1
            } (optional)" maxlength="15" class="label-input">
            <span class="char-limit">0/15</span>
          </div>
          <button class="remove-line-btn" style="background:none;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;width:14px;margin:0;padding:0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 6L18 18M18 6L6 18" stroke="#888" stroke-width="2.2" stroke-linecap="round"/>
            </svg>
          </button>
        `;

        wrap.appendChild(div);

        div.querySelector(".remove-line-btn").onclick = () => {
          div.remove();
          updateBtn();
        };

        bind(div.querySelector("input"), div.querySelector(".char-limit"));
        updateBtn();
      }
    };

    updateBtn();
  }

  // FAQ Image Height
  const fImg = document.querySelector(".faq-image-side");
  const fAcc = document.querySelector(".faq-accordion-side");
  const fWrp = document.querySelector(".faq-wrapper");

  if (fImg && fAcc && fWrp) {
    fWrp.style.alignItems = "flex-start";

    const sync = () => {
      const checked = Array.from(fAcc.querySelectorAll(".faq-toggle:checked"));

      checked.forEach((checkbox) => {
        checkbox.checked = false;
      });

      const h = fAcc.offsetHeight;

      checked.forEach((checkbox) => {
        checkbox.checked = true;
      });

      fImg.style.height = `${h}px`;
    };

    window.addEventListener("load", sync);

    let timer;
    window.addEventListener("resize", () => {
      clearTimeout(timer);
      timer = setTimeout(sync, 100);
    });

    sync();
  }

  // Tabs
  document.querySelectorAll(".tool-tabs .tab-btn").forEach((tab) => {
    tab.onclick = () => {
      document.querySelectorAll(".tool-tabs .tab-btn").forEach((button) => {
        button.classList.remove("active");
      });

      tab.classList.add("active");
    };
  });

  // Range Slider
  const sObj = document.querySelector(".range-slider");
  const thumb = document.querySelector(".slider-thumb");
  const track = document.querySelector(".slider-track");
  const topG = document.getElementById("icon-grid-container");
  const botG = document.getElementById("category-icons-container");
  const cats = document.querySelectorAll(".cat-item");

  if (sObj && thumb) {
    let dragging = false;

    const upUI = (p, fromScroll = false) => {
      p = Math.max(0, Math.min(1, p));

      thumb.style.left = `${p * 100}%`;
      track.style.width = `${p * 100}%`;

      if (!fromScroll) {
        [topG, botG].forEach((grid) => {
          if (grid) {
            grid.scrollLeft = p * (grid.scrollWidth - grid.clientWidth);
          }
        });
      }

      cats.forEach((cat, i) => {
        cat.classList.toggle("active", i === Math.round(p * (cats.length - 1)));
      });
    };

    const drag = (e) => {
      if (!dragging) return;

      const r = sObj.getBoundingClientRect();
      const clientX = e.type.includes("mouse")
        ? e.clientX
        : e.touches[0].clientX;

      upUI((clientX - r.left) / r.width);
    };

    [thumb, sObj].forEach((el) => {
      el.onmousedown = (e) => {
        dragging = true;
        document.body.style.userSelect = "none";
        drag(e);
      };

      el.addEventListener(
        "touchstart",
        (e) => {
          dragging = true;
          drag(e);
        },
        { passive: true }
      );
    });

    window.onmousemove = drag;
    window.ontouchmove = drag;

    window.onmouseup = window.ontouchend = () => {
      dragging = false;
      document.body.style.userSelect = "";
    };

    if (topG) {
      topG.addEventListener("scroll", () => {
        if (!dragging) {
          const max = topG.scrollWidth - topG.clientWidth;

          if (max > 0) {
            upUI(topG.scrollLeft / max, true);
          }
        }
      });
    }

    cats.forEach((item, i) => {
      item.onclick = () => upUI(i / (cats.length - 1 || 1));
    });

    upUI(0);
  }

  // Header Mobile Menu
  const mobileBreakpoint = 969;
  const isMobile = () => window.innerWidth <= mobileBreakpoint;
  const addListener = (el, event, fn) => el && el.addEventListener(event, fn);

  const mobileMenuBtn = document.getElementById("mobileMenuToggle");
  const mobileMenu = document.querySelector(".nav-wrapper");
  const mobileCloseBtn = document.getElementById("mobileClose");
  const mobileOverlay = document.querySelector(".mobile-overlay");

  const openMenu = () => {
    if (!isMobile()) return;
    mobileMenu?.classList.add("open");
    mobileOverlay?.classList.add("show");
  };

  const closeMenu = () => {
    mobileMenu?.classList.remove("open");
    mobileOverlay?.classList.remove("show");

    document.querySelectorAll(".has-mega.active").forEach((item) => {
      item.classList.remove("active");
    });
  };

  addListener(mobileMenuBtn, "click", openMenu);
  addListener(mobileCloseBtn, "click", closeMenu);
  addListener(mobileOverlay, "click", closeMenu);

  const setupMegaMenu = () => {
    document.querySelectorAll(".has-mega").forEach((item) => {
      const link = item.querySelector("a");

      if (!link || link.dataset.listener) return;

      addListener(link, "click", (e) => {
        if (isMobile()) {
          e.preventDefault();
          item.classList.toggle("active");
        }
      });

      link.dataset.listener = "true";
    });
  };

  setupMegaMenu();
  window.addEventListener("resize", setupMegaMenu);

  // Footer Language Dropdown
  const footerDropdown = document.querySelector(".footer-lang-dropdown");

  if (footerDropdown) {
    const footerSelected = footerDropdown.querySelector(
      ".footer-lang-selected"
    );

    addListener(footerSelected, "click", (e) => {
      e.stopPropagation();
      footerDropdown.classList.toggle("open");
    });

    document.addEventListener("click", (e) => {
      if (!footerDropdown.contains(e.target)) {
        footerDropdown.classList.remove("open");
      }
    });
  }

  // Testimonials Slider
  const testimonialGap = 20;
  const testimonialWrapper = document.querySelector(
    ".testimonials-slider-wrapper"
  );
  const testimonialSlider = document.querySelector(
    ".testimonials-slider-container"
  );
  const testimonialCards = Array.from(
    document.querySelectorAll(".testimonials-card")
  );
  const testimonialDots = document.querySelector(".testimonials-slider-dots");

  if (testimonialWrapper && testimonialSlider && testimonialCards.length) {
    let index = 0;
    let slideWidth = 0;
    let startX = 0;
    let isDragging = false;
    let autoInterval;

    const getVisible = () => {
      const w = window.innerWidth;
      return w < 768 ? 1 : w < 1024 ? 2 : w < 1921 ? 3 : 4;
    };

    const maxIndex = () => Math.max(0, testimonialCards.length - getVisible());

    const updateSlider = () => {
      index = Math.min(Math.max(0, index), maxIndex());
      testimonialSlider.style.transform = `translateX(-${
        index * (slideWidth + testimonialGap)
      }px)`;

      if (testimonialDots) {
        Array.from(testimonialDots.children).forEach((dot, i) => {
          dot.classList.toggle("active", i === index);
        });
      }
    };

    const setWidths = () => {
      const visible = getVisible();
      const totalGap = testimonialGap * (visible - 1);

      slideWidth = (testimonialWrapper.offsetWidth - totalGap) / visible;

      testimonialCards.forEach((card) => {
        card.style.flex = `0 0 ${slideWidth}px`;
      });

      updateSlider();
    };

    const createDots = () => {
      if (!testimonialDots) return;

      const count = maxIndex() + 1;

      testimonialDots.innerHTML = "";
      testimonialDots.style.display = count > 1 ? "block" : "none";

      for (let i = 0; i < count; i++) {
        const dot = document.createElement("span");

        dot.classList.toggle("active", i === index);

        addListener(dot, "click", () => {
          index = i;
          updateSlider();
          resetAutoSlide();
        });

        testimonialDots.appendChild(dot);
      }
    };

    const startAutoSlide = () => {
      clearInterval(autoInterval);

      autoInterval = setInterval(() => {
        index = index + 1 > maxIndex() ? 0 : index + 1;
        updateSlider();
      }, 5000);
    };

    const resetAutoSlide = () => {
      clearInterval(autoInterval);
      startAutoSlide();
    };

    testimonialSlider.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      clearInterval(autoInterval);
    });

    testimonialSlider.addEventListener("touchend", (e) => {
      if (!isDragging) return;

      const diff = startX - e.changedTouches[0].clientX;

      if (Math.abs(diff) > 50) {
        index += diff > 0 ? 1 : -1;
      }

      updateSlider();
      startAutoSlide();
      isDragging = false;
    });

    testimonialSlider.style.display = "flex";
    testimonialSlider.style.transition = "transform 0.4s ease";

    setWidths();
    createDots();
    updateSlider();
    startAutoSlide();

    let resizeTimeout;

    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);

      resizeTimeout = setTimeout(() => {
        setWidths();
        createDots();
      }, 150);
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        clearInterval(autoInterval);
      } else {
        startAutoSlide();
      }
    });
  }

  // Basket Positioning
  const panel = document.querySelector(".bd-panel");
  const arrow = document.querySelector(".bd-arrow");

  const getActiveBasketIcon = () =>
    [...document.querySelectorAll(".basket-icon")].find(
      (el) => el.offsetParent !== null
    );

  const resetBasketDropdown = () => {
    if (!panel || !arrow) return;

    panel.style.left = "";
    panel.style.right = "";
    panel.style.top = "";
    arrow.style.left = "";
    arrow.style.right = "";
  };

  const positionBasketDropdown = () => {
    if (window.innerWidth <= 767) {
      resetBasketDropdown();
      return;
    }

    const basket = getActiveBasketIcon();

    if (!panel || !arrow || !basket) return;

    const basketRect = basket.getBoundingClientRect();

    panel.style.left = "0px";
    panel.style.right = "auto";
    panel.style.top = "0px";

    const panelRect = panel.getBoundingClientRect();
    const basketCenter = basketRect.left + basketRect.width / 2;
    const arrowHalf = arrow.offsetWidth / 2;

    let panelLeft = basketCenter - panelRect.width + 24;
    panelLeft = Math.max(
      12,
      Math.min(panelLeft, window.innerWidth - panelRect.width - 12)
    );

    const panelTop = basketRect.bottom + 12;

    panel.style.left = `${panelLeft}px`;
    panel.style.top = `${panelTop}px`;

    const arrowLeft = basketCenter - panelLeft - arrowHalf;

    arrow.style.left = `${arrowLeft}px`;
    arrow.style.right = "auto";
  };

  window.addEventListener("load", positionBasketDropdown);
  window.addEventListener("resize", positionBasketDropdown);
  window.addEventListener("scroll", positionBasketDropdown, { passive: true });

  document.querySelectorAll(".basket-icon").forEach((icon) => {
    icon.addEventListener("click", () => {
      requestAnimationFrame(positionBasketDropdown);
    });
  });
});

// Tooltips
const floatT = document.createElement("div");
floatT.className = "tooltip";
document.body.appendChild(floatT);

document.querySelectorAll(".grid-box").forEach((box) => {
  box.onmousemove = (e) => {
    floatT.textContent =
      box.querySelector(".tooltip")?.textContent || "Cute Fox";

    let x = e.clientX + 15;
    let y = e.clientY + 15;

    const r = floatT.getBoundingClientRect();

    if (x + r.width > window.innerWidth) {
      x = e.clientX - r.width - 15;
    }

    if (y + r.height > window.innerHeight) {
      y = e.clientY - r.height - 15;
    }

    floatT.style.left = `${Math.max(10, x)}px`;
    floatT.style.top = `${Math.max(10, y)}px`;
    floatT.classList.add("visible");
  };

  box.onmouseleave = () => {
    floatT.classList.remove("visible");
  };
});
