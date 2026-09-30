(() => {
  const svg = document.querySelector("#world-map");
  const stage = document.querySelector("#map-stage");
  const countryLayer = document.querySelector("#map-countries");
  const stateLayer = document.querySelector("#map-state-regions");
  const stateCard = document.querySelector("#map-state-card");
  const card = document.querySelector("#map-card");
  if (!svg || !stage || !countryLayer || !stateLayer || !stateCard || !card) return;

  const centerLon = -100;
  const minLat = -60;
  const maxLat = 90;
  const width = 1000;
  const height = 500;
  const initialViewBox = { x: 240, y: 5, width: 520, height: 281 };
  const mapBounds = { x: 240, y: 0, width: 520, height: 286 };
  let zoomLevel = 1;
  let currentViewBox = { ...initialViewBox };
  const places = (window.WEDDING_EVENTS || []).filter((event) =>
    Array.isArray(event.coordinates) &&
    event.coordinates.length === 2 &&
    Number.isFinite(event.coordinates[0]) &&
    Number.isFinite(event.coordinates[1]) &&
    event.location
  );
  const zoomInButton = document.querySelector("#map-zoom-in");
  const zoomOutButton = document.querySelector("#map-zoom-out");
  const zoomResetButton = document.querySelector("#map-zoom-reset");
  const count = document.querySelector("#map-place-count");
  const note = document.querySelector("#map-data-note");
  const hint = document.querySelector("#map-hint");
  const dateText = document.querySelector("#map-card-date");
  const placeTitle = document.querySelector("#map-card-place");
  const storyText = document.querySelector("#map-card-story");
  const detailLink = document.querySelector("#map-card-link");
  const cardEvents = document.querySelector("#map-card-events");
  const stateList = document.querySelector("#us-state-list");
  let activeMapPoint = null;
  let activeStatePoint = null;
  let activeStateRegion = null;
  let hideTimer = null;
  let stateHideTimer = null;

  function applyViewBox() {
    svg.setAttribute("viewBox", `${currentViewBox.x} ${currentViewBox.y} ${currentViewBox.width} ${currentViewBox.height}`);
  }

  function setZoom(nextZoom) {
    zoomLevel = Math.max(1, Math.min(5, nextZoom));
    const centerX = currentViewBox.x + currentViewBox.width / 2;
    const centerY = currentViewBox.y + currentViewBox.height / 2;
    const viewWidth = initialViewBox.width / zoomLevel;
    const viewHeight = initialViewBox.height / zoomLevel;
    currentViewBox = { x: centerX - viewWidth / 2, y: centerY - viewHeight / 2, width: viewWidth, height: viewHeight };
    applyViewBox();
    if (activeMapPoint) positionCard(...activeMapPoint);
    if (activeStatePoint) positionCard(...activeStatePoint, stateCard);
  }

  function resetMapView() {
    zoomLevel = 1;
    currentViewBox = { ...initialViewBox };
    applyViewBox();
    if (activeMapPoint) positionCard(...activeMapPoint);
    if (activeStatePoint) positionCard(...activeStatePoint, stateCard);
  }

  zoomInButton?.addEventListener("click", () => setZoom(zoomLevel * 1.25));
  zoomOutButton?.addEventListener("click", () => setZoom(zoomLevel / 1.25));
  zoomResetButton?.addEventListener("click", resetMapView);
  stage.addEventListener("wheel", (event) => {
    if (event.target.closest(".map-card, .region-card, .map-zoom-controls")) return;
    if (Math.abs(event.deltaY) < 2) return;
    event.preventDefault();
    setZoom(zoomLevel * (event.deltaY < 0 ? 1.12 : 1 / 1.12));
  }, { passive: false });

  function svgPointFromScreen(clientX, clientY, matrix = svg.getScreenCTM().inverse()) {
    const point = svg.createSVGPoint();
    point.x = clientX;
    point.y = clientY;
    return point.matrixTransform(matrix);
  }

  let dragStart = null;
  svg.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0) || event.target.closest(".map-pin, .map-state-region, .map-card, .region-card, .map-zoom-controls")) return;
    const point = svgPointFromScreen(event.clientX, event.clientY);
    hideCard();
    dragStart = { pointerId: event.pointerId, clientX: event.clientX, clientY: event.clientY, point, inverseMatrix: svg.getScreenCTM().inverse(), viewBox: { ...currentViewBox }, moved: false };
    svg.setPointerCapture(event.pointerId);
  });
  svg.addEventListener("pointermove", (event) => {
    if (!dragStart || dragStart.pointerId !== event.pointerId) return;
    const distance = Math.hypot(event.clientX - dragStart.clientX, event.clientY - dragStart.clientY);
    if (distance < 3 && !dragStart.moved) return;
    dragStart.moved = true;
    event.preventDefault();
    const point = svgPointFromScreen(event.clientX, event.clientY, dragStart.inverseMatrix);
    const nextX = dragStart.viewBox.x - (point.x - dragStart.point.x);
    const nextY = dragStart.viewBox.y - (point.y - dragStart.point.y);
    const maxX = mapBounds.x + mapBounds.width - dragStart.viewBox.width;
    const maxY = mapBounds.y + mapBounds.height - dragStart.viewBox.height;
    currentViewBox = {
      ...dragStart.viewBox,
      x: Math.max(mapBounds.x, Math.min(maxX, nextX)),
      y: Math.max(mapBounds.y, Math.min(maxY, nextY))
    };
    applyViewBox();
    if (activeMapPoint) positionCard(...activeMapPoint);
    if (activeStatePoint) positionCard(...activeStatePoint, stateCard);
  });
  function endMapDrag(event) {
    if (!dragStart || dragStart.pointerId !== event.pointerId) return;
    dragStart = null;
    svg.classList.remove("is-panning");
  }
  svg.addEventListener("pointerup", endMapDrag);
  svg.addEventListener("pointercancel", endMapDrag);
  svg.addEventListener("pointermove", (event) => {
    if (dragStart && dragStart.pointerId === event.pointerId && dragStart.moved) svg.classList.add("is-panning");
  });

  count.textContent = `${places.length} ${places.length === 1 ? "shared place" : "shared places"}`;
  if (places.length === 0) {
    hint.textContent = "Add a location and coordinates to an event to place it on this map.";
    note.textContent = "Each mapped place links back to its full memory on the timeline.";
  } else {
    note.textContent = "Every U.S. state and Canadian province has its own outline; darker pink shows more shared visits.";
  }

  const usStates = [
    ["Alabama", "AL", 8, 5], ["Alaska", "AK", 1, 5], ["Arizona", "AZ", 2, 4], ["Arkansas", "AR", 6, 4], ["California", "CA", 1, 3], ["Colorado", "CO", 4, 3], ["Connecticut", "CT", 12, 3], ["Delaware", "DE", 11, 4], ["Florida", "FL", 11, 6], ["Georgia", "GA", 10, 5], ["Hawaii", "HI", 2, 5], ["Idaho", "ID", 2, 1], ["Illinois", "IL", 7, 2], ["Indiana", "IN", 8, 2], ["Iowa", "IA", 6, 2], ["Kansas", "KS", 5, 4], ["Kentucky", "KY", 8, 3], ["Louisiana", "LA", 6, 5], ["Maine", "ME", 13, 1], ["Maryland", "MD", 10, 4], ["Massachusetts", "MA", 11, 2], ["Michigan", "MI", 8, 1], ["Minnesota", "MN", 6, 1], ["Mississippi", "MS", 7, 5], ["Missouri", "MO", 6, 3], ["Montana", "MT", 4, 1], ["Nebraska", "NE", 5, 3], ["Nevada", "NV", 2, 2], ["New Hampshire", "NH", 12, 1], ["New Jersey", "NJ", 11, 3], ["New Mexico", "NM", 4, 4], ["New York", "NY", 10, 1], ["North Carolina", "NC", 9, 4], ["North Dakota", "ND", 5, 1], ["Ohio", "OH", 9, 2], ["Oklahoma", "OK", 5, 5], ["Oregon", "OR", 1, 2], ["Pennsylvania", "PA", 10, 2], ["Rhode Island", "RI", 13, 3], ["South Carolina", "SC", 9, 5], ["South Dakota", "SD", 5, 2], ["Tennessee", "TN", 8, 4], ["Texas", "TX", 5, 6], ["Utah", "UT", 3, 2], ["Vermont", "VT", 11, 1], ["Virginia", "VA", 10, 3], ["Washington", "WA", 1, 1], ["West Virginia", "WV", 9, 3], ["Wisconsin", "WI", 7, 1], ["Wyoming", "WY", 4, 2]
  ].map(([name, code, column, row]) => ({ name, code, column, row }));
  const canadaRegions = [
    { name: "Yukon", code: "YT", column: 1, row: 1 }, { name: "Northwest Territories", code: "NT", column: 3, row: 1 }, { name: "Nunavut", code: "NU", column: 8, row: 1 },
    { name: "British Columbia", code: "BC", column: 1, row: 2 }, { name: "Alberta", code: "AB", column: 2, row: 2 }, { name: "Saskatchewan", code: "SK", column: 3, row: 2 }, { name: "Manitoba", code: "MB", column: 4, row: 2 }, { name: "Ontario", code: "ON", column: 5, row: 2 }, { name: "Québec", code: "QC", column: 6, row: 2 }, { name: "Newfoundland and Labrador", code: "NL", column: 8, row: 2 },
    { name: "New Brunswick", code: "NB", column: 6, row: 3 }, { name: "Prince Edward Island", code: "PE", column: 7, row: 3 }, { name: "Nova Scotia", code: "NS", column: 8, row: 3 }
  ];
  const extraStates = {
    "east-coast-road-trip-2023": ["New Jersey", "Virginia", "West Virginia"],
    "austin-road-trip-2025": ["Louisiana", "Texas"],
    "wedding-road-trip-before": ["Utah", "Arizona"],
    "southwest-honeymoon-2026": ["Arizona", "New Mexico"]
  };
  const stateEvents = new Map(usStates.map((state) => [state.name, []]));
  const canadaEvents = new Map(canadaRegions.map((region) => [region.name, []]));
  (window.WEDDING_EVENTS || []).forEach((event) => {
    if (event.category === "todo" || !event.location) return;
    const eventText = `${event.location} ${event.title} ${event.story || ""}`;
    const visitedStates = new Set([...(event.states || []), ...(extraStates[event.id] || [])]);
    usStates.forEach(({ name }) => {
      const statePattern = name.replace(/ /g, "\\s+");
      const isWashingtonDc = name === "Washington" && /\bWashington,?\s+D\.?\s*C\.?/i.test(eventText);
      const isVirginiaInWestVirginia = name === "Virginia" && /\bWest\s+Virginia\b/i.test(eventText);
      if (!isWashingtonDc && !isVirginiaInWestVirginia && new RegExp(`\\b${statePattern}\\b`, "i").test(eventText)) visitedStates.add(name);
    });
    visitedStates.forEach((state) => stateEvents.get(state)?.push(event));
    canadaRegions.forEach((region) => {
      const pattern = region.name === "Québec" ? /\bQu[eé]bec\b/i : new RegExp(`\\b${region.name.replace(/ /g, "\\s+")}\\b`, "i");
      if (pattern.test(eventText)) canadaEvents.get(region.name).push(event);
    });
  });

  function fillRegionCard(card, regionName, events) {
    card.querySelector("h3").textContent = regionName;
    const eventList = card.querySelector(".region-card-events");
    eventList.replaceChildren();
    if (!events.length) {
      const empty = document.createElement("p");
      empty.className = "region-memory-description";
      empty.textContent = "No shared visits recorded here yet.";
      eventList.append(empty);
      return;
    }
    [...events].sort((a, b) => Number(isHighlight(b)) - Number(isHighlight(a))).forEach((event) => {
      const memory = document.createElement("article");
      memory.className = `region-memory${isHighlight(event) ? " is-highlight" : ""}`;
      const date = document.createElement("p");
      date.className = "region-memory-date";
      date.textContent = event.dateLabel || event.date || "Date not listed";
      const title = document.createElement("h4");
      title.className = "region-memory-title";
      title.textContent = event.title || "A shared memory";
      const description = document.createElement("p");
      description.className = "region-memory-description";
      const summary = (event.shortDescription || event.story || event.title || "A day together.").replace(/\s+/g, " ").trim();
      description.textContent = summary.length > 120 ? `${summary.slice(0, 117)}…` : summary;
      const city = document.createElement("p");
      city.className = "region-memory-city";
      const eventCities = {
        "east-coast-road-trip-2023": { "New Jersey": "Cape May, NJ", Virginia: "Williamsburg, VA", "West Virginia": "New River Gorge, WV" },
        "blue-blaze-2025": { "New Jersey": "Blue Blaze Trail, NJ", "New York": "Flushing, NY" },
        "austin-road-trip-2025": { Louisiana: "New Orleans & Vacherie, LA", Texas: "Houston & Austin, TX" },
        "dc-road-trip-2025": { Maryland: "College Park, MD" },
        "smokies-2025": { Tennessee: "Great Smoky Mountains, TN", "North Carolina": "Great Smoky Mountains, NC" },
        "wedding-road-trip-before": { Utah: "Zion & Bryce Canyon, UT", Arizona: "Antelope Canyon & Grand Canyon, AZ" },
        "southwest-honeymoon-2026": { Arizona: "Sedona & Saguaro, AZ", "New Mexico": "White Sands, NM" }
      };
      city.textContent = `City · ${eventCities[event.id]?.[regionName] || cityFor(event)}`;
      memory.append(date, title, description, city);
      eventList.append(memory);
    });
  }

  function isHighlight(event) {
    return event?.category === "highlight" || Boolean(event?.milestone);
  }

  function addRegionInteractions(container, card, events) {
    let cardHideTimer = null;
    let activeTile = null;
    const keepCard = () => window.clearTimeout(cardHideTimer);
    const hideCard = () => { card.hidden = true; activeTile = null; };
    const scheduleCardHide = () => {
      window.clearTimeout(cardHideTimer);
      cardHideTimer = window.setTimeout(() => {
        if (!container.matches(":hover") && !card.matches(":hover") && !container.contains(document.activeElement) && !card.contains(document.activeElement)) hideCard();
      }, 180);
    };
    const showCard = (tile) => {
      keepCard();
      activeTile = tile;
      fillRegionCard(card, tile.dataset.regionName, events.get(tile.dataset.regionName) || []);
      card.hidden = false;
    };
    container.addEventListener("pointerenter", (event) => { if (event.pointerType !== "touch") keepCard(); });
    container.addEventListener("pointerleave", (event) => { if (event.pointerType !== "touch") scheduleCardHide(); });
    container.addEventListener("focusout", (event) => {
      if (!container.contains(event.relatedTarget) && !card.contains(event.relatedTarget)) scheduleCardHide();
    });
    card.addEventListener("pointerenter", (event) => { if (event.pointerType !== "touch") keepCard(); });
    card.addEventListener("pointerleave", (event) => { if (event.pointerType !== "touch") scheduleCardHide(); });
    card.querySelector(".region-card-close")?.addEventListener("click", hideCard);
    document.addEventListener("pointerdown", (event) => {
      if (!card.hidden && !container.contains(event.target) && !card.contains(event.target)) hideCard();
    });
    container.querySelectorAll(".region-tile").forEach((tile) => {
      tile.addEventListener("pointerenter", (event) => { if (event.pointerType !== "touch") showCard(tile); });
      tile.addEventListener("focus", () => showCard(tile));
      tile.addEventListener("click", () => {
        if (activeTile === tile && !card.hidden) hideCard();
        else showCard(tile);
      });
    });
  }

  function renderRegionTiles(containerId, cardId, regions, eventMap, layoutClass) {
    const container = document.querySelector(`#${containerId}`);
    const layout = document.querySelector(`#${layoutClass}`);
    const card = document.querySelector(`#${cardId}`);
    if (!container || !layout || !card) return;
    const maxVisits = Math.max(1, ...[...eventMap.values()].map((events) => events.length));
    const visitedRegions = [...regions]
      .filter((region) => (eventMap.get(region.name) || []).length)
      .sort((a, b) => {
        const visitDifference = (eventMap.get(b.name) || []).length - (eventMap.get(a.name) || []).length;
        return visitDifference || a.row - b.row || a.column - b.column;
      });
    const sizingRow = document.createElement("div");
    sizingRow.className = "region-tile-row";
    sizingRow.style.width = "100%";
    const sizingTile = document.createElement("button");
    sizingTile.className = "region-tile";
    sizingRow.append(sizingTile);
    container.append(sizingRow);
    const rowStyle = getComputedStyle(sizingRow);
    const minimumTileWidth = sizingTile.getBoundingClientRect().width || 54;
    const horizontalInsets = (parseFloat(rowStyle.paddingLeft) || 0) + (parseFloat(rowStyle.paddingRight) || 0) + 2;
    const tileGap = parseFloat(rowStyle.columnGap) || 0;
    const availableWidth = Math.max(minimumTileWidth, sizingRow.clientWidth - horizontalInsets);
    sizingRow.remove();
    const maxPerRow = Math.max(2, Math.floor((availableWidth + tileGap) / (minimumTileWidth + tileGap)));
    const rowCount = Math.ceil(visitedRegions.length / maxPerRow);
    let regionIndex = 0;

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
      const row = document.createElement("div");
      row.className = "region-tile-row";
      const rowSize = Math.min(maxPerRow, visitedRegions.length - regionIndex);
      row.setAttribute("role", "group");
      row.setAttribute("aria-label", layoutClass === "us-map-layout" ? "Visited states" : "Visited provinces and territories");

      for (let tileIndex = 0; tileIndex < rowSize; tileIndex += 1) {
        const region = visitedRegions[regionIndex++];
        const visits = eventMap.get(region.name) || [];
        const tile = document.createElement("button");
        tile.type = "button";
        tile.className = "region-tile is-visited";
        tile.style.setProperty("--visit-shade", `${0.18 + (visits.length / maxVisits) * 0.65}`);
        tile.dataset.regionName = region.name;
        tile.setAttribute("aria-label", `${region.name}, ${visits.length} ${visits.length === 1 ? "event" : "events"}`);
        const abbreviation = document.createElement("span");
        abbreviation.textContent = region.code;
        tile.append(abbreviation);
        if (visits.length > 1) {
          const number = document.createElement("span");
          number.className = "region-tile-count";
          number.textContent = String(visits.length);
          tile.append(number);
        }
        row.append(tile);
      }
      container.append(row);
    }
    addRegionInteractions(container, card, eventMap);
  }

  renderRegionTiles("us-state-map", "us-state-card", usStates, stateEvents, "us-map-layout");
  renderRegionTiles("canada-province-map", "canada-province-card", canadaRegions, canadaEvents, "canada-map-layout");

  function project(longitude, latitude) {
    return [
      (((longitude - centerLon + 180 + 360) % 360) / 360) * width,
      ((maxLat - latitude) / (maxLat - minLat)) * height
    ];
  }

  function hideCard() {
    window.clearTimeout(hideTimer);
    hideTimer = null;
    card.hidden = true;
    activeMapPoint = null;
  }

  function scheduleHideCard() {
    window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(() => {
      if (!stage.contains(document.activeElement) && !card.matches(":hover")) hideCard();
    }, 180);
  }

  function positionCard(x, y, targetCard = card) {
    const point = svg.createSVGPoint();
    point.x = x;
    point.y = y;
    const screenPoint = point.matrixTransform(svg.getScreenCTM());
    const stageBounds = stage.getBoundingClientRect();

    targetCard.hidden = false;
    targetCard.style.visibility = "hidden";
    const cardBounds = targetCard.getBoundingClientRect();
    let left = screenPoint.x - stageBounds.left + 18;
    let top = screenPoint.y - stageBounds.top - cardBounds.height / 2;
    if (left + cardBounds.width > stageBounds.width - 12) left = screenPoint.x - stageBounds.left - cardBounds.width - 18;
    if (left < 12) left = 12;
    if (left + cardBounds.width > stageBounds.width - 12) left = stageBounds.width - cardBounds.width - 12;
    if (top < 12) top = 12;
    if (top + cardBounds.height > stageBounds.height - 12) top = stageBounds.height - cardBounds.height - 12;
    targetCard.style.left = `${left}px`;
    targetCard.style.top = `${top}px`;
    targetCard.style.visibility = "visible";
  }

  function hideStateCard() {
    window.clearTimeout(stateHideTimer);
    stateHideTimer = null;
    stateCard.hidden = true;
    activeStatePoint = null;
    if (activeStateRegion) activeStateRegion.classList.remove("is-active");
    activeStateRegion = null;
  }

  function showStateCard(state, marker, mapPoint) {
    window.clearTimeout(stateHideTimer);
    hideCard();
    if (activeStateRegion) activeStateRegion.classList.remove("is-active");
    activeStateRegion = marker;
    marker.classList.add("is-active");
    activeStatePoint = mapPoint;
    fillRegionCard(stateCard, state.name, stateEvents.get(state.name) || []);
    marker.setAttribute("aria-describedby", "map-state-card");
    positionCard(...mapPoint, stateCard);
  }

  function scheduleStateCardHide() {
    window.clearTimeout(stateHideTimer);
    stateHideTimer = window.setTimeout(() => {
      if (!stage.contains(document.activeElement) && !stateCard.matches(":hover")) hideStateCard();
    }, 180);
  }

  function showCard(events, marker, cityName, mapPoint) {
    hideStateCard();
    const event = events[0];
    activeMapPoint = mapPoint;
    dateText.textContent = events.length > 1 ? `${events.length} shared memories` : (event.dateLabel || event.date);
    placeTitle.textContent = events.length > 1 ? cityName : event.location;
    storyText.textContent = events.length > 1 ? "A collection of days we shared here." : (event.category === "travel" ? event.title : (event.shortDescription || event.story || "A day we shared."));
    cardEvents.replaceChildren();
    cardEvents.hidden = events.length < 2;
    detailLink.hidden = events.length > 1;
    if (events.length === 1) detailLink.href = `wedding-event.html?id=${encodeURIComponent(event.id)}`;
    else events.forEach((memory) => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.className = "map-card-event-link";
      link.href = `wedding-event.html?id=${encodeURIComponent(memory.id)}`;
      link.textContent = `${memory.dateLabel || memory.date} · ${memory.title}`;
      item.append(link);
      cardEvents.append(item);
    });
    marker.setAttribute("aria-describedby", "map-card");
    positionCard(...mapPoint);
  }

  function svgNode(tag, className, attributes = {}) {
    const node = document.createElementNS("http://www.w3.org/2000/svg", tag);
    if (className) node.setAttribute("class", className);
    Object.entries(attributes).forEach(([name, value]) => node.setAttribute(name, String(value)));
    return node;
  }

  (window.NORTH_AMERICA_GEOMETRY || []).forEach(({ name, d }) => {
    const country = svgNode("path", "map-country-shape", { d });
    const title = svgNode("title");
    title.textContent = name;
    country.append(title);
    countryLayer.append(country);
  });

  function cityFor(event) {
    if (event.mapCity) return event.mapCity;
    const location = event.location || "";
    if (/\bStony Brook\b/i.test(location)) return "Stony Brook, NY";
    if (/\bGreat Neck\b/i.test(location)) return "Great Neck, NY";
    if (/\bRonkonkoma\b/i.test(location)) return "Ronkonkoma, NY";
    if (/\bShirley\b/i.test(location)) return "Shirley, NY";
    if (/\bElmont\b/i.test(location)) return "Elmont, NY";
    if (/\bNew York|\bFlushing\b|\bQueens\b|\bBrooklyn\b|\bManhattan\b/i.test(location)) return "New York City, NY";
    if (/\bAustin\b/i.test(location)) return "Austin, TX";
    if (/\bLas Vegas\b/i.test(location)) return "Las Vegas, NV";
    if (/\bSan Diego\b/i.test(location)) return "San Diego, CA";
    if (/\bQu[eé]bec(?: City)?\b/i.test(location)) return "Québec City, QC";
    return event.location || "City not listed";
  }

  count.textContent = `${places.length} shared places`;

  const stateCapitals = {
    Alabama: [-86.30, 32.37], Alaska: [-134.42, 58.30], Arizona: [-112.07, 33.45], Arkansas: [-92.29, 34.75], California: [-121.49, 38.58], Colorado: [-104.99, 39.74], Connecticut: [-72.68, 41.76], Delaware: [-75.52, 39.16], Florida: [-84.28, 30.44], Georgia: [-84.39, 33.75], Hawaii: [-157.86, 21.31], Idaho: [-116.20, 43.62], Illinois: [-89.65, 39.78], Indiana: [-86.16, 39.77], Iowa: [-93.62, 41.59], Kansas: [-95.69, 39.05], Kentucky: [-84.87, 38.20], Louisiana: [-91.14, 30.45], Maine: [-69.78, 44.31], Maryland: [-76.49, 38.98], Massachusetts: [-71.06, 42.36], Michigan: [-84.55, 42.73], Minnesota: [-93.09, 44.95], Mississippi: [-90.18, 32.30], Missouri: [-92.17, 38.57], Montana: [-112.03, 46.59], Nebraska: [-96.68, 40.81], Nevada: [-116.20, 39.16], "New Hampshire": [-71.54, 43.20], "New Jersey": [-74.77, 40.22], "New Mexico": [-105.94, 35.69], "New York": [-73.76, 42.65], "North Carolina": [-78.64, 35.78], "North Dakota": [-100.78, 46.81], Ohio: [-82.99, 39.96], Oklahoma: [-97.52, 35.47], Oregon: [-123.04, 44.94], Pennsylvania: [-76.88, 40.27], "Rhode Island": [-71.41, 41.82], "South Carolina": [-81.03, 34.00], "South Dakota": [-100.35, 44.37], Tennessee: [-86.78, 36.16], Texas: [-97.74, 30.27], Utah: [-111.89, 40.76], Vermont: [-72.58, 44.26], Virginia: [-77.44, 37.54], Washington: [-122.90, 47.04], "West Virginia": [-81.63, 38.35], Wisconsin: [-89.40, 43.07], Wyoming: [-104.82, 41.14]
  };

  const canadaCapitals = {
    "British Columbia": [-123.37, 48.43], Alberta: [-113.49, 53.55], Saskatchewan: [-104.61, 50.45], Manitoba: [-97.14, 49.90], Ontario: [-79.38, 43.65], "Québec": [-71.21, 46.81],
    "New Brunswick": [-66.64, 45.96], "Prince Edward Island": [-63.13, 46.24], "Nova Scotia": [-63.58, 44.65], "Newfoundland and Labrador": [-52.71, 47.56], Yukon: [-135.05, 60.72], "Northwest Territories": [-114.37, 62.45], Nunavut: [-68.52, 63.75]
  };
  function addInteractiveRegion(regionInfo, events, pathData, point, maxVisits) {
    if (!pathData) return;
    const region = svgNode("g", `map-state-region${events.length ? " is-visited" : ""}`, {
      tabindex: "0",
      role: "button",
      "aria-label": `${regionInfo.name}, ${events.length} recorded ${events.length === 1 ? "visit" : "visits"}`
    });
    const area = svgNode("path", "map-state-area", { d: pathData });
    const fill = events.length ? `rgba(207, 116, 134, ${0.28 + (events.length / maxVisits) * 0.5})` : "#fffdf9";
    area.style.setProperty("--state-fill", fill);
    region.append(area);
    const title = svgNode("title");
    title.textContent = `${regionInfo.name} · ${events.length} recorded ${events.length === 1 ? "visit" : "visits"}`;
    region.append(title);
    const mapPoint = project(point[0], point[1]);
    region.addEventListener("pointerenter", (event) => {
      if (event.pointerType !== "touch") showStateCard(regionInfo, region, mapPoint);
      else window.clearTimeout(stateHideTimer);
    });
    region.addEventListener("pointerleave", (event) => { if (event.pointerType !== "touch") scheduleStateCardHide(); });
    region.addEventListener("focus", () => showStateCard(regionInfo, region, mapPoint));
    region.addEventListener("click", () => showStateCard(regionInfo, region, mapPoint));
    region.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); showStateCard(regionInfo, region, mapPoint); }
      else if (event.key === "Escape") hideStateCard();
    });
    stateLayer.append(region);
  }

  const maxStateVisits = Math.max(1, ...[...stateEvents.values()].map((events) => events.length));
  usStates.forEach((state) => addInteractiveRegion(
    state,
    stateEvents.get(state.name) || [],
    window.US_STATE_GEOMETRY?.[state.name],
    stateCapitals[state.name],
    maxStateVisits
  ));
  const maxCanadaVisits = Math.max(1, ...[...canadaEvents.values()].map((events) => events.length));
  canadaRegions.forEach((province) => addInteractiveRegion(
    province,
    canadaEvents.get(province.name) || [],
    window.CANADA_PROVINCE_GEOMETRY?.[province.name === "Québec" ? "Québec" : province.name],
    canadaCapitals[province.name],
    maxCanadaVisits
  ));


  card.addEventListener("pointerenter", () => window.clearTimeout(hideTimer));
  card.addEventListener("pointerleave", scheduleHideCard);
  stateCard.querySelector(".region-card-close")?.addEventListener("click", hideStateCard);
  stateCard.addEventListener("pointerenter", () => window.clearTimeout(stateHideTimer));
  stateCard.addEventListener("pointerleave", scheduleStateCardHide);
  stage.addEventListener("pointerleave", () => {
    if (!stage.contains(document.activeElement)) { hideCard(); hideStateCard(); }
  });
  stage.addEventListener("focusout", (focusEvent) => {
    if (!stage.contains(focusEvent.relatedTarget)) { hideCard(); hideStateCard(); }
  });
  window.addEventListener("resize", () => {
    if (activeMapPoint) positionCard(...activeMapPoint);
    if (activeStatePoint) positionCard(...activeStatePoint, stateCard);
  });
})();
