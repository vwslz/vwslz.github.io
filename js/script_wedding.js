(() => {
  const events = [...(window.WEDDING_EVENTS || [])].sort((a, b) => (a.sortDate || a.date).localeCompare(b.sortDate || b.date));
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  const milestoneNames = {
    meeting: "遇",
    relationship: "悦",
    engagement: "许",
    marriage: "囍"
  };

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  function focusEvent(id, behavior = "auto") {
    const card = document.getElementById(id);
    const viewport = document.querySelector("#timeline-viewport");
    if (!card || !viewport) return;

    if (window.matchMedia("(max-width: 760px)").matches) {
      const top = card.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.34;
      if (behavior === "instant") window.scrollTo(0, top);
      else window.scrollTo({ top, behavior });
    } else {
      const cardRect = card.getBoundingClientRect();
      const viewportRect = viewport.getBoundingClientRect();
      const left = viewport.scrollLeft + cardRect.left - viewportRect.left - viewport.clientWidth / 2 + cardRect.width / 2;
      if (behavior === "instant") viewport.scrollLeft = left;
      else viewport.scrollTo({ left, behavior });
      const centeredCard = card.getBoundingClientRect();
      const top = centeredCard.top + window.scrollY + centeredCard.height / 2 - window.innerHeight / 2;
      if (behavior === "instant") window.scrollTo(0, top);
      else window.scrollTo({ top, behavior });
    }
  }

  function imageNode(src, alt, className, loading = "lazy") {
    if (!src) return null;
    const image = el("img", className);
    image.src = src;
    image.alt = alt || "";
    image.loading = loading;
    image.decoding = "async";
    return image;
  }

  function butterflyNode({ left, mirrored = false } = {}) {
    const butterfly = el("span", `timeline-butterfly${mirrored ? " timeline-butterfly--mirrored" : ""}`);
    butterfly.setAttribute("aria-hidden", "true");
    const flightX = 48 + Math.random() * 72;
    butterfly.style.setProperty("--butterfly-x", `${mirrored ? -flightX : flightX}px`);
    butterfly.style.setProperty("--butterfly-y", `${-48 - Math.random() * 72}px`);
    butterfly.style.setProperty("--butterfly-left", left || `${14 + Math.random() * 72}%`);
    butterfly.style.setProperty("--butterfly-tilt", `${-8 + Math.random() * 16}deg`);

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 60 60");
    svg.setAttribute("focusable", "false");
    const wingClipId = `butterfly-wing-clip-${Math.random().toString(36).slice(2)}`;
    const wingScaleTransform = "translate(-5.06 -8.14) scale(1.22)";
    const wings = [{
      className: "butterfly-wing-group butterfly-wing-group--near",
      outline: "M23 37 L16 30 L12 21 L11 13 L14 7 L20 2 L28 1 L37 4 L46 10 L53 18 L59 27 L59 33 L54 36 L47 38 L38 39 L30 38 Z",
      markings: [
        "M25 30 L20 23 L18 15 L20 9 L24 7 L29 11 L32 18 L30 25 Z",
        "M40 8 C45 6 49 10 47 15 C45 19 40 19 38 15 C37 12 38 9 40 8 Z",
        "M33 31 C36 24 45 22 48 27 C50 31 44 33 40 31 C36 29 34 32 37 35"
      ]
    }];
    wings.forEach((wing) => {
      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      group.setAttribute("class", wing.className);
      const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
      const clip = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
      clip.setAttribute("id", wingClipId);
      clip.setAttribute("clipPathUnits", "userSpaceOnUse");
      const clipShape = document.createElementNS("http://www.w3.org/2000/svg", "path");
      clipShape.setAttribute("d", wing.outline);
      clipShape.setAttribute("transform", wingScaleTransform);
      clip.append(clipShape);
      defs.append(clip);
      group.append(defs);
      const outline = document.createElementNS("http://www.w3.org/2000/svg", "path");
      outline.setAttribute("d", wing.outline);
      outline.setAttribute("class", "butterfly-wing");
      outline.setAttribute("transform", wingScaleTransform);
      group.append(outline);
      const markings = document.createElementNS("http://www.w3.org/2000/svg", "g");
      markings.setAttribute("clip-path", `url(#${wingClipId})`);
      wing.markings.forEach((pathData) => {
        const marking = document.createElementNS("http://www.w3.org/2000/svg", "path");
        marking.setAttribute("d", pathData);
        marking.setAttribute("class", "butterfly-marking");
        markings.append(marking);
      });
      group.append(markings);
      svg.append(group);
    });
    const body = document.createElementNS("http://www.w3.org/2000/svg", "path");
    body.setAttribute("class", "butterfly-body");
    body.setAttribute("d", "M20 30 Q24 29 28 31 L42 35 L40 38 L27 34 Q23 33 20 34 Z M21 30 Q15 24 8 24 M21 30 Q17 22 14 19");
    body.setAttribute("transform", "translate(0 3)");
    svg.append(body);
    butterfly.append(svg);

    const flyAway = () => {
      if (butterfly.classList.contains("is-flying-away")) return;
      butterfly.classList.add("is-flying-away");
      window.setTimeout(() => { butterfly.style.pointerEvents = "none"; }, 850);
    };
    butterfly.addEventListener("pointerenter", flyAway, { once: true });
    butterfly.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      event.stopPropagation();
      flyAway();
    });
    return butterfly;
  }

  function renderTimeline() {
    const track = document.querySelector("#timeline-track");
    const links = document.querySelector("#highlight-links");
    if (!track || !links || !events.length) return;

    const timelineEvents = events.filter((event) => event.milestone || event.showOnTimeline === true);
    const highlightEvents = timelineEvents.filter((event) => event.milestone);
    highlightEvents.forEach((event) => {
      const link = el("a", `highlight-link${event.milestone === "marriage" ? " is-marriage" : ""}`);
      link.href = `#${event.id}`;
      link.dataset.eventId = event.id;
      link.append(el("span", "highlight-dot", "♥"));
      link.append(el("span", "highlight-text", milestoneNames[event.milestone]));
      links.append(link);
    });

    const years = [...new Set(timelineEvents.map((event) => event.year))];
    const firstYear = Math.min(...years);
    const lastYear = Math.max(...years);

    for (let year = firstYear; year <= lastYear; year += 1) {
      const yearEvents = timelineEvents.filter((event) => event.year === year);
      if (!yearEvents.length) continue;
      const group = el("section", "year-group");
      group.setAttribute("aria-label", `${year}`);
      group.style.width = `${yearEvents.length * 14 + 3}rem`;

      const railNode = el("span", "year-node", "");
      railNode.setAttribute("aria-hidden", "true");
      const yearLabel = el("h3", "year-label", `${year}`);
      group.append(railNode, yearLabel);

      yearEvents.forEach((event, index) => {
        const category = event.category || (event.milestone ? "highlight" : "travel");
        const card = el("a", `event-card event-card--${category}${event.milestone ? ` event-card--${event.milestone}` : ""} ${index % 2 ? "event-card--below" : "event-card--above"}`);
        card.id = event.id;
        card.href = `wedding-event.html?id=${encodeURIComponent(event.id)}`;
        card.style.left = `${1 + index * 14}rem`;
        card.setAttribute("aria-label", `${event.dateLabel}: ${event.title}${event.location ? `, ${event.location}` : ""}`);

        const image = imageNode(event.cover, `${event.title} in ${event.location || event.dateLabel}`, "event-cover", event.milestone === "marriage" ? "eager" : "lazy");
        const front = image ? el("span", "event-face event-face--front") : card;
        if (image) {
          if (event.milestone === "marriage") image.fetchPriority = "high";
          card.classList.add("event-card--has-cover");
          const flipInner = el("span", "event-flip-inner");
          const cover = el("span", "event-cover-wrap");
          cover.append(image);
          const back = el("span", "event-face event-face--back");
          back.setAttribute("aria-hidden", "true");
          back.append(cover);
          flipInner.append(front, back);
          card.append(flipInner);
        }

        const copy = el("span", "event-copy");
        copy.append(el("span", "event-date", event.dateLabel));
        copy.append(el("span", "event-title", event.title));
        if (event.location) copy.append(el("span", "event-location", event.location));
        if (event.shortDescription) copy.append(el("span", "event-description", event.shortDescription));
        front.append(copy);

        if (event.milestone || category === "travel" || category === "todo") {
          const badgeText = event.milestone ? milestoneNames[event.milestone] : (category === "travel" ? "Travel" : "To do");
          const badge = el("span", "milestone-badge", badgeText);
          front.append(badge);
        }
        if (event.milestone === "marriage") {
          card.append(butterflyNode({ left: "calc(50% - 1.35rem)", mirrored: true }), butterflyNode({ left: "calc(50% + 1.35rem)" }));
        } else {
          card.append(butterflyNode());
        }
        group.append(card);
      });

      track.append(group);
    }

    // Open around the wedding as the natural entry point into the story.
    const entryId = window.location.hash.slice(1) || "married";
    const entryCard = document.getElementById(entryId);
    if (entryCard) {
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
        focusEvent(entryId, "instant");
        window.setTimeout(() => focusEvent(entryId, "instant"), 100);
      }));
    }

    links.addEventListener("click", (event) => {
      const link = event.target.closest("a[data-event-id]");
      const card = link && document.getElementById(link.dataset.eventId);
      if (!card) return;
      event.preventDefault();
      const destination = `#${link.dataset.eventId}`;
      history.replaceState(null, "", destination);
      focusEvent(link.dataset.eventId, "smooth");
    });
  }

  function renderDetail() {
    const container = document.querySelector("#event-detail");
    if (!container) return;

    const id = new URLSearchParams(window.location.search).get("id");
    const index = events.findIndex((event) => event.id === id);
    const event = events[index];
    if (!event) {
      document.title = "Moment not found — Hui & Yimin";
      container.append(el("p", "eyebrow", "A little detour"), el("h1", "detail-title", "This moment isn't here yet."));
      const returnLink = el("a", "button-link", "Back to our story");
      returnLink.href = "wedding.html";
      container.append(returnLink);
      return;
    }

    document.title = `${event.title} — Hui & Yimin`;
    const heading = el("div", "detail-heading");
    heading.append(el("p", "eyebrow", event.milestone ? milestoneNames[event.milestone] : "A memory"));
    heading.append(el("p", "detail-date", event.dateLabel));
    heading.append(el("h1", "detail-title", event.title));
    if (event.location) heading.append(el("p", "detail-location", event.location));
    container.append(heading);

    const hero = imageNode(event.cover, `${event.title}${event.location ? `, ${event.location}` : ""}`, "detail-hero", "eager");
    if (hero) {
      hero.fetchPriority = "high";
      const heroWrap = el("figure", "detail-hero-wrap");
      heroWrap.append(hero);
      container.append(heroWrap);
    }

    const story = el("div", "detail-story");
    const paragraphs = (event.story || "").split("\n\n").filter(Boolean);
    paragraphs.forEach((paragraph) => story.append(el("p", "", paragraph)));
    container.append(story);

    if (event.gallery && event.gallery.length) {
      const gallerySection = el("section", "detail-gallery");
      gallerySection.setAttribute("aria-label", "Photographs from this memory");
      gallerySection.append(el("p", "eyebrow", "A few frames to remember"));
      const gallery = el("div", "gallery-grid");
      event.gallery.forEach((photo, photoIndex) => {
        const figure = el("figure", "gallery-photo");
        const image = imageNode(photo.src || photo, photo.alt || `${event.title}, photograph ${photoIndex + 1}`, "", "lazy");
        if (image) figure.append(image);
        if (photo.caption) figure.append(el("figcaption", "", photo.caption));
        gallery.append(figure);
      });
      gallerySection.append(gallery);
      container.append(gallerySection);
    }

    const mapLink = el("a", "text-link detail-map-link", "Explore our map →");
    mapLink.href = "map.html";
    container.append(mapLink);

    const milestoneLink = el("a", "text-link detail-timeline-link", "See this day on our timeline →");
    milestoneLink.href = `wedding.html#${event.id}`;
    container.append(milestoneLink);

    const navigation = el("nav", "detail-navigation");
    navigation.setAttribute("aria-label", "Other moments");
    const previous = events[index - 1];
    const next = events[index + 1];
    if (previous) {
      const link = el("a", "detail-nav-link detail-nav-link--previous", `← ${previous.title}`);
      link.href = `wedding-event.html?id=${encodeURIComponent(previous.id)}`;
      navigation.append(link);
    } else navigation.append(el("span", "detail-nav-spacer", ""));
    if (next) {
      const link = el("a", "detail-nav-link detail-nav-link--next", `${next.title} →`);
      link.href = `wedding-event.html?id=${encodeURIComponent(next.id)}`;
      navigation.append(link);
    }
    container.append(navigation);
  }

  function startRelationshipCounter() {
    const counter = document.querySelector("#relationship-counter");
    if (!counter) return;

    const start = new Date(counter.dataset.start);
    if (Number.isNaN(start.getTime())) return;

    const update = () => {
      const now = new Date();
      let years = 0;
      let months = 0;
      let days = 0;

      if (now >= start) {
        let totalMonths = (now.getFullYear() - start.getFullYear()) * 12 + now.getMonth() - start.getMonth();
        let monthMark = new Date(start.getFullYear(), start.getMonth() + totalMonths, start.getDate());
        if (monthMark > now) {
          totalMonths -= 1;
          monthMark = new Date(start.getFullYear(), start.getMonth() + totalMonths, start.getDate());
        }

        years = Math.floor(totalMonths / 12);
        months = totalMonths % 12;
        const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
        const lastMonthMark = Date.UTC(monthMark.getFullYear(), monthMark.getMonth(), monthMark.getDate());
        days = Math.floor((today - lastMonthMark) / 86400000);
      }

      const yearLabel = years === 1 ? "year" : "years";
      const monthLabel = months === 1 ? "month" : "months";
      const dayLabel = days === 1 ? "day" : "days";
      const value = `${years} ${yearLabel}, ${months} ${monthLabel}, ${days} ${dayLabel}`;

      if (counter.textContent !== value) {
        counter.textContent = value;
        counter.classList.remove("is-ticking");
        void counter.offsetWidth;
        counter.classList.add("is-ticking");
      }
    };

    const updateAtNextDay = () => {
      const now = new Date();
      const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      window.setTimeout(() => {
        update();
        updateAtNextDay();
      }, nextDay.getTime() - now.getTime() + 25);
    };

    update();
    updateAtNextDay();
    document.addEventListener("visibilitychange", update);
  }

  startRelationshipCounter();
  renderTimeline();
  renderDetail();
})();
