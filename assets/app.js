(function () {
  const $ = (s) => document.querySelector(s);

  /* =========================
     REPORTS
     ========================= */
  const reports = [
    {
      id: "prix",
      title: "Suivi des prix — Marchés de Brazzaville",
      tool: "Power BI",
      desc: "Évolution hebdomadaire des prix du panier de base avec alertes automatiques sur les hausses significatives.",
      refresh: "Temps réel",
      export: "PDF, Excel, PNG",
      locked: false,
      embed: "",
      fullscreen: "#",
    },
    {
      id: "emploi",
      title: "Tableau de bord Emploi & Jeunesse",
      tool: "Looker Studio",
      desc: "Indicateurs d'emploi des 18–35 ans : taux d'emploi, chômage, secteurs, revenus.",
      refresh: "Hebdomadaire",
      export: "PDF, CSV",
      locked: false,
      embed: "",
      fullscreen: "#",
    },
    {
      id: "acces",
      title: "Cartographie — Accès aux services",
      tool: "Tableau",
      desc: "Cartographie de l'accès à l'eau, l'électricité et la santé par localité.",
      refresh: "Mensuel",
      export: "PNG, PDF",
      locked: true,
      embed: "",
      fullscreen: "#",
    },
    {
      id: "agri",
      title: "Performance agricole par département",
      tool: "Metabase",
      desc: "Suivi des rendements, surfaces et tendances par département.",
      refresh: "Trimestriel",
      export: "CSV, PNG",
      locked: true,
      embed: "",
      fullscreen: "#",
    },
  ];

  function renderReports() {
    const list = $("#reportList");
    if (!list) return;

    const title = $("#reportTitle"),
      desc = $("#reportDesc"),
      iframe = $("#reportIframe"),
      ph = $("#reportPlaceholder");
    const open = $("#openFullscreen"),
      kTool = $("#kpiTool"),
      kRef = $("#kpiRefresh"),
      kExp = $("#kpiExport");

    function setActive(r) {
      if (title) title.textContent = r.title;
      if (desc) desc.textContent = r.desc;
      if (kTool) kTool.textContent = r.tool;
      if (kRef) kRef.textContent = r.refresh;
      if (kExp) kExp.textContent = r.export;

      if (open) {
        open.href = r.fullscreen || "#";
        open.style.opacity = r.fullscreen && r.fullscreen !== "#" ? "1" : ".7";
      }

      if (iframe && ph) {
        if (r.embed && !r.locked) {
          iframe.src = r.embed;
          iframe.style.display = "block";
          ph.style.display = "none";
        } else {
          iframe.src = "about:blank";
          iframe.style.display = "none";
          ph.style.display = "block";
          const badge = ph.querySelector("span");
          if (badge) badge.textContent = r.tool;
        }
      }
    }

    list.innerHTML = "";
    reports.forEach((r, i) => {
      const el = document.createElement("div");
      el.className = "reportItem" + (i === 0 ? " active" : "");

      // ✅ cadenas : pas de width/height inline -> ton CSS gère la taille
      const lockSvg = r.locked
        ? `<svg class="lockIcon" viewBox="0 0 24 24" aria-hidden="true">
             <path fill="currentColor" d="M17 9h-1V7a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2zm-7-2a2 2 0 0 1 4 0v2h-4V7z"/>
           </svg>`
        : "";

      el.innerHTML = `
        <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;">
          <div>
            <h4 style="margin:0;font-family:'Playfair Display',Georgia,serif;color:var(--ink);font-size:16px;">
              ${r.title}
            </h4>
            <small style="display:inline-flex;margin-top:8px;font-weight:900;color:#0f172a;background:#f1f5f9;border:1px solid rgba(15,23,42,.08);padding:6px 10px;border-radius:999px;">
              ${r.tool}
            </small>
          </div>
          <div style="color:rgba(15,23,42,.55);display:flex;align-items:center;">
            ${lockSvg}
          </div>
        </div>
      `;

      el.addEventListener("click", () => {
        document.querySelectorAll(".reportItem").forEach((x) => x.classList.remove("active"));
        el.classList.add("active");
        setActive(r);
      });

      list.appendChild(el);
    });

    setActive(reports[0]);
  }

  /* =========================
     DATASETS + MODAL DETAILS
     ========================= */

  // 👉 ajoute ici toutes les infos nécessaires pour la modal (comme ton image 2)
  const datasets = [
    {
      id: "prix-panier",
      title: "Prix du marché — Panier de base",
      desc:
        "Suivi hebdomadaire des prix des produits essentiels (alimentaires, hygiène) sur les principaux marchés de Brazzaville. Inclut prix moyen, min, max et évolution.",
      tags: ["Prix", "Consommation", "Marché"],
      freq: "Hebdomadaire",
      zone: "Brazzaville",
      formats: ["CSV", "Excel"],
      version: "v3.2 — Décembre 2024",
      method:
        "Enquêteurs formés réalisant des relevés sur 3 points de vente par marché, avec validation croisée et contrôle qualité GPS.",
      sampleDict: [
        { var: "product_id", type: "string", desc: "Identifiant unique du produit" },
        { var: "price_avg", type: "float", desc: "Prix moyen en FCFA" },
        { var: "market_name", type: "string", desc: "Nom du marché" },
        { var: "date_collected", type: "date", desc: "Date du relevé" },
      ],
      license:
        "Usage non-commercial autorisé avec attribution. Pour un usage commercial, veuillez nous contacter pour obtenir une licence adaptée.",
      download: "assets/downloads/prix-marche-panier-base.csv",
    },
    {
      id: "emploi-jeunesse",
      title: "Emploi & Jeunesse urbaine",
      desc:
        "Enquête annuelle sur la situation de l'emploi des jeunes de 18-35 ans en zone urbaine. Taux d'emploi, secteurs d'activité, revenus.",
      tags: ["Emploi", "Jeunesse", "Social"],
      freq: "Annuel",
      zone: "Congo (zones urbaines)",
      formats: ["CSV", "Excel", "SPSS"],
      version: "v1.0 — Janvier 2025",
      method:
        "Questionnaire standardisé, collecte digitale, contrôles de cohérence automatiques et supervision terrain.",
      sampleDict: [
        { var: "respondent_id", type: "string", desc: "Identifiant du répondant" },
        { var: "employment_status", type: "string", desc: "Statut d'emploi" },
        { var: "monthly_income", type: "float", desc: "Revenu mensuel" },
      ],
      license:
        "Usage non-commercial autorisé avec attribution. Pour un usage commercial, veuillez nous contacter pour obtenir une licence adaptée.",
      download: "assets/downloads/emploi-jeunesse-urbaine.csv",
    },
    {
      id: "acces-services",
      title: "Accès aux services essentiels",
      desc:
        "Cartographie de l'accès à l'eau potable, l'électricité et les services de santé par localité et par niveau socio-économique.",
      tags: ["Eau", "Santé", "Infrastructure"],
      freq: "Annuel",
      zone: "Congo (national)",
      formats: ["CSV", "GeoJSON"],
      version: "v2.1 — Juin 2025",
      method:
        "Collecte multi-sources (administrations, terrain), normalisation géographique et validation croisée.",
      sampleDict: [
        { var: "locality_id", type: "string", desc: "Identifiant localité" },
        { var: "water_access", type: "float", desc: "Taux d'accès à l'eau" },
        { var: "health_access", type: "float", desc: "Indice d'accès santé" },
      ],
      license:
        "Usage non-commercial autorisé avec attribution. Pour un usage commercial, veuillez nous contacter pour obtenir une licence adaptée.",
      download: "assets/downloads/acces-services-essentiels.csv",
    },
    {
      id: "agri",
      title: "Indicateurs agricoles — Cultures vivrières",
      desc:
        "Production, rendements et surfaces cultivées pour les principales cultures vivrières par département.",
      tags: ["Agriculture", "Production", "Rural"],
      freq: "Saisonnier",
      zone: "Congo (rural)",
      formats: ["CSV", "Excel"],
      version: "v1.3 — Août 2025",
      method:
        "Enquêtes auprès des exploitants + consolidation des rapports départementaux. Contrôles sur outliers.",
      sampleDict: [
        { var: "dept", type: "string", desc: "Département" },
        { var: "crop", type: "string", desc: "Culture" },
        { var: "yield", type: "float", desc: "Rendement" },
      ],
      license:
        "Usage non-commercial autorisé avec attribution. Pour un usage commercial, veuillez nous contacter pour obtenir une licence adaptée.",
      download: "assets/downloads/prix-marche-panier-base.csv",
    },
    {
      id: "mobilite",
      title: "Mobilité urbaine — Transports en commun",
      desc:
        "Flux de passagers, temps de trajet et coûts sur les principales lignes de transport collectif à Brazzaville.",
      tags: ["Transport", "Urbanisme", "Mobilité"],
      freq: "Trimestriel",
      zone: "Brazzaville",
      formats: ["CSV", "GeoJSON"],
      version: "v0.9 — Mars 2025",
      method:
        "Comptages manuels + GPS, consolidation des itinéraires, nettoyage des doublons.",
      sampleDict: [
        { var: "line_id", type: "string", desc: "Identifiant ligne" },
        { var: "passengers", type: "int", desc: "Nombre de passagers" },
      ],
      license:
        "Usage non-commercial autorisé avec attribution. Pour un usage commercial, veuillez nous contacter pour obtenir une licence adaptée.",
      download: "assets/downloads/emploi-jeunesse-urbaine.csv",
    },
    {
      id: "menages",
      title: "Enquête ménages — Budget et consommation",
      desc:
        "Structure des dépenses des ménages par catégorie, niveau de revenu et zone géographique.",
      tags: ["Ménages", "Consommation", "Revenus"],
      freq: "Annuel",
      zone: "Congo (national)",
      formats: ["CSV", "Excel", "SPSS"],
      version: "v2.0 — Novembre 2024",
      method:
        "Questionnaire ménages, collecte digitale, double validation et anonymisation.",
      sampleDict: [
        { var: "household_id", type: "string", desc: "Identifiant ménage" },
        { var: "expense_food", type: "float", desc: "Dépenses alimentation" },
      ],
      license:
        "Usage non-commercial autorisé avec attribution. Pour un usage commercial, veuillez nous contacter pour obtenir une licence adaptée.",
      download: "assets/downloads/acces-services-essentiels.csv",
    },
  ];

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, (m) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    }[m]));
  }

  function ensureModalRoot() {
    if ($("#datasetModalOverlay")) return;

    const overlay = document.createElement("div");
    overlay.id = "datasetModalOverlay";
    overlay.style.cssText = `
      position:fixed; inset:0; z-index:9999;
      background: rgba(2,6,23,.55);
      display:none;
      padding: 22px;
      overflow:auto;
    `;

    overlay.innerHTML = `
      <div id="datasetModal" style="
        width:min(860px, 96vw);
        margin: 26px auto;
        background:#fff;
        border-radius: 18px;
        border:1px solid rgba(15,23,42,.10);
        box-shadow: 0 24px 70px rgba(0,0,0,.25);
        overflow:hidden;
      ">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:14px;padding:18px 18px 0;">
          <div style="display:flex;gap:10px;flex-wrap:wrap" id="modalTags"></div>
          <button id="datasetModalClose" aria-label="Fermer" style="
            border:none;background:transparent;cursor:pointer;
            font-size:22px;line-height:1;color:#0f172a;
            padding:6px 10px;border-radius:10px;
          ">×</button>
        </div>

        <div style="padding: 10px 18px 18px;">
          <h2 id="modalTitle" style="margin:6px 0 6px;font-size:28px;"></h2>

          <h3 style="margin-top:14px;font-size:18px;">Description</h3>
          <p class="muted" id="modalDesc"></p>

          <h3 style="margin-top:18px;font-size:18px;">Méthodologie de collecte</h3>
          <p class="muted" id="modalMethod"></p>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px;">
            <div style="background:#f8fafc;border:1px solid rgba(15,23,42,.06);border-radius:14px;padding:14px;">
              <div class="muted" style="font-size:13px;">Couverture</div>
              <div style="font-weight:800;margin-top:6px;" id="modalZone"></div>
            </div>
            <div style="background:#f8fafc;border:1px solid rgba(15,23,42,.06);border-radius:14px;padding:14px;">
              <div class="muted" style="font-size:13px;">Fréquence</div>
              <div style="font-weight:800;margin-top:6px;" id="modalFreq"></div>
            </div>
            <div style="background:#f8fafc;border:1px solid rgba(15,23,42,.06);border-radius:14px;padding:14px;">
              <div class="muted" style="font-size:13px;">Formats</div>
              <div style="font-weight:800;margin-top:6px;" id="modalFormats"></div>
            </div>
            <div style="background:#f8fafc;border:1px solid rgba(15,23,42,.06);border-radius:14px;padding:14px;">
              <div class="muted" style="font-size:13px;">Version</div>
              <div style="font-weight:800;margin-top:6px;" id="modalVersion"></div>
            </div>
          </div>

          <h3 style="margin-top:22px;font-size:18px;">Dictionnaire de variables (extrait)</h3>
          <div style="overflow:auto;border:1px solid rgba(15,23,42,.08);border-radius:14px;">
            <table style="width:100%;border-collapse:collapse;">
              <thead style="background:#f8fafc;">
                <tr>
                  <th style="text-align:left;padding:12px 14px;border-bottom:1px solid rgba(15,23,42,.08);">Variable</th>
                  <th style="text-align:left;padding:12px 14px;border-bottom:1px solid rgba(15,23,42,.08);">Type</th>
                  <th style="text-align:left;padding:12px 14px;border-bottom:1px solid rgba(15,23,42,.08);">Description</th>
                </tr>
              </thead>
              <tbody id="modalDict"></tbody>
            </table>
          </div>

          <div style="margin-top:18px;background:#f1f5f9;border:1px solid rgba(15,23,42,.08);border-radius:14px;padding:16px;">
            <h3 style="margin:0 0 6px;font-size:18px;">Licence d'utilisation</h3>
            <p class="muted" style="margin:0;" id="modalLicense"></p>
          </div>

          <div style="margin-top:18px;">
            <a id="modalDownload" class="btn primary" style="width:100%;justify-content:center;border-radius:14px;padding:14px 16px;" download>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 20h14v-2H5v2zm7-18l-5 5h3v6h4V7h3l-5-5z"/></svg>
              Télécharger le dataset
            </a>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Close handlers
    const closeBtn = $("#datasetModalClose");
    closeBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }

  function openModal(d) {
    ensureModalRoot();

    $("#modalTags").innerHTML = d.tags.map(t => `<span class="tag">${escapeHTML(t)}</span>`).join("");
    $("#modalTitle").textContent = d.title;
    $("#modalDesc").textContent = d.desc;
    $("#modalMethod").textContent = d.method || "—";
    $("#modalZone").textContent = d.zone || "—";
    $("#modalFreq").textContent = d.freq || "—";
    $("#modalFormats").textContent = (d.formats || []).join(", ") || "—";
    $("#modalVersion").textContent = d.version || "—";
    $("#modalLicense").textContent = d.license || "—";

    const dictBody = $("#modalDict");
    dictBody.innerHTML = (d.sampleDict || [])
      .map(row => `
        <tr>
          <td style="padding:12px 14px;border-bottom:1px solid rgba(15,23,42,.06);font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace;font-size:13px;">
            ${escapeHTML(row.var)}
          </td>
          <td style="padding:12px 14px;border-bottom:1px solid rgba(15,23,42,.06);color:var(--muted);">
            ${escapeHTML(row.type)}
          </td>
          <td style="padding:12px 14px;border-bottom:1px solid rgba(15,23,42,.06);color:var(--muted);">
            ${escapeHTML(row.desc)}
          </td>
        </tr>
      `)
      .join("");

    const dl = $("#modalDownload");
    dl.href = d.download || "#";

    $("#datasetModalOverlay").style.display = "block";
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    const overlay = $("#datasetModalOverlay");
    if (!overlay) return;
    overlay.style.display = "none";
    document.body.style.overflow = "";
  }

  function renderDatasets() {
    const grid = $("#dataGrid"),
      search = $("#dataSearch"),
      theme = $("#themeFilter"),
      fmt = $("#formatFilter"),
      line = $("#resultsLine");

    if (!grid || !search || !theme || !fmt || !line) return;

    function ok(d) {
      const q = (search.value || "").trim().toLowerCase();
      const tf = theme.value || "Tous";
      const ff = fmt.value || "Tous";
      const hay = (d.title + " " + d.desc + " " + d.tags.join(" ")).toLowerCase();
      return (
        (!q || hay.includes(q)) &&
        (tf === "Tous" || d.tags.includes(tf)) &&
        (ff === "Tous" || d.formats.includes(ff))
      );
    }

    const ICON_CAL = `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 2h2v2h6V2h2v2h3v18H4V4h3V2zm13 6H6v12h14V8z"/></svg>`;
    const ICON_PIN = `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>`;
    const ICON_FILE = `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm1 7V3.5L19.5 9H15z"/></svg>`;
    const ICON_DL = `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 20h14v-2H5v2zm7-18l-5 5h3v6h4V7h3l-5-5z"/></svg>`;
    const ICON_EYE = `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/></svg>`;

    function render() {
      const filtered = datasets.filter(ok);
      line.textContent = `${filtered.length} datasets trouvés`;
      grid.innerHTML = "";

      filtered.forEach((d) => {
        const card = document.createElement("article");
        card.className = "card";

        card.innerHTML = `
          <div class="tags">${d.tags.map((t) => `<span class="tag">${escapeHTML(t)}</span>`).join("")}</div>
          <h3 style="margin-top:10px;">${escapeHTML(d.title)}</h3>
          <p class="muted">${escapeHTML(d.desc)}</p>

          <div class="metaRow" style="margin-top:10px;">
            <span>${ICON_CAL} ${escapeHTML(d.freq)}</span>
            <span>${ICON_PIN} ${escapeHTML(d.zone)}</span>
          </div>

          <div class="metaRow" style="margin-top:8px;">
            <span>${ICON_FILE} ${escapeHTML(d.formats.join(", "))}</span>
          </div>

          <div style="display:flex;gap:12px;margin-top:14px;">
            <button class="btn sm" type="button" data-details="${escapeHTML(d.id)}">
              ${ICON_EYE} Détails
            </button>
            <a class="btn sm primary" href="${escapeHTML(d.download)}" download>
              ${ICON_DL} Télécharger
            </a>
          </div>
        `;

        grid.appendChild(card);
      });

      grid.querySelectorAll("[data-details]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const d = datasets.find((x) => x.id === btn.getAttribute("data-details"));
          if (!d) return;
          openModal(d);
        });
      });
    }

    ["input", "change"].forEach((e) => {
      search.addEventListener(e, render);
      theme.addEventListener(e, render);
      fmt.addEventListener(e, render);
    });

    render();
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderReports();
    renderDatasets();
  });
})();
