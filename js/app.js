const form = document.querySelector("#business-form");

const preview = document.querySelector("#site-preview");
const previewTitle = document.querySelector("#preview-title");
const exportButton = document.querySelector("#export-site");
const fullscreenButton = document.querySelector("#fullscreen-site");

const saveProjectButton =
  document.querySelector("#export-project");

const importProjectButton =
  document.querySelector("#import-project");

const importProjectInput =
  document.querySelector("#import-project-file");
const demoButton = document.querySelector("#load-demo");
const parallaxToggle = document.querySelector("#enable-parallax");
const revealToggle = document.querySelector("#enable-reveal");

let selectedRevealStyle = "fade-up";
let selectedRevealSpeed = "normal";
let generatedRevealObserver = null;

const previewButtons = document.querySelectorAll("[data-preview]");
const paletteButtons = document.querySelectorAll("[data-palette]");

const logoInput = document.querySelector("#business-logo");
const heroImageInput = document.querySelector("#hero-image");
const galleryInput = document.querySelector("#gallery-images");

const logoPreview = document.querySelector("#logo-preview");
const heroImagePreview = document.querySelector("#hero-image-preview");
const galleryPreview = document.querySelector("#gallery-preview");

const heroStyleButtons =
  document.querySelectorAll("[data-hero-style]");

let logoDataURL = "";
let heroImageDataURL = "";
let galleryDataURLs = [];
let selectedHeroStyle = "split";

let customSectionCounter = 0;
let currentGeneratedPhoneLink = "";
let generatedParallaxHandler = null;


let siteSections = [
  {
    id: "hero",
    label: "Hero",
    enabled: true,
    background: "default",
    backgroundImage: ""
  },
  {
    id: "services",
    label: "Services",
    enabled: true,
    background: "default",
    backgroundImage: ""
  },
  {
    id: "about",
    label: "About",
    enabled: true,
    background: "default",
    backgroundImage: ""
  },
  {
    id: "testimonials",
    label: "Testimonials",
    enabled: true,
    background: "default",
    backgroundImage: ""
  },
  {
    id: "gallery",
    label: "Gallery",
    enabled: true,
    background: "default",
    backgroundImage: ""
  },
  {
    id: "faq",
    label: "FAQ",
    enabled: true,
    background: "default",
    backgroundImage: ""
  },
  {
    id: "contact",
    label: "Contact",
    enabled: true,
    background: "default",
    backgroundImage: ""
  },
  {
    id: "cta",
    label: "Final CTA",
    enabled: true,
    background: "default",
    backgroundImage: ""
  },
  {
    id: "footer",
    label: "Footer",
    enabled: true,
    background: "default",
    backgroundImage: ""
  }
];


/* -------------------------------------------------
   SECTION NAVIGATION
-------------------------------------------------- */

const defaultNavSections =
  new Set(["services", "about", "contact"]);


siteSections.forEach(section => {

  section.showInNav =
    defaultNavSections.has(section.id);

  section.navLabel =
    section.label;

});


/* -------------------------------------------------
   SITE / PAGE PROJECT
-------------------------------------------------- */

let pageCounter = 1;
let activePageId = "home";


const siteProject = {

  globals: {
    /*
      Business identity, logo, palette, contact
      details, header and footer presentation remain
      site-wide.

      Existing builder controls continue to own
      those values for now.
    */
  },

  pages: [
    {
      id: "home",
      title: "Home",
      slug: "index",
      navLabel: "Home",
      showInNav: true,
      locked: true,
      sections: siteSections
    }
  ]

};


function getActivePage() {

  return siteProject.pages.find(
    page => page.id === activePageId
  ) || siteProject.pages[0];

}


function createCorePageSection(
  id,
  label,
  enabled = true,
  showInNav = false,
  navLabel = label
) {

  return {
    id,
    label,
    enabled,
    background: "default",
    backgroundImage: "",
    showInNav,
    navLabel
  };

}


function createStarterCustomSection(
  type,
  label,
  content,
  showInNav = false,
  navLabel = label
) {

  customSectionCounter += 1;

  return {
    id:
      `custom-${type}-${customSectionCounter}`,

    type,
    custom: true,

    label,
    enabled: true,

    showInNav,
    navLabel,

    background: "default",
    backgroundImage: "",

    content: {
      ...content
    }
  };

}


function createPageSections(
  pageType = "blank"
) {

  const hero =
    createCorePageSection(
      "hero",
      "Hero",
      true,
      false,
      "Hero"
    );

  const footer =
    createCorePageSection(
      "footer",
      "Footer",
      true,
      false,
      "Footer"
    );


  if (pageType === "about") {

    return [
      hero,

      createCorePageSection(
        "about",
        "About",
        true,
        false,
        "About"
      ),

      createStarterCustomSection(
        "team",
        "Team",
        {
          title: "Meet the Team",
          intro:
            "Get to know the people behind the business.",
          items:
            "Alex Morgan | Founder | Leads the business and client relationships.\nJordan Lee | Team Member | Helps customers and keeps projects moving."
        },
        true,
        "Team"
      ),

      createStarterCustomSection(
        "trust",
        "Trust Strip",
        {
          title:
            "Experience You Can Count On",
          items:
            "Professional Service\nClear Communication\nLocal Experience\nDependable Support"
        }
      ),

      footer
    ];

  }


  if (pageType === "services") {

    return [
      hero,

      createCorePageSection(
        "services",
        "Services",
        true,
        false,
        "Services"
      ),

      createStarterCustomSection(
        "process",
        "Process",
        {
          title: "How We Work",
          intro:
            "A straightforward process from first conversation to finished work.",
          items:
            "Discovery | We learn what you need.\nPlan | We build the right approach.\nExecution | We get the work done.\nFollow Through | We make sure everything is handled."
        },
        true,
        "Process"
      ),

      createCorePageSection(
        "cta",
        "Final CTA",
        true,
        false,
        "Final CTA"
      ),

      footer
    ];

  }


  if (pageType === "collection") {

    return [
      hero,

      createStarterCustomSection(
        "collections",
        "Collections",
        {
          title: "Shop by Collection",
          intro:
            "Explore products organized around what you need.",
          items:
            "New Arrivals | The latest products added to the shop.\nBest Sellers | Customer favorites and proven picks.\nEssentials | Everyday products worth keeping close."
        },
        true,
        "Collections"
      ),

      createStarterCustomSection(
        "products",
        "Featured Products",
        {
          title: "Featured Products",
          intro:
            "A few customer favorites worth checking out.",
          items:
            "Signature Product | A featured customer favorite. | $49 |\nEveryday Favorite | A popular everyday option. | $29 |\nPremium Pick | A higher-end standout product. | $79 |"
        },
        true,
        "Products"
      ),

      footer
    ];

  }


  if (pageType === "gallery") {

    return [
      hero,

      createCorePageSection(
        "gallery",
        "Gallery",
        true,
        false,
        "Gallery"
      ),

      createCorePageSection(
        "testimonials",
        "Testimonials",
        true,
        false,
        "Reviews"
      ),

      footer
    ];

  }


  if (pageType === "contact") {

    return [
      hero,

      createCorePageSection(
        "contact",
        "Contact",
        true,
        false,
        "Contact"
      ),

      createCorePageSection(
        "faq",
        "FAQ",
        true,
        false,
        "FAQ"
      ),

      footer
    ];

  }


  return [
    hero,

    createCorePageSection(
      "about",
      "Content",
      true,
      false,
      "Content"
    ),

    footer
  ];

}


function slugifyPageTitle(title) {

  return String(title || "page")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    || "page";

}


function createSitePage(
  title = "New Page",
  pageType = "blank"
) {

  pageCounter += 1;


  const page = {

    id: `page-${pageCounter}`,

    type: pageType,

    title,

    slug:
      slugifyPageTitle(title),

    navLabel: title,

    showInNav: true,

    locked: false,

    sections:
      createPageSections(
        pageType
      )

  };


  siteProject.pages.push(page);

  return page;

}


function switchSitePage(pageId) {

  const page =
    siteProject.pages.find(
      item => item.id === pageId
    );

  if (!page) return;


  activePageId =
    page.id;

  siteSections =
    page.sections;


  renderPageManager();
  renderSectionManager();


  if (siteHasBeenGenerated) {

    pendingLiveRefresh = true;
    form.requestSubmit();

  }

}



function canSectionAppearInNav(section) {

  return !["hero", "cta", "footer"]
    .includes(section.id);

}


function getSectionAnchor(section) {

  return `pg-${section.id}`;

}


function getNavigationSections() {

  /*
    Primary navigation is site-wide.

    Section links come from the Home page so the
    navigation does not change as the editor moves
    between About, Collections, Contact, etc.
  */

  const homePage =
    siteProject.pages.find(
      page =>
        page.slug === "index" ||
        page.id === "home"
    );


  const homeSections =
    homePage?.sections || [];


  /*
    Pages take priority over sections with the same
    destination name.

    Example:
      About page + About Home section
      -> show only About page in primary navigation.
  */

  const pageNavigationNames =
    new Set(
      siteProject.pages
        .filter(page =>
          page.showInNav
        )
        .flatMap(page => [

          page.title,
          page.navLabel,
          page.slug

        ])
        .filter(Boolean)
        .map(value =>
          String(value)
            .trim()
            .toLowerCase()
            .replace(/\.html$/i, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
        )
    );


  return homeSections.filter(section => {

    if (
      !section.enabled ||
      !section.showInNav ||
      !canSectionAppearInNav(section)
    ) {

      return false;

    }


    const sectionNames = [

      section.label,
      section.navLabel,
      section.id

    ]
      .filter(Boolean)
      .map(value =>
        String(value)
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
      );


    return !sectionNames.some(name =>
      pageNavigationNames.has(name)
    );

  });

}


function getNavigationSectionHref(section) {

  const anchor =
    `#${getSectionAnchor(section)}`;


  /*
    Home can jump directly to its section.

    Other pages point back to Home plus the anchor.
  */

  if (activePageId === "home") {

    return anchor;

  }


  return `index.html${anchor}`;

}


function getNavigationPages() {

  return siteProject.pages.filter(
    page => page.showInNav
  );

}


function getPageHref(page) {

  if (page.id === activePageId) {

    return "#pg-hero";

  }


  if (page.slug === "index") {

    return "index.html";

  }


  return `${page.slug}.html`;

}





/* -------------------------------------------------
   SITE TEMPLATES
-------------------------------------------------- */

const siteTemplates = {

  "local-service": {
    heroStyle: "background",
    palette: "professional",
    sections: [
      ["hero", true, false, "Hero"],
      ["services", true, true, "Services"],
      ["about", true, true, "About"],
      ["testimonials", true, false, "Reviews"],
      ["gallery", true, false, "Gallery"],
      ["faq", true, false, "FAQ"],
      ["contact", true, true, "Contact"],
      ["cta", true, false, "Final CTA"],
      ["footer", true, false, "Footer"]
    ]
  },

  restaurant: {
    heroStyle: "background",
    palette: "earthy",
    sections: [
      ["hero", true, false, "Hero"],
      ["gallery", true, false, "Gallery"],
      ["about", true, true, "Our Story"],
      ["testimonials", true, true, "Reviews"],
      ["faq", false, false, "FAQ"],
      ["services", false, false, "Services"],
      ["contact", true, true, "Visit"],
      ["cta", true, false, "Reservations"],
      ["footer", true, false, "Footer"]
    ]
  },

  professional: {
    heroStyle: "split",
    palette: "professional",
    sections: [
      ["hero", true, false, "Hero"],
      ["services", true, true, "Services"],
      ["about", true, true, "About"],
      ["testimonials", true, false, "Reviews"],
      ["faq", true, true, "FAQ"],
      ["gallery", false, false, "Gallery"],
      ["contact", true, true, "Contact"],
      ["cta", true, false, "Final CTA"],
      ["footer", true, false, "Footer"]
    ]
  },

  retail: {
    heroStyle: "split",
    palette: "modern",
    sections: [
      ["hero", true, false, "Hero"],
      ["gallery", true, false, "Gallery"],
      ["services", false, false, "Services"],
      ["about", true, true, "About"],
      ["testimonials", true, false, "Reviews"],
      ["faq", false, false, "FAQ"],
      ["contact", true, true, "Visit"],
      ["cta", true, false, "Shop"],
      ["footer", true, false, "Footer"]
    ]
  },

  automotive: {
    heroStyle: "background",
    palette: "bold",
    sections: [
      ["hero", true, false, "Hero"],
      ["services", true, true, "Services"],
      ["testimonials", true, true, "Reviews"],
      ["about", true, true, "About"],
      ["gallery", true, false, "Gallery"],
      ["faq", false, false, "FAQ"],
      ["contact", true, true, "Contact"],
      ["cta", true, false, "Book Service"],
      ["footer", true, false, "Footer"]
    ]
  },

  blank: {
    heroStyle: "minimal",
    palette: "professional",
    sections: [
      ["hero", true, false, "Hero"],
      ["about", false, false, "About"],
      ["services", false, false, "Services"],
      ["testimonials", false, false, "Reviews"],
      ["gallery", false, false, "Gallery"],
      ["faq", false, false, "FAQ"],
      ["contact", true, true, "Contact"],
      ["cta", false, false, "Final CTA"],
      ["footer", true, false, "Footer"]
    ]
  }

};


let selectedSiteTemplate =
  "local-service";


function updateTemplateSectionChoices() {

  document
    .querySelectorAll("[data-template-only]")
    .forEach(button => {

      button.hidden =
        button.dataset.templateOnly !==
        selectedSiteTemplate;

    });

}



function applySiteTemplate(templateName) {

  const template =
    siteTemplates[templateName];

  if (!template) return;

  selectedSiteTemplate =
    templateName;


  const customSections =
    siteSections.filter(section =>
      section.custom
    );


  const coreSections =
    template.sections
      .map(([
        id,
        enabled,
        showInNav,
        navLabel
      ]) => {

        const section =
          siteSections.find(
            item =>
              item.id === id &&
              !item.custom
          );

        if (!section) return null;

        section.enabled =
          enabled;

        section.showInNav =
          showInNav;

        section.navLabel =
          navLabel;

        return section;

      })
      .filter(Boolean);


  siteSections.splice(
    0,
    siteSections.length,
    ...coreSections,
    ...customSections
  );


  selectedHeroStyle =
    template.heroStyle;


  heroStyleButtons.forEach(button => {

    button.classList.toggle(
      "active",
      button.dataset.heroStyle ===
        selectedHeroStyle
    );

  });


  const paletteButton =
    document.querySelector(
      `[data-palette="${template.palette}"]`
    );


  if (paletteButton) {
    paletteButton.click();
  }


  document
    .querySelectorAll(
      "[data-site-template]"
    )
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.siteTemplate ===
          templateName
      );

    });


  /*
  LIVE PREVIEW

  Text, textarea, select, checkbox and similar
  builder controls regenerate the site after a
  short pause.

  File inputs are excluded because their FileReader
  handlers need to finish loading the image first.
*/

form.addEventListener(
  "input",
  event => {

    if (
      event.target.matches(
        'input[type="file"]'
      )
    ) {
      return;
    }

    scheduleLivePreview();

  }
);


form.addEventListener(
  "change",
  event => {

    if (
      event.target.matches(
        'input[type="file"]'
      )
    ) {
      return;
    }

    scheduleLivePreview();

  }
);


/*
  Most visual controls are buttons rather than
  form inputs: templates, palettes, section
  controls, hero styles, etc.

  Let their own click handlers update state first,
  then schedule the preview on the next task.
*/

form.addEventListener(
  "click",
  event => {

    const button =
      event.target.closest(
        'button[type="button"]'
      );

    if (!button) return;


    setTimeout(() => {

      scheduleLivePreview();

    }, 0);

  }
);



updateTemplateSectionChoices();

  renderSectionManager();

}


document
  .querySelectorAll(
    "[data-site-template]"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        applySiteTemplate(
          button.dataset.siteTemplate
        );

      }
    );

  });



const selectedTextures = {
  page: "none",
  hero: "none",
  cards: "none"
};


/* -------------------------------------------------
   BRAND COLORS
------------------------------------------------- */

const colors = {
  primary: document.querySelector("#primary-color"),
  accent: document.querySelector("#accent-color"),
  button: document.querySelector("#button-color"),
  buttonText: document.querySelector("#button-text-color")
};


const palettes = {

  professional: {
    primary: "#1f4f8f",
    accent: "#38bdf8",
    button: "#2563eb",
    buttonText: "#ffffff"
  },

  modern: {
    primary: "#111827",
    accent: "#8b5cf6",
    button: "#7c3aed",
    buttonText: "#ffffff"
  },

  bold: {
    primary: "#991b1b",
    accent: "#f59e0b",
    button: "#dc2626",
    buttonText: "#ffffff"
  },

  earthy: {
    primary: "#3f6212",
    accent: "#a3e635",
    button: "#4d7c0f",
    buttonText: "#ffffff"
  },

  luxury: {
    primary: "#171717",
    accent: "#d4af37",
    button: "#b8962e",
    buttonText: "#111111"
  },

  dark: {
    primary: "#0f172a",
    accent: "#22d3ee",
    button: "#0891b2",
    buttonText: "#ffffff"
  }

};


function updateColorValue(input) {

  const valueDisplay = document.querySelector(
    `[data-color-value="${input.id}"]`
  );

  if (valueDisplay) {
    valueDisplay.textContent = input.value;
  }

}


document.querySelectorAll('input[type="color"]').forEach(input => {

  updateColorValue(input);

  input.addEventListener("input", () => {

    updateColorValue(input);

    paletteButtons.forEach(button => {
      button.classList.remove("active");
    });

  });

});


paletteButtons.forEach(button => {

  button.addEventListener("click", () => {

    const palette = palettes[button.dataset.palette];

    if (!palette) return;

    colors.primary.value = palette.primary;
    colors.accent.value = palette.accent;
    colors.button.value = palette.button;
    colors.buttonText.value = palette.buttonText;

    Object.values(colors).forEach(updateColorValue);

    paletteButtons.forEach(btn => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

  });

});


/* -------------------------------------------------
   VISUAL IDENTITY
------------------------------------------------- */

function readImageFile(file, callback) {

  if (!file) return;

  const reader = new FileReader();

  reader.onload = event => {
    callback(event.target.result);
  };

  reader.readAsDataURL(file);

}


logoInput.addEventListener("change", () => {

  readImageFile(
    logoInput.files[0],
    dataURL => {

      logoDataURL = dataURL;

      logoPreview.hidden = false;

      logoPreview.innerHTML = `
        <img
          src="${dataURL}"
          alt="Logo preview"
        >
      `;

    }
  );

});


heroImageInput.addEventListener("change", () => {

  readImageFile(
    heroImageInput.files[0],
    dataURL => {

      heroImageDataURL = dataURL;

      heroImagePreview.hidden = false;

      heroImagePreview.innerHTML = `
        <img
          src="${dataURL}"
          alt="Hero preview"
        >
      `;

    }
  );

});


galleryInput.addEventListener("change", () => {

  const files = Array.from(
    galleryInput.files
  ).slice(0, 9);

  galleryDataURLs = [];

  galleryPreview.innerHTML = "";

  if (!files.length) {
    galleryPreview.hidden = true;
    return;
  }

  galleryPreview.hidden = false;

  files.forEach(file => {

    readImageFile(
      file,
      dataURL => {

        galleryDataURLs.push(dataURL);

        const image = document.createElement("img");

        image.src = dataURL;
        image.alt = "Gallery preview";

        galleryPreview.appendChild(image);

      }
    );

  });

});



heroStyleButtons.forEach(button => {

  button.addEventListener("click", () => {

    selectedHeroStyle =
      button.dataset.heroStyle;

    heroStyleButtons.forEach(item => {
      item.classList.remove("active");
    });

    button.classList.add("active");

  });

});



/* -------------------------------------------------
   DEMO BUSINESS
------------------------------------------------- */

function setField(selector, value) {

  const element = document.querySelector(selector);

  if (!element) return;

  element.value = value;

}


function loadDemoBusiness() {

  setField(
    "#business-name",
    "Gulf Coast Pressure Washing"
  );

  setField(
    "#tagline",
    "Make Your Property Look New Again."
  );

  setField(
    "#description",
    "Gulf Coast Pressure Washing provides residential and commercial exterior cleaning throughout Southwest Florida. We focus on reliable scheduling, careful work, and straightforward service."
  );

  setField(
    "#phone",
    "(239) 555-0188"
  );

  setField(
    "#email",
    "hello@gulfcoastwashing.com"
  );

  setField(
    "#address",
    "Fort Myers, Florida"
  );

  setField(
    "#primary-zip",
    "33901"
  );

  setField(
    "#service-zips",
    "33905, 33907, 33908, 33912, 33913"
  );

  setField(
    "#services",
    `House Washing
Driveway Cleaning
Roof Soft Washing
Pool Deck Cleaning
Commercial Pressure Washing
Paver Cleaning`
  );

  setField(
    "#hours",
    `Monday-Friday: 8:00 AM - 6:00 PM
Saturday: 9:00 AM - 3:00 PM
Sunday: Closed`
  );

  setField(
    "#testimonials",
    `Sarah M. | Fantastic service. They were on time, professional, and the results were better than expected.
John D. | Great communication from start to finish. I would absolutely use them again.
Michael R. | Fair pricing, excellent work, and no runaround.`
  );

  setField(
    "#faqs",
    `Do you offer free estimates? | Yes. Contact us and we'll discuss your project and what you need.
What areas do you serve? | We serve Fort Myers and surrounding Southwest Florida communities.
Do I need to be home during service? | It depends on the job. We can discuss access and scheduling when you book.
How quickly can I schedule service? | Availability varies, but we'll always give you the earliest available appointment.`
  );

  const professional =
    document.querySelector('[data-palette="professional"]');

  if (professional) {
    professional.click();
  }

  previewTitle.textContent =
    "Gulf Coast Pressure Washing";

}


demoButton.addEventListener(
  "click",
  loadDemoBusiness
);



/* -------------------------------------------------
   TEXTURES
------------------------------------------------- */

document
  .querySelectorAll("[data-texture-group]")
  .forEach(group => {

    const groupName =
      group.dataset.textureGroup;

    group
      .querySelectorAll("[data-texture]")
      .forEach(button => {

        button.addEventListener("click", () => {

          selectedTextures[groupName] =
            button.dataset.texture;

          group
            .querySelectorAll("[data-texture]")
            .forEach(item => {
              item.classList.remove("active");
            });

          button.classList.add("active");

        });

      });

  });



/* -------------------------------------------------
   REVEAL MOTION CONTROLS
------------------------------------------------- */

document
  .querySelectorAll("[data-reveal-style] [data-reveal-value]")
  .forEach(button => {

    button.addEventListener("click", () => {

      selectedRevealStyle =
        button.dataset.revealValue;

      document
        .querySelectorAll("[data-reveal-style] .motion-choice")
        .forEach(item => {
          item.classList.remove("active");
        });

      button.classList.add("active");

    });

  });


document
  .querySelectorAll("[data-reveal-speed] [data-speed-value]")
  .forEach(button => {

    button.addEventListener("click", () => {

      selectedRevealSpeed =
        button.dataset.speedValue;

      document
        .querySelectorAll("[data-reveal-speed] .motion-choice")
        .forEach(item => {
          item.classList.remove("active");
        });

      button.classList.add("active");

    });

  });



/* -------------------------------------------------
   PREVIEW MODE
------------------------------------------------- */

previewButtons.forEach(button => {

  button.addEventListener("click", () => {

    previewButtons.forEach(btn => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    const isMobile =
      button.dataset.preview === "mobile";

    preview.classList.toggle(
      "mobile",
      isMobile
    );

    const generatedSite =
      preview.querySelector(".pg-site");

    if (generatedSite) {
      generatedSite.classList.toggle(
        "pg-force-mobile",
        isMobile
      );
    }

  });

});


/* -------------------------------------------------
   HELPERS
------------------------------------------------- */

function escapeHTML(value = "") {

  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


function getValue(selector, fallback = "") {

  const element = document.querySelector(selector);

  if (!element) return fallback;

  const value = element.value.trim();

  return value || fallback;

}


function getValueOrPlaceholder(selector, fallback = "") {

  const element = document.querySelector(selector);

  if (!element) return fallback;

  const value = element.value.trim();

  if (value) {
    return value;
  }

  const placeholder =
    (element.placeholder || "").trim();

  return placeholder || fallback;

}


function cleanPhone(phone) {

  return phone.replace(/[^\d+]/g, "");

}


function splitLines(value) {

  return value
    .split("\n")
    .map(item => item.trim())
    .filter(Boolean);

}



function splitPairs(value) {

  return splitLines(value)
    .map(line => {

      const separator = line.indexOf("|");

      if (separator === -1) {
        return null;
      }

      return {
        first: line.slice(0, separator).trim(),
        second: line.slice(separator + 1).trim()
      };

    })
    .filter(item =>
      item &&
      item.first &&
      item.second
    );

}


/* -------------------------------------------------
   EXPORT HELPERS
------------------------------------------------- */

function slugify(value = "") {

  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    || "sytebyte-site";

}


function buildStandaloneRuntime() {

  return `
<script>

(() => {

  /* MOBILE MENU */

  const menuToggle =
    document.querySelector(".pg-menu-toggle");

  const mobileMenu =
    document.querySelector(".pg-mobile-menu");


  if (menuToggle && mobileMenu) {

    menuToggle.addEventListener("click", () => {

      const open =
        mobileMenu.classList.toggle("open");

      menuToggle.classList.toggle(
        "active",
        open
      );

      menuToggle.setAttribute(
        "aria-expanded",
        String(open)
      );

    });


    mobileMenu
      .querySelectorAll("a")
      .forEach(link => {

        link.addEventListener("click", () => {

          mobileMenu.classList.remove("open");
          menuToggle.classList.remove("active");

          menuToggle.setAttribute(
            "aria-expanded",
            "false"
          );

        });

      });

  }



  /* SMOOTH NAVIGATION */

  document.addEventListener(
    "click",
    event => {

      const link =
        event.target.closest(
          'a[href^="#pg-"]'
        );

      if (!link) return;


      const targetSelector =
        link.getAttribute("href");

      if (!targetSelector) return;


      const target =
        document.querySelector(
          targetSelector
        );

      if (!target) return;


      event.preventDefault();


      const nav =
        document.querySelector(
          ".pg-nav"
        );


      const offset =
        (nav?.offsetHeight || 70)
        + 18;


      const targetTop =
        target.getBoundingClientRect().top
        +
        window.scrollY
        -
        offset;


      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: "smooth"
      });


      history.replaceState(
        null,
        "",
        targetSelector
      );

    }
  );



  /* SCROLL REVEAL */

  const revealTargets =
    document.querySelectorAll(".pg-reveal");


  if (
    "IntersectionObserver" in window &&
    !window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  ) {

    const observer =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add(
              "pg-revealed"
            );

            observer.unobserve(
              entry.target
            );

          });

        },
        {
          threshold: 0.01,
          rootMargin: "0px 0px -10% 0px"
        }
      );


    revealTargets.forEach(target => {
      observer.observe(target);
    });

  } else {

    revealTargets.forEach(target => {
      target.classList.add("pg-revealed");
    });

  }



  /* HERO PARALLAX */

  const parallaxImages =
    document.querySelectorAll(
      ".pg-parallax-image"
    );


  if (
    parallaxImages.length &&
    !window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  ) {

    const updateParallax = () => {

      parallaxImages.forEach(image => {

        const visual =
          image.closest(".pg-hero-visual");

        if (!visual) return;

        const rect =
          visual.getBoundingClientRect();

        if (
          rect.bottom < 0 ||
          rect.top > window.innerHeight
        ) {
          return;
        }

        const center =
          rect.top + rect.height / 2;

        const offset =
          (
            center -
            window.innerHeight / 2
          ) * -0.08;

        image.style.setProperty(
          "--parallax-y",
          offset + "px"
        );

      });

    };


    updateParallax();

    window.addEventListener(
      "scroll",
      updateParallax,
      {
        passive: true
      }
    );

  }

})();

<\/script>`;

}



function buildStandaloneDocument(
  page = getActivePage()
) {

  const standaloneMarkup =
    preview.innerHTML.replace(
      /\s*pg-force-mobile/g,
      ""
    );


  const businessName =
    getValue(
      "#business-name",
      document
        .querySelector("#business-name")
        .placeholder ||
        "Your Business"
    );


  const description =
    getValue(
      "#description",
      `${businessName} provides dependable local service.`
    );


  const pageTitle =
    page?.slug === "index"
      ? businessName
      : `${page?.title || "Page"} | ${businessName}`;


  return `<!DOCTYPE html>
<html lang="en">

<head>

  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>${escapeHTML(pageTitle)}</title>

  <meta
    name="description"
    content="${escapeHTML(description)}"
  >

</head>

<body>

${standaloneMarkup}

${buildStandaloneRuntime()}

</body>

</html>`;

}



/* -------------------------------------------------
   SYTEBYTE PROJECT FILES
-------------------------------------------------- */

function captureBuilderFormState() {

  const state = {};

  form
    .querySelectorAll(
      "input[id], textarea[id], select[id]"
    )
    .forEach(control => {

      if (control.type === "file") {
        return;
      }

      if (
        control.type === "checkbox" ||
        control.type === "radio"
      ) {

        state[control.id] = {
          type: control.type,
          checked: control.checked
        };

        return;

      }

      state[control.id] = {
        type:
          control.type ||
          control.tagName.toLowerCase(),

        value: control.value
      };

    });

  return state;

}


function restoreBuilderFormState(state = {}) {

  Object.entries(state)
    .forEach(([id, saved]) => {

      const control =
        document.getElementById(id);

      if (!control) return;

      if (
        saved.type === "checkbox" ||
        saved.type === "radio"
      ) {

        control.checked =
          Boolean(saved.checked);

      } else if (
        Object.prototype.hasOwnProperty.call(
          saved,
          "value"
        )
      ) {

        control.value =
          saved.value ?? "";

      }

    });

}


function getActivePaletteName() {

  return (
    document.querySelector(
      "[data-palette].active"
    )?.dataset.palette ||
    null
  );

}


function buildSyteByteProject() {

  return {

    format: "sytebyte-project",

    version: 1,

    savedAt:
      new Date().toISOString(),

    project: {

      globals:
        JSON.parse(
          JSON.stringify(
            siteProject.globals || {}
          )
        ),

      pages:
        JSON.parse(
          JSON.stringify(
            siteProject.pages
          )
        )

    },

    editor: {

      activePageId,
      pageCounter,
      customSectionCounter

    },

    form:
      captureBuilderFormState(),

    assets: {

      logoDataURL,
      heroImageDataURL,

      galleryDataURLs: [
        ...galleryDataURLs
      ]

    },

    visual: {

      selectedSiteTemplate,
      selectedHeroStyle,
      selectedRevealStyle,
      selectedRevealSpeed,

      selectedTextures:
        typeof selectedTextures !== "undefined"
          ? JSON.parse(
              JSON.stringify(
                selectedTextures
              )
            )
          : null,

      palette:
        getActivePaletteName()

    }

  };

}


function downloadSyteByteProject() {

  const project =
    buildSyteByteProject();

  const businessName =
    getValue(
      "#business-name",
      "sytebyte-project"
    );

  const filename =
    `${slugify(businessName)}.sytebyte.json`;

  const blob =
    new Blob(
      [
        JSON.stringify(
          project,
          null,
          2
        )
      ],
      {
        type:
          "application/json;charset=utf-8"
      }
    );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);

}


function restoreAssetPreviews() {

  if (
    logoPreview &&
    logoPreview.tagName === "IMG"
  ) {

    logoPreview.src =
      logoDataURL || "";

    logoPreview.hidden =
      !logoDataURL;

  }


  if (
    heroImagePreview &&
    heroImagePreview.tagName === "IMG"
  ) {

    heroImagePreview.src =
      heroImageDataURL || "";

    heroImagePreview.hidden =
      !heroImageDataURL;

  }


  if (galleryPreview) {

    galleryPreview.innerHTML =
      galleryDataURLs
        .map((image, index) => `
          <img
            src="${image}"
            alt="Gallery image ${index + 1}"
          >
        `)
        .join("");

    galleryPreview.hidden =
      galleryDataURLs.length === 0;

  }

}


function applyImportedVisualState(
  visual = {}
) {

  if (visual.selectedSiteTemplate) {
    selectedSiteTemplate =
      visual.selectedSiteTemplate;
  }

  if (visual.selectedHeroStyle) {
    selectedHeroStyle =
      visual.selectedHeroStyle;
  }

  if (visual.selectedRevealStyle) {
    selectedRevealStyle =
      visual.selectedRevealStyle;
  }

  if (visual.selectedRevealSpeed) {
    selectedRevealSpeed =
      visual.selectedRevealSpeed;
  }

  if (
    visual.selectedTextures &&
    typeof selectedTextures !== "undefined"
  ) {

    Object.assign(
      selectedTextures,
      visual.selectedTextures
    );

  }


  document
    .querySelectorAll(
      "[data-site-template]"
    )
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.siteTemplate ===
          selectedSiteTemplate
      );

    });


  heroStyleButtons.forEach(button => {

    button.classList.toggle(
      "active",
      button.dataset.heroStyle ===
        selectedHeroStyle
    );

  });


  if (visual.palette) {

    paletteButtons.forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.palette ===
          visual.palette
      );

    });

  }


  updateTemplateSectionChoices();

}


function loadSyteByteProject(project) {

  if (
    !project ||
    project.format !==
      "sytebyte-project" ||
    !Array.isArray(
      project.project?.pages
    ) ||
    project.project.pages.length === 0
  ) {

    throw new Error(
      "This is not a valid SyteByte project file."
    );

  }


  restoreBuilderFormState(
    project.form || {}
  );


  logoDataURL =
    project.assets?.logoDataURL ||
    "";

  heroImageDataURL =
    project.assets?.heroImageDataURL ||
    "";

  galleryDataURLs =
    Array.isArray(
      project.assets?.galleryDataURLs
    )
      ? [
          ...project.assets.galleryDataURLs
        ]
      : [];


  siteProject.globals =
    project.project.globals || {};

  siteProject.pages =
    project.project.pages;


  const requestedPageId =
    project.editor?.activePageId;


  activePageId =
    siteProject.pages.some(
      page =>
        page.id === requestedPageId
    )
      ? requestedPageId
      : siteProject.pages[0].id;


  const activePage =
    getActivePage();


  siteSections =
    activePage.sections;


  pageCounter =
    Number.isFinite(
      project.editor?.pageCounter
    )
      ? project.editor.pageCounter
      : siteProject.pages.length;


  customSectionCounter =
    Number.isFinite(
      project.editor?.customSectionCounter
    )
      ? project.editor.customSectionCounter
      : customSectionCounter;


  applyImportedVisualState(
    project.visual || {}
  );


  restoreAssetPreviews();

  renderPageManager();
  renderSectionManager();


  siteHasBeenGenerated = true;
  pendingLiveRefresh = true;

  form.requestSubmit();

}


saveProjectButton?.addEventListener(
  "click",
  downloadSyteByteProject
);


importProjectButton?.addEventListener(
  "click",
  () => {

    importProjectInput?.click();

  }
);


importProjectInput?.addEventListener(
  "change",
  event => {

    const file =
      event.target.files?.[0];

    if (!file) return;


    const reader =
      new FileReader();


    reader.addEventListener(
      "load",
      () => {

        try {

          const project =
            JSON.parse(
              String(reader.result)
            );

          loadSyteByteProject(
            project
          );

          importProjectInput.value =
            "";

        } catch (error) {

          console.error(
            "SyteByte project import failed:",
            error
          );

          alert(
            error.message ||
            "Could not import this SyteByte project."
          );

        }

      }
    );


    reader.readAsText(file);

  }
);



/* -------------------------------------------------
   MULTIPAGE WEBSITE PUBLISHING
-------------------------------------------------- */

function getPublishedPageFilename(page) {

  if (
    !page ||
    page.slug === "index"
  ) {

    return "index.html";

  }


  return `${
    slugifyPageTitle(
      page.slug ||
      page.title
    )
  }.html`;

}


/*
  Small dependency-free ZIP writer.

  Files are stored without compression. HTML is
  already tiny, and this keeps SyteByte completely
  standalone with no third-party ZIP library.
*/

function makeCRC32Table() {

  const table =
    new Uint32Array(256);


  for (
    let n = 0;
    n < 256;
    n += 1
  ) {

    let value = n;


    for (
      let k = 0;
      k < 8;
      k += 1
    ) {

      value =
        value & 1
          ? 0xedb88320 ^
            (value >>> 1)
          : value >>> 1;

    }


    table[n] =
      value >>> 0;

  }


  return table;

}


const syteByteCRC32Table =
  makeCRC32Table();


function crc32(bytes) {

  let crc =
    0xffffffff;


  for (
    let index = 0;
    index < bytes.length;
    index += 1
  ) {

    crc =
      syteByteCRC32Table[
        (crc ^ bytes[index]) &
        0xff
      ] ^
      (crc >>> 8);

  }


  return (
    crc ^ 0xffffffff
  ) >>> 0;

}


function uint16LE(value) {

  return [
    value & 0xff,
    (value >>> 8) & 0xff
  ];

}


function uint32LE(value) {

  return [
    value & 0xff,
    (value >>> 8) & 0xff,
    (value >>> 16) & 0xff,
    (value >>> 24) & 0xff
  ];

}


function buildSyteByteZip(files) {

  const encoder =
    new TextEncoder();


  const localParts = [];
  const centralParts = [];

  let offset = 0;


  files.forEach(file => {

    const filenameBytes =
      encoder.encode(file.name);

    const contentBytes =
      encoder.encode(file.content);

    const checksum =
      crc32(contentBytes);


    /*
      Local file header
    */

    const localHeader =
      new Uint8Array([
        0x50, 0x4b, 0x03, 0x04,

        ...uint16LE(20),
        ...uint16LE(0x0800),
        ...uint16LE(0),

        ...uint16LE(0),
        ...uint16LE(0),

        ...uint32LE(checksum),

        ...uint32LE(
          contentBytes.length
        ),

        ...uint32LE(
          contentBytes.length
        ),

        ...uint16LE(
          filenameBytes.length
        ),

        ...uint16LE(0)
      ]);


    localParts.push(
      localHeader,
      filenameBytes,
      contentBytes
    );


    /*
      Central directory entry
    */

    const centralHeader =
      new Uint8Array([
        0x50, 0x4b, 0x01, 0x02,

        ...uint16LE(20),
        ...uint16LE(20),

        ...uint16LE(0x0800),
        ...uint16LE(0),

        ...uint16LE(0),
        ...uint16LE(0),

        ...uint32LE(checksum),

        ...uint32LE(
          contentBytes.length
        ),

        ...uint32LE(
          contentBytes.length
        ),

        ...uint16LE(
          filenameBytes.length
        ),

        ...uint16LE(0),
        ...uint16LE(0),
        ...uint16LE(0),
        ...uint16LE(0),

        ...uint32LE(0),

        ...uint32LE(offset)
      ]);


    centralParts.push(
      centralHeader,
      filenameBytes
    );


    offset +=
      localHeader.length +
      filenameBytes.length +
      contentBytes.length;

  });


  const centralOffset =
    offset;


  const centralSize =
    centralParts.reduce(
      (total, part) =>
        total + part.length,
      0
    );


  const endRecord =
    new Uint8Array([
      0x50, 0x4b, 0x05, 0x06,

      ...uint16LE(0),
      ...uint16LE(0),

      ...uint16LE(files.length),
      ...uint16LE(files.length),

      ...uint32LE(
        centralSize
      ),

      ...uint32LE(
        centralOffset
      ),

      ...uint16LE(0)
    ]);


  return new Blob(
    [
      ...localParts,
      ...centralParts,
      endRecord
    ],
    {
      type: "application/zip"
    }
  );

}


async function buildPublishedPages() {

  const originalPageId =
    activePageId;


  const publishedFiles = [];


  /*
    Render each page through the same generator
    SyteByte uses for the live preview.

    That means Publish Files cannot drift away
    from what the user actually sees.
  */

  for (
    const page of siteProject.pages
  ) {

    activePageId =
      page.id;

    siteSections =
      page.sections;


    pendingLiveRefresh = true;

    form.requestSubmit();


    /*
      Give the browser one frame to finish any
      generated DOM work before capturing it.
    */

    await new Promise(resolve => {

      requestAnimationFrame(resolve);

    });


    publishedFiles.push({

      name:
        getPublishedPageFilename(
          page
        ),

      content:
        buildStandaloneDocument(
          page
        )

    });

  }


  /*
    Put the builder back exactly where it was.
  */

  const originalPage =
    siteProject.pages.find(
      page =>
        page.id === originalPageId
    ) ||
    siteProject.pages[0];


  activePageId =
    originalPage.id;

  siteSections =
    originalPage.sections;


  renderPageManager();
  renderSectionManager();


  pendingLiveRefresh = true;

  form.requestSubmit();


  return publishedFiles;

}


async function downloadGeneratedSite() {

  if (
    !preview.querySelector(".pg-site")
  ) {

    return;

  }


  exportButton.disabled = true;


  const originalLabel =
    exportButton.textContent;


  exportButton.textContent =
    "Publishing…";


  try {

    const files =
      await buildPublishedPages();


    if (!files.length) {
      return;
    }


    const businessName =
      getValue(
        "#business-name",
        "sytebyte-site"
      );


    const archiveName =
      `${
        slugify(businessName)
      }-website.zip`;


    const zipBlob =
      buildSyteByteZip(
        files
      );


    const url =
      URL.createObjectURL(
        zipBlob
      );


    const link =
      document.createElement("a");


    link.href =
      url;

    link.download =
      archiveName;


    document.body.appendChild(
      link
    );


    link.click();

    link.remove();


    URL.revokeObjectURL(
      url
    );


  } catch (error) {

    console.error(
      "SyteByte publish failed:",
      error
    );


    alert(
      error.message ||
      "SyteByte could not publish this website."
    );


  } finally {

    exportButton.textContent =
      originalLabel;

    exportButton.disabled =
      false;

  }

}



exportButton.addEventListener(
  "click",
  downloadGeneratedSite
);



fullscreenButton.addEventListener(
  "click",
  () => {

    if (!preview.querySelector(".pg-site")) {
      return;
    }


    const documentHTML =
      buildStandaloneDocument();


    const blob = new Blob(
      [documentHTML],
      {
        type: "text/html;charset=utf-8"
      }
    );


    const url =
      URL.createObjectURL(blob);


    const newTab =
      window.open(
        url,
        "_blank",
        "noopener"
      );


    if (!newTab) {
      URL.revokeObjectURL(url);
      return;
    }


    /*
      Keep the Blob URL alive long enough for the
      new tab to finish loading.
    */

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 30000);

  }
);



/* -------------------------------------------------
   PAGE SECTION MANAGER
------------------------------------------------- */

const sectionManager =
  document.querySelector("#section-manager");


function createCustomSection(type) {

  customSectionCounter += 1;

  const id =
    `custom-${type}-${customSectionCounter}`;


  const definitions = {

    "text-image": {
      label: "Text + Image",
      title: "Built Around Your Needs",
      body: "Use this section to tell customers more about the business, a specialty, a process, or what makes the company different.",
      image: ""
    },

    features: {
      label: "Feature Cards",
      title: "Why Customers Choose Us",
      items:
        "Reliable Service | We show up and communicate clearly.\nExperienced Team | Professional work you can depend on.\nLocal Support | Service from people who know the community."
    },

    promo: {
      label: "Promo CTA",
      title: "Ready to Get Started?",
      body: "Contact us today to discuss what you need.",
      buttonText: "Contact Us",
      linkType: "section",
      linkTarget: "home:contact",
      linkUrl: ""
    },

    trust: {
      label: "Trust Strip",
      title: "A Local Business You Can Count On",
      items:
        "Locally Owned\nProfessional Service\nResponsive Support\nQuality Work"
    },


    menu: {
      label: "Menu",
      title: "Our Menu",
      intro: "Fresh favorites made for every appetite.",
      items:
        "Starters | Crispy Calamari | Lightly fried with lemon and herbs. | $14\nStarters | Garlic Bread | Toasted with garlic butter and parmesan. | $8\nMains | House Burger | Angus beef, cheddar, lettuce, tomato and house sauce. | $17\nMains | Grilled Salmon | Seasonal vegetables and herb butter. | $26\nDesserts | Cheesecake | Classic cheesecake with seasonal topping. | $9"
    },


    "featured-dish": {
      label: "Featured Dish",
      title: "Chef's Featured Dish",
      body: "Highlight a signature dish, seasonal special, or customer favorite.",
      price: "$24",
      image: ""
    },


    reservation: {
      label: "Reservations",
      title: "Reserve Your Table",
      body: "Planning dinner, a celebration, or a night out? Reserve your table today.",
      buttonText: "Reserve a Table",
      linkType: "none",
      linkTarget: "",
      linkUrl: ""
    },

    credentials: {
      label: "Credentials",
      title: "Experience You Can Trust",
      intro: "Professional credentials, qualifications, and experience that give clients confidence.",
      items:
        "Licensed Professional | Fully licensed and qualified to serve our clients.\nIndustry Experience | Years of hands-on experience solving real problems.\nProfessional Standards | Work performed with care, integrity, and attention to detail.\nClient Focused | Clear communication and dependable support from start to finish."
    },

    process: {
      label: "Process",
      title: "How We Work",
      intro: "A straightforward process designed to keep every engagement clear and efficient.",
      items:
        "Discovery | We learn about your goals, needs, and priorities.\nPlan | We develop a clear path forward based on your situation.\nExecution | We put the plan into action with consistent communication.\nFollow Through | We review the outcome and make sure everything is handled."
    },

    team: {
      label: "Team",
      title: "Meet the Team",
      intro: "Experienced professionals committed to providing thoughtful, dependable service.",
      items:
        "Alex Morgan | Founder & Principal | Leads strategy and client relationships.\nJordan Lee | Senior Advisor | Brings deep experience and practical problem solving.\nTaylor Reed | Client Services | Keeps projects organized and clients informed."
    },

    products: {
      label: "Featured Products",
      title: "Featured Products",
      intro: "A few customer favorites worth checking out.",
      items:
        "Signature Product | A short description of your featured product. | $49 |\nEveryday Favorite | Another popular item customers love. | $29 |\nPremium Pick | A higher-end option with standout features. | $79 |"
    },

    collections: {
      label: "Collections",
      title: "Shop by Collection",
      intro: "Explore products organized around what you need.",
      items:
        "New Arrivals | The latest products added to the shop.\nBest Sellers | Customer favorites and proven picks.\nEssentials | Everyday products worth keeping close.\nLimited Edition | Special releases available while they last."
    },

    "store-promo": {
      label: "Store Promo",
      title: "Something Special Is Here",
      body: "Highlight a sale, new release, seasonal collection, or limited-time offer.",
      buttonText: "Shop the Offer",
      linkType: "none",
      linkTarget: "",
      linkUrl: ""
    }

  };


  const definition =
    definitions[type];

  if (!definition) return;


  siteSections.push({
    id,
    type,
    custom: true,

    label: definition.label,

    enabled: true,

    showInNav:
      (
        type === "menu" &&
        selectedSiteTemplate === "restaurant"
      ) ||
      (
        ["process", "team"].includes(type) &&
        selectedSiteTemplate === "professional"
      ) ||
      (
        ["products", "collections"].includes(type) &&
        selectedSiteTemplate === "retail"
      ),

    navLabel:
      type === "menu"
        ? "Menu"
        : type === "process"
          ? "Process"
          : type === "team"
            ? "Team"
            : type === "products"
              ? "Products"
              : type === "collections"
                ? "Collections"
                : definition.label,

    background: "default",
    backgroundImage: "",

    content: {
      ...definition
    }
  });


  renderSectionManager();

}



document
  .querySelectorAll("[data-add-section]")
  .forEach(button => {

    button.addEventListener("click", () => {

      createCustomSection(
        button.dataset.addSection
      );

    });

  });



/* -------------------------------------------------
   STRUCTURED LINK CONTROLS
-------------------------------------------------- */

function getLinkableSections() {

  return siteProject.pages.flatMap(page =>

    (page.sections || [])
      .filter(section =>
        section.enabled &&
        canSectionAppearInNav(section)
      )
      .map(section => ({
        page,
        section
      }))

  );

}


function renderStructuredLinkFields(
  section,
  fallbackType = "none"
) {

  const content =
    section.content || {};


  const linkType =
    content.linkType ||
    fallbackType;


  const pageOptions =
    siteProject.pages
      .map(page => `

        <option
          value="${escapeHTML(page.id)}"
          ${
            content.linkTarget === page.id
              ? "selected"
              : ""
          }
        >
          ${escapeHTML(page.title)}
        </option>

      `)
      .join("");


  const sectionOptions =
    getLinkableSections()
      .map(({ page, section: targetSection }) => {

        const value =
          `${page.id}:${targetSection.id}`;

        const label =
          `${page.title} — ${
            targetSection.navLabel ||
            targetSection.label
          }`;

        return `

          <option
            value="${escapeHTML(value)}"
            ${
              content.linkTarget === value
                ? "selected"
                : ""
            }
          >
            ${escapeHTML(label)}
          </option>

        `;

      })
      .join("");


  return `

    <div
      class="structured-link-fields"
      data-link-controls="${section.id}"
    >

      <label>
        Link Type

        <select
          data-custom-field="${section.id}"
          data-field-name="linkType"
          data-link-type-control="${section.id}"
        >

          <option
            value="none"
            ${
              linkType === "none"
                ? "selected"
                : ""
            }
          >
            None
          </option>

          <option
            value="section"
            ${
              linkType === "section"
                ? "selected"
                : ""
            }
          >
            Section
          </option>

          <option
            value="page"
            ${
              linkType === "page"
                ? "selected"
                : ""
            }
          >
            Page
          </option>

          <option
            value="external"
            ${
              linkType === "external"
                ? "selected"
                : ""
            }
          >
            External URL
          </option>

        </select>

      </label>


      <label
        data-link-panel="page"
        ${
          linkType === "page"
            ? ""
            : "hidden"
        }
      >
        Page

        <select
          data-custom-field="${section.id}"
          data-field-name="linkTarget"
        >

          <option value="">
            Choose a page
          </option>

          ${pageOptions}

        </select>

      </label>


      <label
        data-link-panel="section"
        ${
          linkType === "section"
            ? ""
            : "hidden"
        }
      >
        Section

        <select
          data-custom-field="${section.id}"
          data-field-name="linkTarget"
        >

          <option value="">
            Choose a section
          </option>

          ${sectionOptions}

        </select>

      </label>


      <label
        data-link-panel="external"
        ${
          linkType === "external"
            ? ""
            : "hidden"
        }
      >
        External URL

        <input
          type="url"
          data-custom-field="${section.id}"
          data-field-name="linkUrl"
          value="${escapeHTML(
            content.linkUrl || ""
          )}"
        >

      </label>

    </div>

  `;

}


function resolveStructuredLink(
  content = {},
  fallbackHref = ""
) {

  const type =
    content.linkType || "none";


  if (type === "none") {

    return fallbackHref;

  }


  if (type === "page") {

    const page =
      siteProject.pages.find(
        item =>
          item.id ===
          content.linkTarget
      );

    if (!page) {
      return fallbackHref;
    }


    return page.slug === "index"
      ? "index.html"
      : `${page.slug}.html`;

  }


  if (type === "section") {

    const [
      pageId,
      sectionId
    ] =
      String(
        content.linkTarget || ""
      ).split(":");


    const page =
      siteProject.pages.find(
        item =>
          item.id === pageId
      );


    if (
      !page ||
      !sectionId
    ) {

      return fallbackHref;

    }


    const anchor =
      `#pg-${sectionId}`;


    if (
      page.id === activePageId
    ) {

      return anchor;

    }


    const filename =
      page.slug === "index"
        ? "index.html"
        : `${page.slug}.html`;


    return `${filename}${anchor}`;

  }


  if (type === "external") {

    return (
      content.linkUrl?.trim() ||
      fallbackHref
    );

  }


  return fallbackHref;

}


function structuredLinkOpensNewTab(
  content = {}
) {

  return (
    content.linkType === "external" &&
    Boolean(
      content.linkUrl?.trim()
    )
  );

}



function parseProductItems(content = {}) {

  if (
    Array.isArray(content.productItems)
  ) {

    return content.productItems;

  }


  return splitLines(
    content.items || ""
  )
    .map(line => {

      const parts =
        line
          .split("|")
          .map(part =>
            part.trim()
          );


      return {

        id:
          crypto.randomUUID
            ? crypto.randomUUID()
            : `product-${Date.now()}-${Math.random()}`,

        name:
          parts[0] || "",

        description:
          parts[1] || "",

        price:
          parts[2] || "",

        linkType:
          parts[3]
            ? "external"
            : "none",

        linkTarget: "",

        linkUrl:
          parts[3] || ""

      };

    })
    .filter(item =>
      item.name
    );

}


function parseCollectionItems(content = {}) {

  if (
    Array.isArray(content.collectionItems)
  ) {

    return content.collectionItems;

  }


  return splitLines(
    content.items || ""
  )
    .map(line => {

      const parts =
        line
          .split("|")
          .map(part =>
            part.trim()
          );


      return {

        id:
          crypto.randomUUID
            ? crypto.randomUUID()
            : `collection-${Date.now()}-${Math.random()}`,

        name:
          parts[0] || "",

        description:
          parts[1] || "",

        linkType: "none",
        linkTarget: "",
        linkUrl: ""

      };

    })
    .filter(item =>
      item.name
    );

}


function resolveItemLink(
  item = {},
  fallbackHref = ""
) {

  return resolveStructuredLink(
    {
      linkType:
        item.linkType,

      linkTarget:
        item.linkTarget,

      linkUrl:
        item.linkUrl
    },
    fallbackHref
  );

}


function renderItemLinkFields(
  section,
  item,
  itemType
) {

  const pageOptions =
    siteProject.pages
      .map(page => `

        <option
          value="${escapeHTML(page.id)}"
          ${
            item.linkTarget === page.id
              ? "selected"
              : ""
          }
        >
          ${escapeHTML(page.title)}
        </option>

      `)
      .join("");


  const sectionOptions =
    getLinkableSections()
      .map(({ page, section: targetSection }) => {

        const value =
          `${page.id}:${targetSection.id}`;

        const label =
          `${page.title} — ${
            targetSection.navLabel ||
            targetSection.label
          }`;

        return `

          <option
            value="${escapeHTML(value)}"
            ${
              item.linkTarget === value
                ? "selected"
                : ""
            }
          >
            ${escapeHTML(label)}
          </option>

        `;

      })
      .join("");


  return `

    <div
      class="structured-link-fields item-link-fields"
      data-item-link-controls="${item.id}"
    >

      <label>
        Link Type

        <select
          data-item-field="${section.id}"
          data-item-type="${itemType}"
          data-item-id="${item.id}"
          data-item-field-name="linkType"
          data-item-link-type="${item.id}"
        >

          <option
            value="none"
            ${
              item.linkType === "none"
                ? "selected"
                : ""
            }
          >
            None
          </option>

          <option
            value="page"
            ${
              item.linkType === "page"
                ? "selected"
                : ""
            }
          >
            Page
          </option>

          <option
            value="section"
            ${
              item.linkType === "section"
                ? "selected"
                : ""
            }
          >
            Section
          </option>

          <option
            value="external"
            ${
              item.linkType === "external"
                ? "selected"
                : ""
            }
          >
            External URL
          </option>

        </select>

      </label>


      <label
        data-item-link-panel="page"
        ${
          item.linkType === "page"
            ? ""
            : "hidden"
        }
      >
        Page

        <select
          data-item-field="${section.id}"
          data-item-type="${itemType}"
          data-item-id="${item.id}"
          data-item-field-name="linkTarget"
        >
          <option value="">Choose a page</option>
          ${pageOptions}
        </select>

      </label>


      <label
        data-item-link-panel="section"
        ${
          item.linkType === "section"
            ? ""
            : "hidden"
        }
      >
        Section

        <select
          data-item-field="${section.id}"
          data-item-type="${itemType}"
          data-item-id="${item.id}"
          data-item-field-name="linkTarget"
        >
          <option value="">Choose a section</option>
          ${sectionOptions}
        </select>

      </label>


      <label
        data-item-link-panel="external"
        ${
          item.linkType === "external"
            ? ""
            : "hidden"
        }
      >
        URL

        <input
          type="url"
          data-item-field="${section.id}"
          data-item-type="${itemType}"
          data-item-id="${item.id}"
          data-item-field-name="linkUrl"
          value="${escapeHTML(
            item.linkUrl || ""
          )}"
        >

      </label>

    </div>

  `;

}


function renderCustomSectionFields(section) {

  const content =
    section.content || {};


  if (section.type === "text-image") {

    return `
      <div class="custom-section-fields">

        <label>
          Heading
          <input
            type="text"
            data-custom-field="${section.id}"
            data-field-name="title"
            value="${escapeHTML(content.title || "")}"
          >
        </label>

        <label>
          Text
          <textarea
            rows="4"
            data-custom-field="${section.id}"
            data-field-name="body"
          >${escapeHTML(content.body || "")}</textarea>
        </label>

        <label>
          Image
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            data-custom-content-image="${section.id}"
          >
        </label>

      </div>
    `;

  }


  if (section.type === "features") {

    return `
      <div class="custom-section-fields">

        <label>
          Heading
          <input
            type="text"
            data-custom-field="${section.id}"
            data-field-name="title"
            value="${escapeHTML(content.title || "")}"
          >
        </label>

        <label>
          Features
          <textarea
            rows="6"
            data-custom-field="${section.id}"
            data-field-name="items"
          >${escapeHTML(content.items || "")}</textarea>
        </label>

        <span class="field-hint">
          One per line: Title | Description
        </span>

      </div>
    `;

  }


  if (section.type === "promo") {

    return `
      <div class="custom-section-fields">

        <label>
          Heading
          <input
            type="text"
            data-custom-field="${section.id}"
            data-field-name="title"
            value="${escapeHTML(content.title || "")}"
          >
        </label>

        <label>
          Text
          <textarea
            rows="3"
            data-custom-field="${section.id}"
            data-field-name="body"
          >${escapeHTML(content.body || "")}</textarea>
        </label>

        <label>
          Button Text
          <input
            type="text"
            data-custom-field="${section.id}"
            data-field-name="buttonText"
            value="${escapeHTML(content.buttonText || "")}"
          >
        </label>

      </div>
    `;

  }


  if (section.type === "trust") {

    return `
      <div class="custom-section-fields">

        <label>
          Heading
          <input
            type="text"
            data-custom-field="${section.id}"
            data-field-name="title"
            value="${escapeHTML(content.title || "")}"
          >
        </label>

        <label>
          Trust Items
          <textarea
            rows="5"
            data-custom-field="${section.id}"
            data-field-name="items"
          >${escapeHTML(content.items || "")}</textarea>
        </label>

        <span class="field-hint">
          One trust item per line.
        </span>

      </div>
    `;

  }


  if (section.type === "menu") {

    return `
      <div class="custom-section-fields">

        <label>
          Heading
          <input
            type="text"
            data-custom-field="${section.id}"
            data-field-name="title"
            value="${escapeHTML(content.title || "")}"
          >
        </label>

        <label>
          Intro
          <textarea
            rows="3"
            data-custom-field="${section.id}"
            data-field-name="intro"
          >${escapeHTML(content.intro || "")}</textarea>
        </label>

        <label>
          Menu Items
          <textarea
            rows="10"
            data-custom-field="${section.id}"
            data-field-name="items"
          >${escapeHTML(content.items || "")}</textarea>
        </label>

        <span class="field-hint">
          One per line: Category | Item | Description | Price
        </span>

      </div>
    `;

  }


  if (section.type === "featured-dish") {

    return `
      <div class="custom-section-fields">

        <label>
          Dish Name
          <input
            type="text"
            data-custom-field="${section.id}"
            data-field-name="title"
            value="${escapeHTML(content.title || "")}"
          >
        </label>

        <label>
          Description
          <textarea
            rows="4"
            data-custom-field="${section.id}"
            data-field-name="body"
          >${escapeHTML(content.body || "")}</textarea>
        </label>

        <label>
          Price
          <input
            type="text"
            data-custom-field="${section.id}"
            data-field-name="price"
            value="${escapeHTML(content.price || "")}"
          >
        </label>

        <label>
          Dish Image
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            data-custom-content-image="${section.id}"
          >
        </label>

      </div>
    `;

  }


  if (section.type === "reservation") {

    return `
      <div class="custom-section-fields">

        <label>
          Heading
          <input
            type="text"
            data-custom-field="${section.id}"
            data-field-name="title"
            value="${escapeHTML(content.title || "")}"
          >
        </label>

        <label>
          Text
          <textarea
            rows="3"
            data-custom-field="${section.id}"
            data-field-name="body"
          >${escapeHTML(content.body || "")}</textarea>
        </label>

        <label>
          Button Text
          <input
            type="text"
            data-custom-field="${section.id}"
            data-field-name="buttonText"
            value="${escapeHTML(content.buttonText || "")}"
          >
        </label>

        <label>
          Reservation URL
          <input
            type="url"
            data-custom-field="${section.id}"
            data-field-name="link"
            value="${escapeHTML(content.link || "")}"
          >
        </label>

        <span class="field-hint">
          Leave URL blank to use the business phone number.
        </span>

        ${renderStructuredLinkFields(
          section,
          "none"
        )}

      </div>
    `;

  }


  if (section.type === "credentials") {

    return `
      <div class="custom-section-fields">

        <label>
          Heading
          <input
            type="text"
            data-custom-field="${section.id}"
            data-field-name="title"
            value="${escapeHTML(content.title || "")}"
          >
        </label>

        <label>
          Intro
          <textarea
            rows="3"
            data-custom-field="${section.id}"
            data-field-name="intro"
          >${escapeHTML(content.intro || "")}</textarea>
        </label>

        <label>
          Credentials
          <textarea
            rows="8"
            data-custom-field="${section.id}"
            data-field-name="items"
          >${escapeHTML(content.items || "")}</textarea>
        </label>

        <span class="field-hint">
          One per line: Credential | Detail
        </span>

      </div>
    `;

  }


  if (section.type === "process") {

    return `
      <div class="custom-section-fields">

        <label>
          Heading
          <input
            type="text"
            data-custom-field="${section.id}"
            data-field-name="title"
            value="${escapeHTML(content.title || "")}"
          >
        </label>

        <label>
          Intro
          <textarea
            rows="3"
            data-custom-field="${section.id}"
            data-field-name="intro"
          >${escapeHTML(content.intro || "")}</textarea>
        </label>

        <label>
          Steps
          <textarea
            rows="8"
            data-custom-field="${section.id}"
            data-field-name="items"
          >${escapeHTML(content.items || "")}</textarea>
        </label>

        <span class="field-hint">
          One per line: Step | Description
        </span>

      </div>
    `;

  }


  if (section.type === "team") {

    return `
      <div class="custom-section-fields">

        <label>
          Heading
          <input
            type="text"
            data-custom-field="${section.id}"
            data-field-name="title"
            value="${escapeHTML(content.title || "")}"
          >
        </label>

        <label>
          Intro
          <textarea
            rows="3"
            data-custom-field="${section.id}"
            data-field-name="intro"
          >${escapeHTML(content.intro || "")}</textarea>
        </label>

        <label>
          Team Members
          <textarea
            rows="9"
            data-custom-field="${section.id}"
            data-field-name="items"
          >${escapeHTML(content.items || "")}</textarea>
        </label>

        <span class="field-hint">
          One per line: Name | Role | Short Bio
        </span>

      </div>
    `;

  }


  if (section.type === "products") {

    const products =
      parseProductItems(content);


    /*
      Migrate old pipe-delimited products into
      structured items the first time they're edited.
    */

    if (
      !Array.isArray(
        content.productItems
      )
    ) {

      content.productItems =
        products;

    }


    return `
      <div class="custom-section-fields">

        <label>
          Heading

          <input
            type="text"
            data-custom-field="${section.id}"
            data-field-name="title"
            value="${escapeHTML(content.title || "")}"
          >
        </label>


        <label>
          Intro

          <textarea
            rows="3"
            data-custom-field="${section.id}"
            data-field-name="intro"
          >${escapeHTML(content.intro || "")}</textarea>
        </label>


        <div class="structured-item-editor">

          <div class="structured-item-header">

            <div>
              <strong>Products</strong>

              <small>
                Add products and choose where each one links.
              </small>
            </div>

            <button
              type="button"
              class="structured-item-add"
              data-add-structured-item="${section.id}"
              data-item-type="product"
            >
              + Add Product
            </button>

          </div>


          <div class="structured-item-list">

            ${products.map((product, index) => `

              <div
                class="structured-item-card"
                data-structured-item="${product.id}"
              >

                <div class="structured-item-card-header">

                  <strong>
                    Product ${index + 1}
                  </strong>

                  <button
                    type="button"
                    class="structured-item-remove"
                    data-remove-structured-item="${section.id}"
                    data-item-type="product"
                    data-item-id="${product.id}"
                    title="Remove product"
                    aria-label="Remove product"
                  >
                    ×
                  </button>

                </div>


                <label>
                  Product Name

                  <input
                    type="text"
                    data-item-field="${section.id}"
                    data-item-type="product"
                    data-item-id="${product.id}"
                    data-item-field-name="name"
                    value="${escapeHTML(product.name || "")}"
                  >
                </label>


                <label>
                  Description

                  <textarea
                    rows="3"
                    data-item-field="${section.id}"
                    data-item-type="product"
                    data-item-id="${product.id}"
                    data-item-field-name="description"
                  >${escapeHTML(product.description || "")}</textarea>
                </label>


                <label>
                  Price

                  <input
                    type="text"
                    data-item-field="${section.id}"
                    data-item-type="product"
                    data-item-id="${product.id}"
                    data-item-field-name="price"
                    value="${escapeHTML(product.price || "")}"
                  >
                </label>


                ${renderItemLinkFields(
                  section,
                  product,
                  "product"
                )}

              </div>

            `).join("")}

          </div>

        </div>

      </div>
    `;

  }


  if (section.type === "collections") {

    const collections =
      parseCollectionItems(content);


    if (
      !Array.isArray(
        content.collectionItems
      )
    ) {

      content.collectionItems =
        collections;

    }


    return `
      <div class="custom-section-fields">

        <label>
          Heading

          <input
            type="text"
            data-custom-field="${section.id}"
            data-field-name="title"
            value="${escapeHTML(content.title || "")}"
          >
        </label>


        <label>
          Intro

          <textarea
            rows="3"
            data-custom-field="${section.id}"
            data-field-name="intro"
          >${escapeHTML(content.intro || "")}</textarea>
        </label>


        <div class="structured-item-editor">

          <div class="structured-item-header">

            <div>
              <strong>Collections</strong>

              <small>
                Link each collection to another page, section, or URL.
              </small>
            </div>

            <button
              type="button"
              class="structured-item-add"
              data-add-structured-item="${section.id}"
              data-item-type="collection"
            >
              + Add Collection
            </button>

          </div>


          <div class="structured-item-list">

            ${collections.map((collection, index) => `

              <div
                class="structured-item-card"
                data-structured-item="${collection.id}"
              >

                <div class="structured-item-card-header">

                  <strong>
                    Collection ${index + 1}
                  </strong>

                  <button
                    type="button"
                    class="structured-item-remove"
                    data-remove-structured-item="${section.id}"
                    data-item-type="collection"
                    data-item-id="${collection.id}"
                    title="Remove collection"
                    aria-label="Remove collection"
                  >
                    ×
                  </button>

                </div>


                <label>
                  Collection Name

                  <input
                    type="text"
                    data-item-field="${section.id}"
                    data-item-type="collection"
                    data-item-id="${collection.id}"
                    data-item-field-name="name"
                    value="${escapeHTML(collection.name || "")}"
                  >
                </label>


                <label>
                  Description

                  <textarea
                    rows="3"
                    data-item-field="${section.id}"
                    data-item-type="collection"
                    data-item-id="${collection.id}"
                    data-item-field-name="description"
                  >${escapeHTML(collection.description || "")}</textarea>
                </label>


                ${renderItemLinkFields(
                  section,
                  collection,
                  "collection"
                )}

              </div>

            `).join("")}

          </div>

        </div>

      </div>
    `;

  }


  if (section.type === "store-promo") {

    return `
      <div class="custom-section-fields">

        <label>
          Heading
          <input
            type="text"
            data-custom-field="${section.id}"
            data-field-name="title"
            value="${escapeHTML(content.title || "")}"
          >
        </label>

        <label>
          Text
          <textarea
            rows="4"
            data-custom-field="${section.id}"
            data-field-name="body"
          >${escapeHTML(content.body || "")}</textarea>
        </label>

        <label>
          Button Text
          <input
            type="text"
            data-custom-field="${section.id}"
            data-field-name="buttonText"
            value="${escapeHTML(content.buttonText || "")}"
          >
        </label>

        ${renderStructuredLinkFields(
          section,
          "none"
        )}

      </div>
    `;

  }


  return "";

}



sectionManager.addEventListener(
  "change",
  event => {

    const navToggle =
      event.target.closest("[data-section-nav]");

    if (!navToggle) return;

    const section =
      siteSections.find(
        item =>
          item.id === navToggle.dataset.sectionNav
      );

    if (!section) return;

    section.showInNav =
      navToggle.checked;

  }
);


sectionManager.addEventListener(
  "input",
  event => {

    const navLabelInput =
      event.target.closest(
        "[data-section-nav-label]"
      );

    if (!navLabelInput) return;

    const section =
      siteSections.find(
        item =>
          item.id ===
          navLabelInput.dataset.sectionNavLabel
      );

    if (!section) return;

    section.navLabel =
      navLabelInput.value;

  }
);



const pageManager =
  document.querySelector(
    "#page-manager"
  );

const addPageButton =
  document.querySelector(
    "#add-page"
  );


function renderPageManager() {

  if (!pageManager) return;


  pageManager.innerHTML =
    siteProject.pages
      .map(page => `

        <div
          class="
            page-manager-item
            ${page.id === activePageId ? "active" : ""}
          "
          data-page-id="${page.id}"
        >

          <div class="page-manager-main">

            <button
              type="button"
              class="page-manager-select"
              data-page-select="${page.id}"
            >

              <span class="page-manager-name">
                ${escapeHTML(page.title)}
              </span>

              <small>
                ${
                  page.slug === "index"
                    ? "index.html"
                    : `${escapeHTML(page.slug)}.html`
                }
              </small>

            </button>


            ${
              page.id === activePageId
                ? `
                  <div class="page-manager-settings">

                    <label>
                      Page name
                      <input
                        type="text"
                        data-page-title="${page.id}"
                        value="${escapeHTML(page.title)}"
                      >
                    </label>

                    <label>
                      Navigation label
                      <input
                        type="text"
                        data-page-nav-label="${page.id}"
                        value="${escapeHTML(page.navLabel || page.title)}"
                        maxlength="24"
                      >
                    </label>

                    ${
                      page.locked
                        ? `
                          <span class="field-hint">
                            Home always exports as index.html.
                          </span>
                        `
                        : `
                          <label>
                            Page slug
                            <input
                              type="text"
                              data-page-slug="${page.id}"
                              value="${escapeHTML(page.slug)}"
                            >
                          </label>
                        `
                    }

                    <label class="section-nav-toggle">
                      <input
                        type="checkbox"
                        data-page-show-nav="${page.id}"
                        ${page.showInNav ? "checked" : ""}
                      >
                      <span>Show page in navigation</span>
                    </label>

                  </div>
                `
                : ""
            }

          </div>


          ${
            page.locked
              ? `
                <span
                  class="page-manager-home"
                  title="Home page"
                >
                  Home
                </span>
              `
              : `
                <button
                  type="button"
                  class="page-manager-delete"
                  data-page-delete="${page.id}"
                  aria-label="Delete ${escapeHTML(page.title)}"
                  title="Delete page"
                >
                  ×
                </button>
              `
          }

        </div>

      `)
      .join("");

}


pageManager?.addEventListener(
  "input",
  event => {

    const titleInput =
      event.target.closest(
        "[data-page-title]"
      );

    if (titleInput) {

      const page =
        siteProject.pages.find(
          item =>
            item.id ===
            titleInput.dataset.pageTitle
        );

      if (!page) return;


      page.title =
        titleInput.value || "Untitled Page";


      if (!page.locked) {

        page.slug =
          slugifyPageTitle(
            titleInput.value
          );

      }


      if (
        !page.navLabel ||
        page.navLabel === "New Page" ||
        /^Page \d+$/.test(page.navLabel)
      ) {

        page.navLabel =
          titleInput.value || "Page";

      }


      scheduleLivePreview();

      return;

    }


    const navLabelInput =
      event.target.closest(
        "[data-page-nav-label]"
      );

    if (navLabelInput) {

      const page =
        siteProject.pages.find(
          item =>
            item.id ===
            navLabelInput.dataset.pageNavLabel
        );

      if (!page) return;


      page.navLabel =
        navLabelInput.value;

      scheduleLivePreview();

      return;

    }


    const slugInput =
      event.target.closest(
        "[data-page-slug]"
      );

    if (slugInput) {

      const page =
        siteProject.pages.find(
          item =>
            item.id ===
            slugInput.dataset.pageSlug
        );

      if (
        !page ||
        page.locked
      ) {
        return;
      }


      page.slug =
        slugifyPageTitle(
          slugInput.value
        );

      scheduleLivePreview();

    }

  }
);


pageManager?.addEventListener(
  "change",
  event => {

    const navToggle =
      event.target.closest(
        "[data-page-show-nav]"
      );

    if (!navToggle) return;


    const page =
      siteProject.pages.find(
        item =>
          item.id ===
          navToggle.dataset.pageShowNav
      );

    if (!page) return;


    page.showInNav =
      navToggle.checked;

    scheduleLivePreview();

  }
);



pageManager?.addEventListener(
  "click",
  event => {

    const select =
      event.target.closest(
        "[data-page-select]"
      );


    if (select) {

      switchSitePage(
        select.dataset.pageSelect
      );

      return;

    }


    const deleteButton =
      event.target.closest(
        "[data-page-delete]"
      );


    if (!deleteButton) return;


    const pageId =
      deleteButton.dataset.pageDelete;


    const page =
      siteProject.pages.find(
        item => item.id === pageId
      );


    if (
      !page ||
      page.locked
    ) {
      return;
    }


    siteProject.pages =
      siteProject.pages.filter(
        item => item.id !== pageId
      );


    if (activePageId === pageId) {

      activePageId = "home";
      siteSections =
        siteProject.pages[0].sections;

    }


    renderPageManager();
    renderSectionManager();


    if (siteHasBeenGenerated) {

      pendingLiveRefresh = true;
      form.requestSubmit();

    }

  }
);


const pageTypeMenu =
  document.querySelector(
    "#page-type-menu"
  );


addPageButton?.addEventListener(
  "click",
  () => {

    if (!pageTypeMenu) return;

    pageTypeMenu.hidden =
      !pageTypeMenu.hidden;

  }
);


pageTypeMenu?.addEventListener(
  "click",
  event => {

    const choice =
      event.target.closest(
        "[data-page-type]"
      );

    if (!choice) return;


    const pageType =
      choice.dataset.pageType;


    const titles = {
      blank: "New Page",
      about: "About",
      services: "Services",
      collection: "Collections",
      gallery: "Gallery",
      contact: "Contact"
    };


    let title =
      titles[pageType] ||
      "New Page";


    /*
      Avoid duplicate default names.
    */

    const baseTitle =
      title;

    let suffix = 2;


    while (
      siteProject.pages.some(
        page =>
          page.title.toLowerCase() ===
          title.toLowerCase()
      )
    ) {

      title =
        `${baseTitle} ${suffix}`;

      suffix += 1;

    }


    const page =
      createSitePage(
        title,
        pageType
      );


    pageTypeMenu.hidden = true;


    switchSitePage(
      page.id
    );

  }
);



function renderSectionManager() {

  if (!sectionManager) return;

  sectionManager.innerHTML = siteSections
    .map((section, index) => `

      <div
        class="section-manager-item"
        data-manager-section="${section.id}"
      >

        <div class="section-manager-main">

          <span
            class="section-drag-handle"
            draggable="true"
            data-section-drag="${section.id}"
            title="Drag to reorder"
            aria-label="Drag ${section.label} to reorder"
          >
            ⋮⋮
          </span>

          <input
            class="section-manager-toggle"
            type="checkbox"
            data-section-enabled="${section.id}"
            ${section.enabled ? "checked" : ""}
            aria-label="Show ${section.label}"
          >

          <span class="section-manager-name">
            ${section.label}
          </span>

          <button
            class="section-move"
            type="button"
            data-section-up="${section.id}"
            ${index === 0 ? "disabled" : ""}
            aria-label="Move ${section.label} up"
          >
            ↑
          </button>

          <button
            class="section-move"
            type="button"
            data-section-down="${section.id}"
            ${index === siteSections.length - 1 ? "disabled" : ""}
            aria-label="Move ${section.label} down"
          >
            ↓
          </button>

          <button
            class="section-design-toggle"
            type="button"
            data-section-design="${section.id}"
            aria-label="Design ${section.label}"
          >
            ◇
          </button>

        </div>


        <div class="section-manager-design">

          ${
            section.custom
              ? renderCustomSectionFields(section)
              : ""
          }


          ${
            canSectionAppearInNav(section)

              ? `

                <div class="section-nav-settings">

                  <label class="section-nav-toggle">

                    <input
                      type="checkbox"
                      data-section-nav="${section.id}"
                      ${section.showInNav ? "checked" : ""}
                    >

                    <span>
                      Show in navigation
                    </span>

                  </label>


                  <label>

                    Navigation label

                    <input
                      type="text"
                      data-section-nav-label="${section.id}"
                      value="${escapeHTML(
                        section.navLabel || section.label
                      )}"
                      maxlength="24"
                    >

                  </label>

                </div>

              `

              : ""
          }


          <span class="section-background-label">
            Background
          </span>

          <div class="section-background-options">

            ${["default", "brand", "image"]
              .map(option => `

                <button
                  class="
                    section-bg-option
                    ${section.background === option ? "active" : ""}
                  "
                  type="button"
                  data-section-bg="${section.id}"
                  data-bg-value="${option}"
                >
                  ${
                    option === "default"
                      ? "Default"
                      : option === "brand"
                        ? "Brand"
                        : "Image"
                  }
                </button>

              `)
              .join("")}

          </div>


          <div
            class="
              section-image-upload
              ${section.background === "image" ? "visible" : ""}
            "
          >

            <label>
              Upload background image

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                data-section-image="${section.id}"
              >
            </label>

            ${
              section.backgroundImage
                ? `
                  <img
                    class="section-bg-preview visible"
                    src="${section.backgroundImage}"
                    alt=""
                  >
                `
                : `
                  <img
                    class="section-bg-preview"
                    alt=""
                  >
                `
            }

          </div>

        </div>

      </div>

    `)
    .join("");


  bindSectionManager();
  bindSectionDragAndDrop();
}



function bindSectionDragAndDrop() {

  let draggedSectionId = null;
  let draggedRow = null;


  const placeholder =
    document.createElement("div");

  placeholder.className =
    "section-drop-placeholder";


  const removePlaceholder = () => {

    if (placeholder.parentNode) {
      placeholder.remove();
    }

  };


  const clearDraggingState = () => {

    sectionManager
      .querySelectorAll(
        ".section-manager-item"
      )
      .forEach(item => {

        item.classList.remove(
          "is-dragging"
        );

      });

    removePlaceholder();

  };


  sectionManager
    .querySelectorAll(
      "[data-section-drag]"
    )
    .forEach(handle => {

      handle.addEventListener(
        "dragstart",
        event => {

          draggedSectionId =
            handle.dataset.sectionDrag;

          draggedRow =
            handle.closest(
              ".section-manager-item"
            );


          if (!draggedRow) return;


          draggedRow.classList.add(
            "is-dragging"
          );


          /*
            Match the placeholder roughly to
            the collapsed row height so the
            list visibly opens a drop position.
          */

          placeholder.style.height =
            `${draggedRow.offsetHeight}px`;


          if (event.dataTransfer) {

            event.dataTransfer.effectAllowed =
              "move";

            event.dataTransfer.setData(
              "text/plain",
              draggedSectionId
            );

          }

        }
      );


      handle.addEventListener(
        "dragend",
        () => {

          draggedSectionId = null;
          draggedRow = null;

          clearDraggingState();

        }
      );

    });


  sectionManager.addEventListener(
    "dragover",
    event => {

      if (
        !draggedSectionId ||
        !draggedRow
      ) {
        return;
      }


      event.preventDefault();


      if (event.dataTransfer) {
        event.dataTransfer.dropEffect =
          "move";
      }


      const rows =
        [
          ...sectionManager.querySelectorAll(
            ".section-manager-item:not(.is-dragging)"
          )
        ];


      const nextRow =
        rows.find(row => {

          const rect =
            row.getBoundingClientRect();

          return (
            event.clientY <
            rect.top +
            rect.height / 2
          );

        });


      if (nextRow) {

        sectionManager.insertBefore(
          placeholder,
          nextRow
        );

      } else {

        sectionManager.appendChild(
          placeholder
        );

      }

    }
  );


  sectionManager.addEventListener(
    "drop",
    event => {

      if (
        !draggedSectionId ||
        !draggedRow
      ) {
        return;
      }


      event.preventDefault();


      const draggedIndex =
        siteSections.findIndex(
          section =>
            section.id ===
            draggedSectionId
        );


      if (draggedIndex === -1) {
        clearDraggingState();
        return;
      }


      /*
        Determine where the placeholder sits
        among the real section rows.
      */

      const children =
        [
          ...sectionManager.children
        ];


      const placeholderIndex =
        children.indexOf(
          placeholder
        );


      if (placeholderIndex === -1) {
        clearDraggingState();
        return;
      }


      /*
        Count only real section rows before
        the placeholder. The dragged row is
        excluded because it is being moved.
      */

      let insertIndex = 0;


      for (
        let i = 0;
        i < placeholderIndex;
        i += 1
      ) {

        const child =
          children[i];

        if (
          child.classList.contains(
            "section-manager-item"
          ) &&
          !child.classList.contains(
            "is-dragging"
          )
        ) {
          insertIndex += 1;
        }

      }


      const [movedSection] =
        siteSections.splice(
          draggedIndex,
          1
        );


      siteSections.splice(
        insertIndex,
        0,
        movedSection
      );


      draggedSectionId = null;
      draggedRow = null;


      clearDraggingState();

      renderSectionManager();


      /*
        Keep an already-generated preview
        synchronized with the new order.
      */

      if (
        preview.querySelector(
          ".pg-site"
        )
      ) {
        applySectionManager();
      }

    }
  );

}



function bindSectionManager() {

  sectionManager
    .querySelectorAll("[data-custom-field]")
    .forEach(input => {

      input.addEventListener("input", () => {

        const section =
          siteSections.find(
            item =>
              item.id === input.dataset.customField
          );

        if (!section) return;

        section.content[
          input.dataset.fieldName
        ] = input.value;

      });

    });


  sectionManager
    .querySelectorAll("[data-custom-content-image]")
    .forEach(input => {

      input.addEventListener("change", () => {

        const section =
          siteSections.find(
            item =>
              item.id === input.dataset.customContentImage
          );

        if (
          !section ||
          !input.files[0]
        ) {
          return;
        }

        readImageFile(
          input.files[0],
          dataURL => {

            section.content.image =
              dataURL;

          }
        );

      });

    });


  sectionManager
    .querySelectorAll("[data-section-enabled]")
    .forEach(input => {

      input.addEventListener("change", () => {

        const section =
          siteSections.find(
            item =>
              item.id === input.dataset.sectionEnabled
          );

        if (!section) return;

        section.enabled = input.checked;

      });

    });


  sectionManager
    .querySelectorAll("[data-section-up]")
    .forEach(button => {

      button.addEventListener("click", () => {

        moveSiteSection(
          button.dataset.sectionUp,
          -1
        );

      });

    });


  sectionManager
    .querySelectorAll("[data-section-down]")
    .forEach(button => {

      button.addEventListener("click", () => {

        moveSiteSection(
          button.dataset.sectionDown,
          1
        );

      });

    });


  sectionManager
    .querySelectorAll("[data-section-design]")
    .forEach(button => {

      button.addEventListener("click", () => {

        const item =
          button.closest(".section-manager-item");

        if (!item) return;

        item.classList.toggle("design-open");

      });

    });


  sectionManager
    .querySelectorAll("[data-section-bg]")
    .forEach(button => {

      button.addEventListener("click", () => {

        const section =
          siteSections.find(
            item =>
              item.id === button.dataset.sectionBg
          );

        if (!section) return;

        section.background =
          button.dataset.bgValue;

        renderSectionManager();

      });

    });


  sectionManager
    .querySelectorAll("[data-section-image]")
    .forEach(input => {

      input.addEventListener("change", () => {

        const section =
          siteSections.find(
            item =>
              item.id === input.dataset.sectionImage
          );

        if (!section || !input.files[0]) return;

        readImageFile(
          input.files[0],
          dataURL => {

            section.backgroundImage =
              dataURL;

            section.background =
              "image";

            renderSectionManager();

          }
        );

      });

    });

}



function moveSiteSection(id, direction) {

  const index =
    siteSections.findIndex(
      section => section.id === id
    );

  if (index === -1) return;

  const targetIndex =
    index + direction;

  if (
    targetIndex < 0 ||
    targetIndex >= siteSections.length
  ) {
    return;
  }

  [
    siteSections[index],
    siteSections[targetIndex]
  ] = [
    siteSections[targetIndex],
    siteSections[index]
  ];

  renderSectionManager();

}



renderSectionManager();



/* -------------------------------------------------
   BUILDER SECTIONS
------------------------------------------------- */

document
  .querySelectorAll(".form-section")
  .forEach((section, index) => {
    section.classList.toggle("collapsed", index !== 0);
  });

document
  .querySelectorAll("[data-section-toggle]")
  .forEach(button => {

    button.addEventListener("click", () => {

      const section =
        button.closest(".form-section");

      if (!section) return;

      section.classList.toggle("collapsed");

    });

  });



function renderCustomSections() {

  const generatedSite =
    preview.querySelector(".pg-site");

  if (!generatedSite) return;


  siteSections
    .filter(section => section.custom)
    .forEach(section => {

      const content =
        section.content || {};

      let html = "";


      if (section.type === "text-image") {

        html = `
          <section
            class="pg-section pg-custom-section"
            data-site-section="${section.id}"
          >

            <div class="pg-container pg-custom-split">

              <div>

                <div class="pg-eyebrow">
                  <span class="pg-eyebrow-dot"></span>
                  More About Us
                </div>

                <h2 class="pg-custom-heading">
                  ${escapeHTML(content.title || "")}
                </h2>

                <p class="pg-custom-copy">
                  ${escapeHTML(content.body || "")}
                </p>

              </div>

              ${
                content.image
                  ? `
                    <div class="pg-custom-image">

                      <img
                        src="${content.image}"
                        alt=""
                      >

                    </div>
                  `
                  : `
                    <div class="pg-custom-placeholder">
                      Add an image in SyteByte
                    </div>
                  `
              }

            </div>

          </section>
        `;

      }


      if (section.type === "features") {

        const items =
          splitPairs(content.items || "");

        html = `
          <section
            class="pg-section pg-section-soft pg-custom-section"
            data-site-section="${section.id}"
          >

            <div class="pg-container">

              <div class="pg-section-heading">

                <div class="pg-eyebrow">
                  <span class="pg-eyebrow-dot"></span>
                  Why Choose Us
                </div>

                <h2>
                  ${escapeHTML(content.title || "")}
                </h2>

              </div>

              <div class="pg-custom-feature-grid">

                ${items.map((item, index) => `

                  <article class="pg-custom-feature">

                    <span>
                      ${String(index + 1).padStart(2, "0")}
                    </span>

                    <h3>
                      ${escapeHTML(item.first)}
                    </h3>

                    <p>
                      ${escapeHTML(item.second)}
                    </p>

                  </article>

                `).join("")}

              </div>

            </div>

          </section>
        `;

      }


      if (section.type === "promo") {

        html = `
          <section
            class="pg-custom-promo"
            data-site-section="${section.id}"
          >

            <div class="pg-container pg-custom-promo-inner">

              <div>

                <h2>
                  ${escapeHTML(content.title || "")}
                </h2>

                <p>
                  ${escapeHTML(content.body || "")}
                </p>

              </div>

              <a
                class="pg-button"
                href="${escapeHTML(promoHref)}"
                ${
                  promoExternal
                    ? `target="_blank" rel="noopener"`
                    : ""
                }
              >
                ${escapeHTML(content.buttonText || "Contact Us")}
              </a>

            </div>

          </section>
        `;

      }


      if (section.type === "trust") {

        const items =
          splitLines(content.items || "");

        html = `
          <section
            class="pg-custom-trust"
            data-site-section="${section.id}"
          >

            <div class="pg-container">

              <p class="pg-custom-trust-title">
                ${escapeHTML(content.title || "")}
              </p>

              <div class="pg-custom-trust-items">

                ${items.map(item => `

                  <span>
                    ✓ ${escapeHTML(item)}
                  </span>

                `).join("")}

              </div>

            </div>

          </section>
        `;

      }


      if (section.type === "menu") {

        const menuItems =
          splitLines(content.items || "")
            .map(line => {

              const parts =
                line.split("|")
                  .map(part => part.trim());

              return {
                category: parts[0] || "Menu",
                name: parts[1] || "",
                description: parts[2] || "",
                price: parts[3] || ""
              };

            })
            .filter(item => item.name);


        const categories = {};

        menuItems.forEach(item => {

          if (!categories[item.category]) {
            categories[item.category] = [];
          }

          categories[item.category].push(item);

        });


        html = `
          <section
            class="pg-section pg-restaurant-menu"
            data-site-section="${section.id}"
          >

            <div class="pg-container">

              <div class="pg-section-heading">

                <div class="pg-eyebrow">
                  <span class="pg-eyebrow-dot"></span>
                  Food & Drink
                </div>

                <h2>
                  ${escapeHTML(content.title || "Our Menu")}
                </h2>

                <p>
                  ${escapeHTML(content.intro || "")}
                </p>

              </div>


              <div class="pg-menu-categories">

                ${Object.entries(categories)
                  .map(([category, items]) => `

                    <div class="pg-menu-category">

                      <h3>
                        ${escapeHTML(category)}
                      </h3>

                      <div class="pg-menu-items">

                        ${items.map(item => `

                          <article class="pg-menu-item">

                            <div class="pg-menu-item-main">

                              <strong>
                                ${escapeHTML(item.name)}
                              </strong>

                              ${
                                item.description
                                  ? `
                                    <p>
                                      ${escapeHTML(item.description)}
                                    </p>
                                  `
                                  : ""
                              }

                            </div>

                            ${
                              item.price
                                ? `
                                  <span class="pg-menu-price">
                                    ${escapeHTML(item.price)}
                                  </span>
                                `
                                : ""
                            }

                          </article>

                        `).join("")}

                      </div>

                    </div>

                  `)
                  .join("")}

              </div>

            </div>

          </section>
        `;

      }


      if (section.type === "featured-dish") {

        html = `
          <section
            class="pg-section pg-featured-dish"
            data-site-section="${section.id}"
          >

            <div class="pg-container pg-featured-dish-grid">

              <div class="pg-featured-dish-copy">

                <div class="pg-eyebrow">
                  <span class="pg-eyebrow-dot"></span>
                  Featured
                </div>

                <h2>
                  ${escapeHTML(content.title || "")}
                </h2>

                <p>
                  ${escapeHTML(content.body || "")}
                </p>

                ${
                  content.price
                    ? `
                      <strong class="pg-featured-price">
                        ${escapeHTML(content.price)}
                      </strong>
                    `
                    : ""
                }

              </div>


              ${
                content.image
                  ? `
                    <div class="pg-featured-dish-image">

                      <img
                        src="${content.image}"
                        alt="${escapeHTML(
                          content.title ||
                          "Featured dish"
                        )}"
                      >

                    </div>
                  `
                  : `
                    <div class="pg-featured-dish-placeholder">
                      Add a dish photo in SyteByte
                    </div>
                  `
              }

            </div>

          </section>
        `;

      }


      if (section.type === "reservation") {

        const reservationHref =
          resolveStructuredLink(
            content,
            `tel:${currentGeneratedPhoneLink}`
          );

        const reservationExternal =
          structuredLinkOpensNewTab(
            content
          );


        html = `
          <section
            class="pg-restaurant-reservation"
            data-site-section="${section.id}"
          >

            <div class="pg-container pg-restaurant-reservation-inner">

              <div>

                <div class="pg-eyebrow">
                  <span class="pg-eyebrow-dot"></span>
                  Reservations
                </div>

                <h2>
                  ${escapeHTML(content.title || "")}
                </h2>

                <p>
                  ${escapeHTML(content.body || "")}
                </p>

              </div>


              <a
                class="pg-button"
                href="${reservationHref}"
                ${
                  reservationExternal
                    ? `target="_blank" rel="noopener"`
                    : ""
                }
              >
                ${escapeHTML(
                  content.buttonText ||
                  "Reserve a Table"
                )}
              </a>

            </div>

          </section>
        `;

      }


      if (section.type === "credentials") {

        const items =
          splitPairs(content.items || "");

        html = `
          <section
            class="pg-section pg-professional-credentials"
            data-site-section="${section.id}"
          >

            <div class="pg-container">

              <div class="pg-section-heading">
                <div class="pg-eyebrow">
                  <span class="pg-eyebrow-dot"></span>
                  Qualifications
                </div>

                <h2>${escapeHTML(content.title || "")}</h2>
                <p>${escapeHTML(content.intro || "")}</p>
              </div>

              <div class="pg-credential-grid">

                ${items.map(item => `
                  <article class="pg-credential-card">

                    <span class="pg-credential-mark">✓</span>

                    <div>
                      <h3>${escapeHTML(item.first)}</h3>
                      <p>${escapeHTML(item.second)}</p>
                    </div>

                  </article>
                `).join("")}

              </div>

            </div>

          </section>
        `;

      }


      if (section.type === "process") {

        const items =
          splitPairs(content.items || "");

        html = `
          <section
            class="pg-section pg-section-soft pg-professional-process"
            data-site-section="${section.id}"
          >

            <div class="pg-container">

              <div class="pg-section-heading">
                <div class="pg-eyebrow">
                  <span class="pg-eyebrow-dot"></span>
                  Our Process
                </div>

                <h2>${escapeHTML(content.title || "")}</h2>
                <p>${escapeHTML(content.intro || "")}</p>
              </div>

              <div class="pg-process-grid">

                ${items.map((item, index) => `
                  <article class="pg-process-step">

                    <span class="pg-process-number">
                      ${String(index + 1).padStart(2, "0")}
                    </span>

                    <h3>${escapeHTML(item.first)}</h3>
                    <p>${escapeHTML(item.second)}</p>

                  </article>
                `).join("")}

              </div>

            </div>

          </section>
        `;

      }


      if (section.type === "team") {

        const members =
          splitLines(content.items || "")
            .map(line => {

              const parts =
                line.split("|")
                  .map(part => part.trim());

              return {
                name: parts[0] || "",
                role: parts[1] || "",
                bio: parts[2] || ""
              };

            })
            .filter(member => member.name);


        html = `
          <section
            class="pg-section pg-professional-team"
            data-site-section="${section.id}"
          >

            <div class="pg-container">

              <div class="pg-section-heading">
                <div class="pg-eyebrow">
                  <span class="pg-eyebrow-dot"></span>
                  Our Team
                </div>

                <h2>${escapeHTML(content.title || "")}</h2>
                <p>${escapeHTML(content.intro || "")}</p>
              </div>

              <div class="pg-team-grid">

                ${members.map(member => `
                  <article class="pg-team-card">

                    <div class="pg-team-avatar">
                      ${escapeHTML(
                        member.name
                          .split(/\s+/)
                          .map(part => part.charAt(0))
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()
                      )}
                    </div>

                    <h3>${escapeHTML(member.name)}</h3>

                    <strong>
                      ${escapeHTML(member.role)}
                    </strong>

                    <p>${escapeHTML(member.bio)}</p>

                  </article>
                `).join("")}

              </div>

            </div>

          </section>
        `;

      }


      if (section.type === "products") {

        const products =
          parseProductItems(
            content
          );


        html = `
          <section
            class="pg-section pg-retail-products"
            data-site-section="${section.id}"
          >

            <div class="pg-container">

              <div class="pg-section-heading">

                <div class="pg-eyebrow">
                  <span class="pg-eyebrow-dot"></span>
                  Shop
                </div>

                <h2>
                  ${escapeHTML(content.title || "")}
                </h2>

                <p>
                  ${escapeHTML(content.intro || "")}
                </p>

              </div>


              <div class="pg-product-grid">

                ${products.map(product => {

                  const href =
                    resolveItemLink(
                      product,
                      ""
                    );

                  const external =
                    structuredLinkOpensNewTab(
                      product
                    );


                  return `

                    <article class="pg-product-card">

                      <div class="pg-product-placeholder">

                        <span>
                          ${escapeHTML(
                            product.name
                              .charAt(0)
                              .toUpperCase()
                          )}
                        </span>

                      </div>


                      <div class="pg-product-card-body">

                        <div class="pg-product-card-top">

                          <h3>
                            ${escapeHTML(product.name)}
                          </h3>

                          ${
                            product.price
                              ? `
                                <strong class="pg-product-price">
                                  ${escapeHTML(product.price)}
                                </strong>
                              `
                              : ""
                          }

                        </div>


                        <p>
                          ${escapeHTML(
                            product.description || ""
                          )}
                        </p>


                        ${
                          href
                            ? `
                              <a
                                class="pg-product-link"
                                href="${escapeHTML(href)}"

                                ${
                                  product.linkType === "page"
                                    ? `data-structured-page-link="${escapeHTML(product.linkTarget || "")}"`
                                    : ""
                                }

                                ${
                                  product.linkType === "section"
                                    ? `data-structured-section-link="${escapeHTML(product.linkTarget || "")}"`
                                    : ""
                                }

                                ${
                                  external
                                    ? `target="_blank" rel="noopener"`
                                    : ""
                                }
                              >
                                View Product →
                              </a>
                            `
                            : ""
                        }

                      </div>

                    </article>

                  `;

                }).join("")}

              </div>

            </div>

          </section>
        `;

      }


      if (section.type === "collections") {

        const collections =
          parseCollectionItems(
            content
          );


        html = `
          <section
            class="pg-section pg-section-soft pg-retail-collections"
            data-site-section="${section.id}"
          >

            <div class="pg-container">

              <div class="pg-section-heading">

                <div class="pg-eyebrow">
                  <span class="pg-eyebrow-dot"></span>
                  Browse
                </div>

                <h2>
                  ${escapeHTML(content.title || "")}
                </h2>

                <p>
                  ${escapeHTML(content.intro || "")}
                </p>

              </div>


              <div class="pg-collection-grid">

                ${collections.map((item, index) => {

                  const href =
                    resolveItemLink(
                      item,
                      ""
                    );

                  const external =
                    structuredLinkOpensNewTab(
                      item
                    );


                  const inner = `

                    <span class="pg-collection-number">
                      ${String(index + 1).padStart(2, "0")}
                    </span>

                    <h3>
                      ${escapeHTML(item.name)}
                    </h3>

                    <p>
                      ${escapeHTML(
                        item.description || ""
                      )}
                    </p>

                    ${
                      href
                        ? `
                          <span class="pg-collection-action">
                            Explore →
                          </span>
                        `
                        : ""
                    }

                  `;


                  if (!href) {

                    return `
                      <article class="pg-collection-card">
                        ${inner}
                      </article>
                    `;

                  }


                  return `
                    <a
                      class="pg-collection-card pg-collection-link-card"
                      href="${escapeHTML(href)}"

                      ${
                        item.linkType === "page"
                          ? `data-structured-page-link="${escapeHTML(item.linkTarget || "")}"`
                          : ""
                      }

                      ${
                        item.linkType === "section"
                          ? `data-structured-section-link="${escapeHTML(item.linkTarget || "")}"`
                          : ""
                      }

                      ${
                        external
                          ? `target="_blank" rel="noopener"`
                          : ""
                      }
                    >
                      ${inner}
                    </a>
                  `;

                }).join("")}

              </div>

            </div>

          </section>
        `;

      }


      if (section.type === "store-promo") {

        const promoHref =
          resolveStructuredLink(
            content,
            "#pg-contact"
          );

        const promoExternal =
          structuredLinkOpensNewTab(
            content
          );


        html = `
          <section
            class="pg-retail-promo"
            data-site-section="${section.id}"
          >

            <div class="pg-container pg-retail-promo-inner">

              <div>

                <div class="pg-eyebrow">
                  <span class="pg-eyebrow-dot"></span>
                  Featured Offer
                </div>

                <h2>${escapeHTML(content.title || "")}</h2>

                <p>
                  ${escapeHTML(content.body || "")}
                </p>

              </div>


              <a
                class="pg-button"
                href="${promoHref}"
                ${
                  promoExternal
                    ? `target="_blank" rel="noopener"`
                    : ""
                }
              >
                ${escapeHTML(
                  content.buttonText ||
                  "Shop Now"
                )}
              </a>

            </div>

          </section>
        `;

      }


      if (html) {
        generatedSite.insertAdjacentHTML(
          "beforeend",
          html
        );
      }

    });

}



function applySectionManager() {

  const generatedSite =
    preview.querySelector(".pg-site");

  if (!generatedSite) return;


  /*
    Multipage behavior:

    The generator still creates the complete pool of
    available section markup.

    Before applying the active page, hide every
    generated page section so sections from another
    page cannot remain visible underneath it.
  */

  generatedSite
    .querySelectorAll("[data-site-section]")
    .forEach(element => {

      element.hidden = true;

    });


  /*
    Then activate only the sections owned by the
    current page, applying order and design state.
  */

  siteSections.forEach(section => {

    const element =
      generatedSite.querySelector(
        `[data-site-section="${section.id}"]`
      );

    if (!element) return;


    element.hidden =
      !section.enabled;


    element.id =
      getSectionAnchor(section);


    element.classList.remove(
      "pg-section-bg-brand",
      "pg-section-bg-image"
    );


    element.style.removeProperty(
      "--section-background-image"
    );


    if (section.background === "brand") {

      element.classList.add(
        "pg-section-bg-brand"
      );

    }


    if (
      section.background === "image" &&
      section.backgroundImage
    ) {

      element.classList.add(
        "pg-section-bg-image"
      );


      element.style.setProperty(
        "--section-background-image",
        `url("${section.backgroundImage}")`
      );

    }


    generatedSite.appendChild(element);

  });

}



function setupGeneratedParallax() {

  if (
    !parallaxToggle ||
    !parallaxToggle.checked ||
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  ) {
    return;
  }


  const images =
    preview.querySelectorAll(
      ".pg-parallax-image"
    );


  if (!images.length) return;


  if (generatedParallaxHandler) {

    window.removeEventListener(
      "scroll",
      generatedParallaxHandler
    );

  }


  const updateParallax = () => {

    images.forEach(image => {

      const visual =
        image.closest(".pg-hero-visual");

      if (!visual) return;

      const rect =
        visual.getBoundingClientRect();

      const viewportHeight =
        window.innerHeight;


      if (
        rect.bottom < 0 ||
        rect.top > viewportHeight
      ) {
        return;
      }


      const visualCenter =
        rect.top + rect.height / 2;

      const viewportCenter =
        viewportHeight / 2;

      const offset =
        (visualCenter - viewportCenter) * -0.08;


      image.style.setProperty(
        "--parallax-y",
        `${offset}px`
      );

    });

  };


  generatedParallaxHandler =
    updateParallax;


  updateParallax();


  window.addEventListener(
    "scroll",
    generatedParallaxHandler,
    {
      passive: true
    }
  );

}



function setupGeneratedReveal() {

  if (generatedRevealObserver) {
    generatedRevealObserver.disconnect();
    generatedRevealObserver = null;
  }


  if (
    !revealToggle ||
    !revealToggle.checked ||
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  ) {
    return;
  }


  const durationMap = {
    gentle: 1100,
    normal: 750,
    quick: 480
  };


  const duration =
    durationMap[selectedRevealSpeed] || 650;


  /*
    Reveal the inner content instead of the entire section.

    This keeps section backgrounds visible and makes
    IntersectionObserver much more reliable on tall sections.
  */

  const targets = [];


  const footerContent =
    preview.querySelector(
      '[data-site-section="footer"] > .pg-container'
    );


  if (footerContent) {
    footerContent.classList.remove(
      "pg-reveal",
      "pg-reveal-fade-up",
      "pg-reveal-fade",
      "pg-reveal-slide",
      "pg-reveal-scale",
      "pg-revealed"
    );

    footerContent.style.removeProperty(
      "--reveal-duration"
    );

    footerContent.style.removeProperty(
      "--reveal-delay"
    );
  }



  preview
    .querySelectorAll("[data-site-section]")
    .forEach(section => {

      if (
        section.dataset.siteSection === "hero" ||
        section.dataset.siteSection === "footer" ||
        section.hidden
      ) {
        return;
      }


      const content =
        section.querySelector(":scope > .pg-container")
        || section;


      targets.push(content);

    });


  targets.forEach(target => {

    target.classList.remove(
      "pg-reveal",
      "pg-reveal-fade-up",
      "pg-reveal-fade",
      "pg-reveal-slide",
      "pg-reveal-scale",
      "pg-revealed"
    );


    target.classList.add(
      "pg-reveal",
      `pg-reveal-${selectedRevealStyle}`
    );


    target.style.setProperty(
      "--reveal-duration",
      `${duration}ms`
    );

  });


  generatedRevealObserver =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (!entry.isIntersecting) {
            return;
          }


          entry.target.classList.add(
            "pg-revealed"
          );


          generatedRevealObserver.unobserve(
            entry.target
          );

        });

      },
      {
        threshold: 0.01,
        rootMargin: "0px 0px -10% 0px"
      }
    );


  /*
    Give SyteByte one frame to finish rearranging
    the generated section stack before observing it.
  */

  requestAnimationFrame(() => {

    targets.forEach(target => {

      generatedRevealObserver.observe(
        target
      );

    });

  });


  setupRevealStagger();

}



function setupRevealStagger() {

  const staggerGroups = [
    ".pg-services-grid > *",
    ".pg-testimonials-grid > *",
    ".pg-gallery-grid > *",
    ".pg-custom-feature-grid > *",
    ".pg-custom-trust-items > *"
  ];


  staggerGroups.forEach(selector => {

    preview
      .querySelectorAll(selector)
      .forEach((item, index) => {

        item.style.setProperty(
          "--reveal-delay",
          `${Math.min(index, 8) * 80}ms`
        );

      });

  });

}



/* -------------------------------------------------
   SITE GENERATOR
------------------------------------------------- */

/* GENERATED SITE NAVIGATION */

preview.addEventListener(
  "click",
  event => {

    const pageLink =
      event.target.closest(
        "[data-page-nav-link]"
      );


    if (pageLink) {

      event.preventDefault();

      switchSitePage(
        pageLink.dataset.pageNavLink
      );

      return;

    }


    const homeSectionLink =
      event.target.closest(
        "[data-home-section-link]"
      );


    if (homeSectionLink) {

      event.preventDefault();


      const sectionId =
        homeSectionLink.dataset.homeSectionLink;


      const scrollToHomeSection = () => {

        const target =
          preview.querySelector(
            `#${getSectionAnchor({
              id: sectionId
            })}`
          );

        if (!target) return;


        const appHeader =
          document.querySelector(
            ".app-header"
          );

        const generatedNav =
          preview.querySelector(
            ".pg-nav"
          );


        const offset =
          (appHeader?.offsetHeight || 0) +
          (generatedNav?.offsetHeight || 0) +
          16;


        const top =
          target
            .getBoundingClientRect()
            .top +
          window.scrollY -
          offset;


        window.scrollTo({
          top: Math.max(0, top),
          behavior: "smooth"
        });

      };


      if (activePageId !== "home") {

        switchSitePage("home");


        requestAnimationFrame(() => {

          requestAnimationFrame(
            scrollToHomeSection
          );

        });


      } else {

        scrollToHomeSection();

      }


      return;

    }


    const link =
      event.target.closest(
        'a[href^="#pg-"]'
      );

    if (!link) return;


    const targetSelector =
      link.getAttribute("href");

    if (!targetSelector) return;


    const target =
      preview.querySelector(
        targetSelector
      );

    if (!target) return;


    event.preventDefault();


    const appHeader =
      document.querySelector(
        ".app-header"
      );

    const generatedNav =
      preview.querySelector(
        ".pg-nav"
      );


    const offset =
      (appHeader?.offsetHeight || 78)
      +
      (generatedNav?.offsetHeight || 70)
      +
      16;


    const targetTop =
      target.getBoundingClientRect().top
      +
      window.scrollY
      -
      offset;


    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: "smooth"
    });

  }
);



let siteHasBeenGenerated = false;
let livePreviewTimer = null;
let pendingLiveRefresh = false;


function scheduleLivePreview() {

  if (!siteHasBeenGenerated) return;


  clearTimeout(livePreviewTimer);


  livePreviewTimer = setTimeout(() => {

    pendingLiveRefresh = true;

    form.requestSubmit();

  }, 220);

}



form.addEventListener("submit", event => {

  event.preventDefault();


  const isLiveRefresh =
    pendingLiveRefresh;

  pendingLiveRefresh = false;

  siteHasBeenGenerated = true;


  const businessName = getValue(
    "#business-name",
    document.querySelector("#business-name").placeholder || "Your Business"
  );

  const tagline = getValue(
    "#tagline",
    "Reliable service. Local expertise."
  );

  const description = getValue(
    "#description",
    `${businessName} proudly provides dependable service with a focus on quality, communication, and getting the job done right.`
  );

  const phone = getValue(
    "#phone",
    "(555) 555-0123"
  );

  const email = getValue(
    "#email",
    "hello@yourbusiness.com"
  );

  const address = getValue(
    "#address",
    "Serving the local community"
  );

  const primaryZip = getValue(
    "#primary-zip"
  );

  const serviceZipsRaw = getValue(
    "#service-zips"
  );

  const servicesRaw = getValue(
    "#services",
    "Professional Service\nReliable Support\nLocal Expertise"
  );

  const hoursRaw = getValue(
    "#hours",
    "Monday-Friday: 8:00 AM - 5:00 PM\nSaturday: By Appointment\nSunday: Closed"
  );


  const testimonialsRaw = getValueOrPlaceholder(
    "#testimonials"
  );

  const faqsRaw = getValueOrPlaceholder(
    "#faqs"
  );


  const services = splitLines(servicesRaw);
  const hours = splitLines(hoursRaw);

  const serviceZips = [
    primaryZip,
    ...serviceZipsRaw.split(",")
  ]
    .map(zip => zip.trim())
    .filter(Boolean)
    .filter((zip, index, array) =>
      array.indexOf(zip) === index
    );


  const testimonials =
    splitPairs(testimonialsRaw);

  const faqs =
    splitPairs(faqsRaw);

  const safeBusinessName = escapeHTML(businessName);
  const safeTagline = escapeHTML(tagline);
  const safeDescription = escapeHTML(description);
  const safePhone = escapeHTML(phone);
  const safeEmail = escapeHTML(email);
  const safeAddress = escapeHTML(address);

  const phoneLink = cleanPhone(phone);

  currentGeneratedPhoneLink = phoneLink;

  const mapLink =
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;


  previewTitle.textContent = businessName;


  const serviceCards = services.map((service, index) => `

    <article class="pg-service-card">

      <div class="pg-service-number">
        ${String(index + 1).padStart(2, "0")}
      </div>

      <h3>${escapeHTML(service)}</h3>

      <p>
        Professional ${escapeHTML(service.toLowerCase())}
        from a local team you can count on.
      </p>

    </article>

  `).join("");


  const testimonialCards = testimonials.map(item => `

    <article class="pg-testimonial">

      <div class="pg-stars">
        ★★★★★
      </div>

      <blockquote>
        “${escapeHTML(item.second)}”
      </blockquote>

      <strong>
        ${escapeHTML(item.first)}
      </strong>

    </article>

  `).join("");


  const faqItems = faqs.map((item, index) => `

    <details
      class="pg-faq-item"
      ${index === 0 ? "open" : ""}
    >

      <summary>
        ${escapeHTML(item.first)}
      </summary>

      <p>
        ${escapeHTML(item.second)}
      </p>

    </details>

  `).join("");


  const galleryItems = galleryDataURLs.map((image, index) => `

    <figure class="pg-gallery-item">

      <img
        src="${image}"
        alt="${safeBusinessName} gallery photo ${index + 1}"
      >

    </figure>

  `).join("");


  const hoursRows = hours.map(item => {

    const separator = item.indexOf(":");

    if (separator === -1) {

      return `
        <div class="pg-hours-row">
          <span>${escapeHTML(item)}</span>
        </div>
      `;

    }

    const day = item.slice(0, separator).trim();
    const time = item.slice(separator + 1).trim();

    return `
      <div class="pg-hours-row">
        <strong>${escapeHTML(day)}</strong>
        <span>${escapeHTML(time)}</span>
      </div>
    `;

  }).join("");


  const serviceZipMarkup = serviceZips
    .map(zip => `
      <span class="pg-zip-chip">
        ${escapeHTML(zip)}
      </span>
    `)
    .join("");


  const serviceAreaQuery = [
    address,
    primaryZip
  ]
    .filter(Boolean)
    .join(" ");


  const serviceAreaMapLink =
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(serviceAreaQuery)}`;


  const navigationPages =
    getNavigationPages();


  const navigationSections =
    getNavigationSections();


  const pageNavLinks =
    navigationPages
      .map(page => {

        const label =
          escapeHTML(
            page.navLabel ||
            page.title
          );

        return `
          <a
            href="${escapeHTML(
              getPageHref(page)
            )}"
            data-page-nav-link="${page.id}"
          >
            ${label}
          </a>
        `;

      })
      .join("");


  const sectionNavLinks =
    navigationSections
      .map(section => {

        const label =
          escapeHTML(
            section.navLabel ||
            section.label
          );

        return `
          <a
            href="${escapeHTML(
              getNavigationSectionHref(section)
            )}"
            data-home-section-link="${section.id}"
          >
            ${label}
          </a>
        `;

      })
      .join("");


  const navLinks =
    pageNavLinks +
    sectionNavLinks;


  preview.innerHTML = `

    <style>

      .pg-site,
      .pg-site * {
        box-sizing: border-box;
      }


      .pg-site {
        scroll-behavior: smooth;

        --primary: ${colors.primary.value};
        --accent: ${colors.accent.value};
        --button: ${colors.button.value};
        --button-text: ${colors.buttonText.value};

        --ink: #101828;
        --muted: #667085;
        --line: #e8edf3;
        --soft: #f6f8fb;

        min-height: 100%;

        overflow: visible;

        border-radius: 14px;

        background: #ffffff;
        color: var(--ink);

        font-family:
          Inter,
          ui-sans-serif,
          system-ui,
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          sans-serif;
      }


      .pg-container {
        width: min(1120px, calc(100% - 48px));
        margin: 0 auto;
      }


      .pg-nav {
        min-height: 74px;

        display: flex;
        align-items: center;

        position: sticky;
        top: 0;
        z-index: 100;

        border-bottom: 1px solid var(--line);

        background: rgba(255,255,255,.94);

        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
      }


      .pg-nav-inner {
        width: 100%;

        display: flex;
        align-items: center;
        justify-content: space-between;

        gap: 25px;
        padding: 0 10px;
      }


      .pg-logo {
        display: flex;
        align-items: center;
        gap: 11px;

        min-width: 0;

        color: var(--primary);
        text-decoration: none;

        font-weight: 900;
        letter-spacing: -.03em;
      }


      .pg-logo-image {
        width: 44px;
        height: 44px;

        flex: 0 0 auto;

        display: grid;
        place-items: center;
      }


      .pg-logo-image img {
        display: block;

        max-width: 100%;
        max-height: 100%;

        object-fit: contain;
      }


      .pg-logo-mark {
        width: 36px;
        height: 36px;

        flex: 0 0 auto;

        display: grid;
        place-items: center;

        border-radius: 9px;

        background: var(--primary);
        color: #ffffff;

        font-size: 16px;
      }


      .pg-logo-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }


      .pg-nav-links {
        display: flex;
        align-items: center;
        gap: 24px;
      }


      .pg-nav-links a {
        color: #475467;
        text-decoration: none;

        font-size: 13px;
        font-weight: 700;
      }


      .pg-nav-links .pg-nav-cta {
        color: var(--button-text);
      }


      .pg-nav-cta,
      .pg-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;

        border-radius: 10px;

        background: var(--button);
        color: var(--button-text);

        text-decoration: none;

        font-weight: 800;

        transition:
          transform .15s ease,
          opacity .15s ease;
      }


      .pg-nav-cta {
        padding: 10px 15px;
      }


      .pg-button {
        min-height: 48px;
        padding: 0 20px;

        font-size: 14px;
      }


      .pg-button:hover,
      .pg-nav-cta:hover {
        transform: translateY(-1px);
        opacity: .92;
      }


      .pg-button-secondary {
        background: transparent;
        color: var(--primary);

        border: 1px solid #d7dee8;
      }


      .pg-hero {
        position: relative;
        overflow: hidden;

        padding: 96px 0 90px;

        background:
          radial-gradient(
            circle at 85% 20%,
            color-mix(in srgb, var(--accent) 18%, transparent),
            transparent 32%
          ),
          linear-gradient(
            145deg,
            #ffffff,
            color-mix(in srgb, var(--primary) 6%, white)
          );
      }


      .pg-hero::after {
        content: "";

        position: absolute;

        width: 340px;
        height: 340px;

        right: -140px;
        bottom: -190px;

        border: 50px solid
          color-mix(in srgb, var(--primary) 6%, transparent);

        border-radius: 50%;
      }


      .pg-hero-content {
        position: relative;
        z-index: 1;

        max-width: 800px;
      }


      .pg-eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 8px;

        margin-bottom: 20px;

        color: var(--primary);

        text-transform: uppercase;
        letter-spacing: .14em;

        font-size: 11px;
        font-weight: 900;
      }


      .pg-eyebrow-dot {
        width: 8px;
        height: 8px;

        border-radius: 50%;

        background: var(--accent);
      }


      .pg-hero h1 {
        max-width: 850px;

        margin: 0;

        color: var(--primary);

        font-size: clamp(46px, 7vw, 82px);
        line-height: .98;
        letter-spacing: -.055em;
      }


      .pg-hero-copy {
        max-width: 650px;

        margin: 24px 0 0;

        color: #536174;

        font-size: 18px;
        line-height: 1.7;
      }


      .pg-hero-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 11px;

        margin-top: 32px;
      }


      .pg-trust-row {
        display: flex;
        flex-wrap: wrap;
        gap: 18px;

        margin-top: 40px;

        color: #667085;

        font-size: 12px;
        font-weight: 700;
      }


      .pg-trust-item::before {
        content: "✓";

        margin-right: 7px;

        color: var(--accent);
        font-weight: 900;
      }


      .pg-section {
        padding: 84px 0;

        scroll-margin-top: 165px;
      }


      #pg-services,
      #pg-about,
      #pg-contact,
      [data-site-section] {
        scroll-margin-top: 165px;
      }


      .pg-section-soft {
        background: var(--soft);
      }


      .pg-section-heading {
        max-width: 680px;

        margin-bottom: 40px;
      }


      .pg-section-heading h2 {
        margin: 0;

        color: var(--primary);

        font-size: clamp(34px, 5vw, 52px);
        line-height: 1;
        letter-spacing: -.045em;
      }


      .pg-section-heading p {
        margin: 17px 0 0;

        color: var(--muted);

        font-size: 16px;
        line-height: 1.7;
      }


      .pg-services-grid {
        display: grid;

        grid-template-columns:
          repeat(3, minmax(0, 1fr));

        gap: 16px;
      }


      .pg-service-card {
        position: relative;

        min-height: 225px;

        padding: 27px;

        overflow: hidden;

        background: white;

        border: 1px solid var(--line);
        border-radius: 16px;
      }


      .pg-service-number {
        margin-bottom: 34px;

        color: var(--accent);

        font-size: 11px;
        font-weight: 900;
        letter-spacing: .12em;
      }


      .pg-service-card h3 {
        margin: 0 0 10px;

        color: var(--primary);

        font-size: 20px;
        letter-spacing: -.025em;
      }


      .pg-service-card p {
        margin: 0;

        color: var(--muted);

        font-size: 13px;
        line-height: 1.65;
      }


      .pg-about-grid {
        display: grid;
        grid-template-columns: 1.2fr .8fr;
        gap: 60px;

        align-items: center;
      }


      .pg-about-copy h2 {
        margin: 0 0 22px;

        color: var(--primary);

        font-size: clamp(34px, 5vw, 52px);
        line-height: 1;
        letter-spacing: -.045em;
      }


      .pg-about-copy p {
        margin: 0;

        color: #5e6b7d;

        font-size: 16px;
        line-height: 1.85;
      }


      .pg-area-card {
        padding: 34px;

        border-radius: 20px;

        background: var(--primary);
        color: white;
      }


      .pg-area-icon {
        width: 44px;
        height: 44px;

        display: grid;
        place-items: center;

        margin-bottom: 28px;

        border-radius: 12px;

        background:
          color-mix(in srgb, var(--accent) 35%, transparent);

        font-size: 20px;
      }


      .pg-area-card small {
        display: block;

        margin-bottom: 7px;

        opacity: .65;

        text-transform: uppercase;
        letter-spacing: .12em;

        font-size: 10px;
        font-weight: 800;
      }


      .pg-area-card strong {
        display: block;

        font-size: 23px;
        line-height: 1.25;
      }


      .pg-contact-grid {
        display: grid;
        grid-template-columns: .85fr 1.15fr;
        gap: 22px;
      }


      .pg-hours-card,
      .pg-contact-card {
        padding: 32px;

        border: 1px solid var(--line);
        border-radius: 18px;

        background: white;
      }


      .pg-hours-card h3,
      .pg-contact-card h3 {
        margin: 0 0 23px;

        color: var(--primary);

        font-size: 23px;
        letter-spacing: -.03em;
      }


      .pg-hours-row {
        display: flex;
        justify-content: space-between;
        gap: 18px;

        padding: 13px 0;

        border-bottom: 1px solid var(--line);

        color: var(--muted);

        font-size: 13px;
      }


      .pg-hours-row:last-child {
        border-bottom: 0;
      }


      .pg-hours-row strong {
        color: var(--ink);
      }


      .pg-contact-method {
        display: block;

        padding: 17px 0;

        border-bottom: 1px solid var(--line);

        color: inherit;
        text-decoration: none;
      }


      .pg-contact-method:last-of-type {
        border-bottom: 0;
      }


      .pg-contact-method small {
        display: block;

        margin-bottom: 5px;

        color: var(--muted);

        text-transform: uppercase;
        letter-spacing: .1em;

        font-size: 9px;
        font-weight: 800;
      }


      .pg-contact-method strong {
        color: var(--primary);

        font-size: 16px;
      }


      .pg-contact-card .pg-button {
        width: 100%;

        margin-top: 22px;
      }


      .pg-final {
        padding: 80px 0;

        background: var(--primary);
        color: white;

        text-align: center;
      }


      .pg-final-inner {
        max-width: 680px;
        margin: auto;
      }


      .pg-final h2 {
        margin: 0;

        font-size: clamp(36px, 5vw, 56px);
        line-height: 1;
        letter-spacing: -.045em;
      }


      .pg-final p {
        margin: 18px 0 28px;

        opacity: .75;

        font-size: 16px;
        line-height: 1.7;
      }


      .pg-final .pg-button {
        background: var(--button);
        color: var(--button-text);
      }


      .pg-footer {
        padding: 30px 0;

        background: #0c111a;
        color: #9ba6b6;

        border-top:
          1px solid rgba(255,255,255,.06);
      }


      .pg-footer-grid {
        display: grid;

        grid-template-columns:
          minmax(0, 1.2fr)
          minmax(0, .9fr)
          auto;

        align-items: center;

        gap: 28px;
      }


      .pg-footer-brand {
        display: grid;
        gap: 5px;
      }


      .pg-footer-brand strong {
        color: white;

        font-size: 13px;
      }


      .pg-footer-brand span {
        color: #8d99aa;

        font-size: 11px;
      }


      .pg-footer-contact {
        display: grid;
        gap: 5px;
      }


      .pg-footer-contact a {
        color: #c6d0de;

        text-decoration: none;

        font-size: 11px;
        font-weight: 700;
      }


      .pg-footer-contact a:hover {
        color: white;
      }


      .pg-footer-meta {
        color: #727e8f;

        font-size: 10px;

        text-align: right;
      }


      .pg-hero-layout {
        display: grid;
        grid-template-columns: minmax(0, 1.05fr) minmax(300px, .95fr);
        gap: 55px;

        align-items: center;
      }


      .pg-hero-visual {
        position: relative;
        z-index: 2;

        min-height: 460px;

        overflow: hidden;

        border-radius: 24px;

        box-shadow:
          0 30px 70px rgba(16,24,40,.18);
      }


      .pg-parallax-image {
        will-change: transform;

        transform:
          translate3d(0, var(--parallax-y, 0px), 0)
          scale(1.08);
      }


      .pg-hero-visual img {
        width: 100%;
        height: 100%;

        position: absolute;
        inset: 0;

        object-fit: cover;
      }


      .pg-hero-minimal {
        grid-template-columns: 1fr;
      }


      .pg-hero-minimal .pg-hero-content {
        max-width: 850px;
      }


      .pg-hero-minimal .pg-hero-visual {
        display: none;
      }


      .pg-testimonials-grid {
        display: grid;

        grid-template-columns:
          repeat(3, minmax(0, 1fr));

        gap: 16px;
      }


      .pg-testimonial {
        padding: 28px;

        background: white;

        border: 1px solid var(--line);
        border-radius: 16px;
      }


      .pg-stars {
        margin-bottom: 19px;

        color: var(--accent);

        letter-spacing: .08em;

        font-size: 12px;
      }


      .pg-testimonial blockquote {
        margin: 0 0 22px;

        color: #475467;

        font-size: 15px;
        line-height: 1.75;
      }


      .pg-testimonial strong {
        color: var(--primary);

        font-size: 13px;
      }


      .pg-gallery-grid {
        display: grid;

        grid-template-columns:
          repeat(3, minmax(0, 1fr));

        gap: 12px;
      }


      .pg-gallery-item {
        position: relative;

        min-height: 260px;

        margin: 0;

        overflow: hidden;

        border-radius: 15px;

        background: var(--soft);
      }


      .pg-gallery-item img {
        position: absolute;
        inset: 0;

        width: 100%;
        height: 100%;

        object-fit: cover;

        transition: transform .35s ease;
      }


      .pg-gallery-item:hover img {
        transform: scale(1.04);
      }


      .pg-faq-list {
        max-width: 820px;
      }


      .pg-faq-item {
        border-bottom: 1px solid var(--line);
      }


      .pg-faq-item summary {
        position: relative;

        padding: 22px 42px 22px 0;

        list-style: none;

        color: var(--primary);

        font-size: 17px;
        font-weight: 800;

        cursor: pointer;
      }


      .pg-faq-item summary::-webkit-details-marker {
        display: none;
      }


      .pg-faq-item summary::after {
        content: "+";

        position: absolute;

        right: 2px;
        top: 18px;

        color: var(--accent);

        font-size: 25px;
        font-weight: 400;
      }


      .pg-faq-item[open] summary::after {
        content: "−";
      }


      .pg-faq-item p {
        max-width: 700px;

        margin: -4px 0 24px;

        color: var(--muted);

        font-size: 14px;
        line-height: 1.75;
      }


      /* COVER HERO STRUCTURE */

      .pg-hero-background {
        position: relative;

        grid-template-columns: 1fr;

        overflow: hidden;
      }


      .pg-hero-background .pg-hero-visual {
        position: absolute;

        inset: 0;

        min-height: 100%;

        border-radius: 0;

        box-shadow: none;

        z-index: 0;
      }


      .pg-hero-background .pg-hero-content {
        position: relative;

        z-index: 2;
      }


      /* COVER HERO — PREMIUM GLASS */

      .pg-hero-background {
        min-height: 620px;

        padding: 42px 0;

        display: grid;
        align-items: center;
      }


      .pg-hero-background .pg-hero-visual::after {
        content: "";

        position: absolute;
        inset: 0;

        background:
          linear-gradient(
            90deg,
            rgba(7, 13, 24, .58) 0%,
            rgba(7, 13, 24, .30) 48%,
            rgba(7, 13, 24, .08) 100%
          );
      }


      .pg-hero-background .pg-hero-content {
        max-width: 660px;

        padding: 44px 46px;

        border: 1px solid rgba(255,255,255,.24);
        border-radius: 24px;

        background:
          linear-gradient(
            135deg,
            rgba(12,19,32,.58),
            rgba(12,19,32,.34)
          );

        backdrop-filter:
          blur(24px)
          saturate(145%);

        -webkit-backdrop-filter:
          blur(24px)
          saturate(145%);

        box-shadow:
          0 30px 80px rgba(0,0,0,.28),
          inset 0 1px 0 rgba(255,255,255,.12);
      }


      .pg-hero-background .pg-eyebrow {
        color: white;
      }


      .pg-hero-background .pg-hero h1,
      .pg-hero-background h1 {
        color: white;

        font-size: clamp(46px, 6vw, 72px);
        line-height: .96;

        text-shadow:
          0 2px 20px rgba(0,0,0,.18);
      }


      .pg-hero-background .pg-hero-copy {
        max-width: 590px;

        color: rgba(255,255,255,.78);

        font-size: 17px;
        line-height: 1.65;
      }


      .pg-hero-background .pg-button-secondary {
        color: white;

        border-color: rgba(255,255,255,.38);

        background: rgba(255,255,255,.08);

        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
      }


      .pg-hero-background .pg-trust-row {
        color: rgba(255,255,255,.72);
      }


      .pg-hero-background .pg-trust-item::before {
        color: var(--accent);
      }


      .pg-zip-list {
        display: flex;
        flex-wrap: wrap;
        gap: 7px;

        margin-top: 22px;
      }


      .pg-zip-chip {
        display: inline-flex;

        padding: 7px 10px;

        border: 1px solid rgba(255,255,255,.14);
        border-radius: 999px;

        background: rgba(255,255,255,.08);

        color: rgba(255,255,255,.88);

        font-size: 11px;
        font-weight: 700;
      }


      .pg-area-link {
        display: inline-block;

        margin-top: 22px;

        color: white;

        text-decoration: none;

        font-size: 12px;
        font-weight: 800;

        opacity: .75;

        transition: opacity .15s ease;
      }


      .pg-area-link:hover {
        opacity: 1;
      }


      .pg-card-texture-grid
      :is(
        .pg-service-card,
        .pg-testimonial,
        .pg-hours-card,
        .pg-contact-card
      ) {
        background-image:
          linear-gradient(
            rgba(15,23,42,.035) 1px,
            transparent 1px
          ),
          linear-gradient(
            90deg,
            rgba(15,23,42,.035) 1px,
            transparent 1px
          );

        background-size: 20px 20px;
      }


      .pg-card-texture-dots
      :is(
        .pg-service-card,
        .pg-testimonial,
        .pg-hours-card,
        .pg-contact-card
      ) {
        background-image:
          radial-gradient(
            rgba(15,23,42,.08) .7px,
            transparent .7px
          );

        background-size: 13px 13px;
      }


      .pg-card-texture-diagonal
      :is(
        .pg-service-card,
        .pg-testimonial,
        .pg-hours-card,
        .pg-contact-card
      ) {
        background-image:
          repeating-linear-gradient(
            135deg,
            rgba(15,23,42,.025) 0,
            rgba(15,23,42,.025) 1px,
            transparent 1px,
            transparent 9px
          );
      }


      .pg-card-texture-paper
      :is(
        .pg-service-card,
        .pg-testimonial,
        .pg-hours-card,
        .pg-contact-card
      ) {
        background-image:
          linear-gradient(
            115deg,
            rgba(15,23,42,.02),
            transparent 40%,
            rgba(15,23,42,.025)
          );
      }


      .pg-card-texture-grain
      :is(
        .pg-service-card,
        .pg-testimonial,
        .pg-hours-card,
        .pg-contact-card
      ) {
        background-image:
          url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.045'/%3E%3C/svg%3E");
      }


      /* TEXTURES */

      .pg-texture-none {
        background-image: none;
      }


      .pg-texture-grid {
        background-image:
          linear-gradient(
            rgba(15,23,42,.045) 1px,
            transparent 1px
          ),
          linear-gradient(
            90deg,
            rgba(15,23,42,.045) 1px,
            transparent 1px
          );

        background-size:
          24px 24px;
      }


      .pg-texture-dots {
        background-image:
          radial-gradient(
            rgba(15,23,42,.12) .75px,
            transparent .75px
          );

        background-size:
          14px 14px;
      }


      .pg-texture-diagonal {
        background-image:
          repeating-linear-gradient(
            135deg,
            rgba(15,23,42,.035) 0,
            rgba(15,23,42,.035) 1px,
            transparent 1px,
            transparent 10px
          );
      }


      .pg-texture-paper {
        background-image:
          linear-gradient(
            115deg,
            rgba(15,23,42,.018),
            transparent 36%,
            rgba(15,23,42,.025) 67%,
            transparent
          ),
          repeating-linear-gradient(
            0deg,
            rgba(15,23,42,.012) 0,
            rgba(15,23,42,.012) 1px,
            transparent 1px,
            transparent 4px
          );
      }


      .pg-texture-grain {
        background-image:
          url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.055'/%3E%3C/svg%3E");

        background-size:
          180px 180px;
      }


      .pg-menu-toggle {
        width: 44px;
        height: 44px;

        display: none;

        flex: 0 0 auto;

        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 5px;

        padding: 0;

        border: 1px solid var(--line);
        border-radius: 10px;

        background: white;

        cursor: pointer;
      }


      .pg-menu-toggle span {
        width: 18px;
        height: 2px;

        display: block;

        border-radius: 999px;

        background: var(--primary);

        transition:
          transform .18s ease,
          opacity .18s ease;
      }


      .pg-menu-toggle.active span:nth-child(1) {
        transform:
          translateY(7px)
          rotate(45deg);
      }


      .pg-menu-toggle.active span:nth-child(2) {
        opacity: 0;
      }


      .pg-menu-toggle.active span:nth-child(3) {
        transform:
          translateY(-7px)
          rotate(-45deg);
      }


      .pg-mobile-menu {
        display: none;

        position: sticky;
        top: 78px;
        z-index: 49;

        padding: 12px 24px 18px;

        border-bottom: 1px solid var(--line);

        background: rgba(255,255,255,.97);

        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
      }


      .pg-mobile-menu.open {
        display: grid;

        gap: 4px;
      }


      .pg-mobile-menu a {
        display: flex;
        align-items: center;

        min-height: 44px;

        padding: 0 12px;

        border-radius: 8px;

        color: var(--primary);

        text-decoration: none;

        font-size: 13px;
        font-weight: 800;
      }


      .pg-mobile-menu a:hover {
        background: var(--soft);
      }


      .pg-mobile-menu .pg-mobile-call {
        margin-top: 6px;

        justify-content: center;

        background: var(--button);
        color: var(--button-text);
      }


      [data-site-section] {
        position: relative;
      }


      [data-site-section][hidden] {
        display: none !important;
      }


      .pg-section-bg-brand {
        background:
          color-mix(
            in srgb,
            var(--primary) 10%,
            white
          ) !important;
      }


      .pg-section-bg-image {
        background-image:
          linear-gradient(
            rgba(255,255,255,.84),
            rgba(255,255,255,.84)
          ),
          var(--section-background-image) !important;

        background-size: cover !important;
        background-position: center !important;
        background-repeat: no-repeat !important;
      }


      .pg-final.pg-section-bg-image,
      .pg-footer.pg-section-bg-image {
        background-image:
          linear-gradient(
            rgba(8,15,27,.62),
            rgba(8,15,27,.62)
          ),
          var(--section-background-image) !important;

        background-size: cover !important;
        background-position: center !important;
      }


      .pg-final.pg-section-bg-brand {
        background: var(--primary) !important;
      }


      .pg-footer.pg-section-bg-brand {
        background:
          color-mix(
            in srgb,
            var(--primary) 75%,
            #080c13
          ) !important;
      }


      /* RESTAURANT SECTIONS */

      .pg-menu-categories {
        display: grid;
        grid-template-columns:
          repeat(2, minmax(0, 1fr));

        gap: 24px;
      }


      .pg-menu-category {
        padding: 28px;

        border: 1px solid var(--line);
        border-radius: 18px;

        background: white;
      }


      .pg-menu-category h3 {
        margin: 0 0 20px;

        color: var(--primary);

        font-size: 22px;
      }


      .pg-menu-items {
        display: grid;
      }


      .pg-menu-item {
        display: grid;
        grid-template-columns:
          minmax(0, 1fr) auto;

        gap: 18px;

        padding: 16px 0;

        border-bottom: 1px solid var(--line);
      }


      .pg-menu-item:last-child {
        border-bottom: 0;
      }


      .pg-menu-item strong {
        color: var(--primary);

        font-size: 15px;
      }


      .pg-menu-item p {
        margin: 5px 0 0;

        color: var(--muted);

        font-size: 12px;
        line-height: 1.6;
      }


      .pg-menu-price {
        color: var(--primary);

        font-size: 14px;
        font-weight: 900;

        white-space: nowrap;
      }


      .pg-featured-dish {
        background: var(--soft);
      }


      .pg-featured-dish-grid {
        display: grid;
        grid-template-columns:
          minmax(0, .85fr)
          minmax(300px, 1.15fr);

        gap: 56px;

        align-items: center;
      }


      .pg-featured-dish-copy h2 {
        margin: 14px 0 20px;

        color: var(--primary);

        font-size: clamp(38px, 5vw, 60px);
        line-height: .98;
        letter-spacing: -.045em;
      }


      .pg-featured-dish-copy p {
        color: var(--muted);

        font-size: 16px;
        line-height: 1.8;
      }


      .pg-featured-price {
        display: inline-block;

        margin-top: 18px;

        color: var(--primary);

        font-size: 28px;
      }


      .pg-featured-dish-image,
      .pg-featured-dish-placeholder {
        min-height: 430px;

        overflow: hidden;

        border-radius: 22px;

        background: #e8ebef;
      }


      .pg-featured-dish-image img {
        width: 100%;
        height: 100%;

        display: block;

        object-fit: cover;
      }


      .pg-featured-dish-placeholder {
        display: grid;
        place-items: center;

        padding: 30px;

        color: var(--muted);

        text-align: center;
      }


      .pg-restaurant-reservation {
        padding: 72px 0;

        background: var(--primary);
        color: white;
      }


      .pg-restaurant-reservation-inner {
        display: flex;

        align-items: center;
        justify-content: space-between;

        gap: 40px;
      }


      .pg-restaurant-reservation h2 {
        margin: 10px 0 12px;

        color: white;

        font-size: clamp(38px, 5vw, 58px);
        line-height: 1;
      }


      .pg-restaurant-reservation p {
        max-width: 680px;

        margin: 0;

        color: rgba(255,255,255,.72);

        line-height: 1.7;
      }


      .pg-restaurant-reservation .pg-eyebrow {
        color: rgba(255,255,255,.78);
      }


      /* PROFESSIONAL SECTIONS */

      .pg-credential-grid {
        display: grid;
        grid-template-columns:
          repeat(2, minmax(0, 1fr));

        gap: 22px;
      }


      .pg-credential-card {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr);

        gap: 16px;

        padding: 24px;

        border: 1px solid var(--line);
        border-radius: 18px;

        background: white;
      }


      .pg-credential-mark {
        width: 34px;
        height: 34px;

        display: grid;
        place-items: center;

        border-radius: 10px;

        background: var(--soft);
        color: var(--primary);

        font-weight: 900;
      }


      .pg-credential-card h3 {
        margin: 0 0 7px;

        color: var(--primary);

        font-size: 16px;
      }


      .pg-credential-card p {
        margin: 0;

        color: var(--muted);

        font-size: 13px;
        line-height: 1.65;
      }


      .pg-process-grid {
        display: grid;
        grid-template-columns:
          repeat(4, minmax(0, 1fr));

        gap: 18px;
      }


      .pg-process-step {
        position: relative;

        padding: 26px;

        border: 1px solid var(--line);
        border-radius: 18px;

        background: white;
      }


      .pg-process-number {
        display: inline-block;

        margin-bottom: 28px;

        color: var(--accent);

        font-size: 12px;
        font-weight: 900;
        letter-spacing: .12em;
      }


      .pg-process-step h3 {
        margin: 0 0 10px;

        color: var(--primary);

        font-size: 18px;
      }


      .pg-process-step p {
        margin: 0;

        color: var(--muted);

        font-size: 13px;
        line-height: 1.65;
      }


      .pg-team-grid {
        display: grid;
        grid-template-columns:
          repeat(3, minmax(0, 1fr));

        gap: 22px;
      }


      .pg-team-card {
        padding: 28px;

        border: 1px solid var(--line);
        border-radius: 20px;

        background: white;
      }


      .pg-team-avatar {
        width: 58px;
        height: 58px;

        display: grid;
        place-items: center;

        margin-bottom: 20px;

        border-radius: 16px;

        background: var(--primary);
        color: white;

        font-size: 16px;
        font-weight: 900;
        letter-spacing: .04em;
      }


      .pg-team-card h3 {
        margin: 0;

        color: var(--primary);

        font-size: 18px;
      }


      .pg-team-card strong {
        display: block;

        margin-top: 5px;

        color: var(--accent);

        font-size: 12px;
      }


      .pg-team-card p {
        margin: 14px 0 0;

        color: var(--muted);

        font-size: 13px;
        line-height: 1.7;
      }


      /* RETAIL SECTIONS */

      .pg-product-grid {
        display: grid;
        grid-template-columns:
          repeat(3, minmax(0, 1fr));
        gap: 22px;
      }

      .pg-product-card {
        overflow: hidden;
        border: 1px solid var(--line);
        border-radius: 20px;
        background: white;
      }

      .pg-product-placeholder {
        min-height: 220px;

        display: grid;
        place-items: center;

        background:
          linear-gradient(
            135deg,
            var(--soft),
            white
          );
      }

      .pg-product-placeholder span {
        width: 62px;
        height: 62px;

        display: grid;
        place-items: center;

        border-radius: 18px;

        background: var(--primary);
        color: white;

        font-size: 22px;
        font-weight: 900;
      }

      .pg-product-card-body {
        padding: 22px;
      }

      .pg-product-card-top {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 18px;
      }

      .pg-product-card h3 {
        margin: 0;

        color: var(--primary);
        font-size: 17px;
      }

      .pg-product-price {
        color: var(--primary);

        font-size: 15px;
        white-space: nowrap;
      }

      .pg-product-card p {
        margin: 11px 0 0;

        color: var(--muted);

        font-size: 13px;
        line-height: 1.65;
      }

      .pg-product-link {
        display: inline-block;

        margin-top: 18px;

        color: var(--accent);

        text-decoration: none;

        font-size: 12px;
        font-weight: 900;
      }

      .pg-collection-grid {
        display: grid;
        grid-template-columns:
          repeat(4, minmax(0, 1fr));
        gap: 18px;
      }

      .pg-collection-card {
        padding: 26px;

        border: 1px solid var(--line);
        border-radius: 18px;

        background: white;
      }

      .pg-collection-number {
        display: inline-block;

        margin-bottom: 28px;

        color: var(--accent);

        font-size: 11px;
        font-weight: 900;
        letter-spacing: .12em;
      }

      .pg-collection-card h3 {
        margin: 0 0 10px;

        color: var(--primary);

        font-size: 18px;
      }

      .pg-collection-card p {
        margin: 0;

        color: var(--muted);

        font-size: 13px;
        line-height: 1.65;
      }

      .pg-retail-promo {
        padding: 72px 0;

        background: var(--primary);
        color: white;
      }

      .pg-retail-promo-inner {
        display: flex;

        align-items: center;
        justify-content: space-between;

        gap: 40px;
      }

      .pg-retail-promo h2 {
        margin: 10px 0 12px;

        color: white;

        font-size: clamp(38px, 5vw, 58px);
        line-height: 1;
      }

      .pg-retail-promo p {
        max-width: 680px;

        margin: 0;

        color: rgba(255,255,255,.72);

        line-height: 1.7;
      }

      .pg-retail-promo .pg-eyebrow {
        color: rgba(255,255,255,.78);
      }


      /* CUSTOM SECTIONS */

      .pg-custom-heading {
        margin: 0 0 20px;

        color: var(--primary);

        font-size: clamp(34px, 5vw, 52px);
        line-height: 1;
        letter-spacing: -.045em;
      }


      .pg-custom-copy {
        margin: 0;

        color: var(--muted);

        font-size: 16px;
        line-height: 1.85;
      }


      .pg-custom-split {
        display: grid;
        grid-template-columns:
          minmax(0, 1fr)
          minmax(280px, .85fr);

        align-items: center;

        gap: 55px;
      }


      .pg-custom-image,
      .pg-custom-placeholder {
        min-height: 360px;

        overflow: hidden;

        border-radius: 20px;
      }


      .pg-custom-image img {
        width: 100%;
        height: 100%;

        display: block;

        object-fit: cover;
      }


      .pg-custom-placeholder {
        display: grid;
        place-items: center;

        background: var(--soft);
        color: var(--muted);

        border: 1px dashed var(--line);

        font-size: 12px;
        font-weight: 700;
      }


      .pg-custom-feature-grid {
        display: grid;
        grid-template-columns:
          repeat(3, minmax(0, 1fr));

        gap: 16px;
      }


      .pg-custom-feature {
        padding: 28px;

        border: 1px solid var(--line);
        border-radius: 16px;

        background: white;
      }


      .pg-custom-feature > span {
        color: var(--accent);

        font-size: 10px;
        font-weight: 900;
        letter-spacing: .12em;
      }


      .pg-custom-feature h3 {
        margin: 27px 0 9px;

        color: var(--primary);

        font-size: 20px;
      }


      .pg-custom-feature p {
        margin: 0;

        color: var(--muted);

        font-size: 13px;
        line-height: 1.7;
      }


      .pg-custom-promo {
        padding: 68px 0;

        background: var(--primary);
        color: white;
      }


      .pg-custom-promo-inner {
        display: flex;
        align-items: center;
        justify-content: space-between;

        gap: 40px;
      }


      .pg-custom-promo h2 {
        margin: 0;

        font-size: clamp(32px, 5vw, 50px);
        line-height: 1;
        letter-spacing: -.04em;
      }


      .pg-custom-promo p {
        margin: 13px 0 0;

        color: rgba(255,255,255,.72);

        line-height: 1.6;
      }


      .pg-custom-promo .pg-button {
        flex: 0 0 auto;
      }


      .pg-custom-trust {
        padding: 32px 0;

        border-top: 1px solid var(--line);
        border-bottom: 1px solid var(--line);

        background: white;
      }


      .pg-custom-trust-title {
        margin: 0 0 17px;

        color: var(--primary);

        text-align: center;

        font-size: 11px;
        font-weight: 900;

        text-transform: uppercase;
        letter-spacing: .1em;
      }


      .pg-custom-trust-items {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;

        gap: 18px 32px;
      }


      .pg-custom-trust-items span {
        color: var(--muted);

        font-size: 12px;
        font-weight: 700;
      }


      .pg-parallax {
        background-attachment: fixed;
        background-position: center;
        background-size: cover;
      }


      @media (prefers-reduced-motion: reduce) {

        .pg-parallax {
          background-attachment: scroll;
        }

        .pg-site {
          scroll-behavior: auto;
        }

      }


      /* SCROLL REVEAL */

      .pg-reveal {
        opacity: 0;

        transition-property:
          opacity,
          transform;

        transition-timing-function:
          cubic-bezier(.22,.61,.36,1);

        transition-duration:
          var(--reveal-duration, 700ms);

        transition-delay:
          var(--reveal-delay, 0ms);
      }


      .pg-reveal-fade-up {
        transform:
          translate3d(0, 60px, 0);
      }


      .pg-reveal-fade {
        transform: none;
      }


      .pg-reveal-slide {
        transform:
          translate3d(-70px, 0, 0);
      }


      .pg-reveal-scale {
        transform:
          scale(.90);
      }


      .pg-reveal.pg-revealed {
        opacity: 1;
        transform: none;
      }


      @media (prefers-reduced-motion: reduce) {

        .pg-reveal {
          opacity: 1 !important;
          transform: none !important;
          transition: none !important;
        }

      }


      @media (max-width: 1000px) {

        .pg-nav-links {
          display: none;
        }


        .pg-menu-toggle {
          display: flex;
        }

      }


      /* FORCED MOBILE PREVIEW
         Mirrors the real small-screen layout inside SyteByte. */

      .pg-site.pg-force-mobile .pg-nav-links {
        display: none;
      }


      .pg-site.pg-force-mobile .pg-menu-toggle {
        display: flex;
      }


      .pg-site.pg-force-mobile .pg-container {
        width: min(100% - 32px, 1120px);
      }


      .pg-site.pg-force-mobile .pg-hero-layout,
      .pg-site.pg-force-mobile .pg-about-grid,
      .pg-site.pg-force-mobile .pg-contact-grid,
      .pg-site.pg-force-mobile .pg-custom-split,
      .pg-site.pg-force-mobile .pg-services-grid,
      .pg-site.pg-force-mobile .pg-testimonials-grid,
      .pg-site.pg-force-mobile .pg-gallery-grid,
      .pg-site.pg-force-mobile .pg-custom-feature-grid,
      .pg-site.pg-force-mobile .pg-footer-grid {
        grid-template-columns: 1fr;
      }


      .pg-site.pg-force-mobile .pg-custom-promo-inner,
      .pg-site.pg-force-mobile .pg-hero-actions {
        align-items: flex-start;
        flex-direction: column;
      }


      .pg-site.pg-force-mobile .pg-hero-actions .pg-button,
      .pg-site.pg-force-mobile .pg-button {
        width: 100%;
      }


      .pg-site.pg-force-mobile .pg-hero {
        padding: 54px 0 60px;
      }


      .pg-site.pg-force-mobile .pg-hero h1 {
        font-size: 45px;
        line-height: .96;
      }


      .pg-site.pg-force-mobile .pg-hero-copy {
        font-size: 15px;
      }


      .pg-site.pg-force-mobile .pg-hero-content {
        min-width: 0;
      }


      .pg-site.pg-force-mobile .pg-hero-visual {
        min-height: 300px;
      }


      .pg-site.pg-force-mobile .pg-section {
        padding: 58px 0;
      }


      .pg-site.pg-force-mobile .pg-about-grid {
        gap: 28px;
      }


      .pg-site.pg-force-mobile .pg-service-card {
        min-height: 190px;
      }


      .pg-site.pg-force-mobile .pg-gallery-item {
        min-height: 230px;
      }


      .pg-site.pg-force-mobile .pg-contact-grid {
        gap: 14px;
      }


      .pg-site.pg-force-mobile .pg-hours-card,
      .pg-site.pg-force-mobile .pg-contact-card {
        padding: 24px;
      }


      .pg-site.pg-force-mobile .pg-logo-name {
        max-width: 175px;
      }


      .pg-site.pg-force-mobile .pg-nav-cta {
        padding: 9px 11px;
        font-size: 11px;
      }


      .pg-site.pg-force-mobile .pg-footer-grid {
        gap: 18px;
      }


      .pg-site.pg-force-mobile .pg-footer-meta {
        text-align: left;
      }


      @media (max-width: 1000px) {

        .pg-process-grid,
        .pg-team-grid,
        .pg-product-grid,
        .pg-collection-grid {
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
        }

      }


      @media (max-width: 800px) {

        .pg-custom-split {
          grid-template-columns: 1fr;
        }


        .pg-custom-feature-grid {
          grid-template-columns: 1fr;
        }


        .pg-custom-promo-inner {
          align-items: flex-start;
          flex-direction: column;
        }


        .pg-testimonials-grid {
          grid-template-columns: 1fr;
        }


        .pg-gallery-grid {
          grid-template-columns: 1fr 1fr;
        }


        .pg-hero-layout {
          grid-template-columns: 1fr;
        }


        .pg-hero-visual {
          min-height: 340px;
        }


        .pg-hero {
          padding: 68px 0;
        }


        .pg-services-grid {
          grid-template-columns: 1fr 1fr;
        }


        .pg-about-grid,
        .pg-contact-grid {
          grid-template-columns: 1fr;
        }


        .pg-about-grid {
          gap: 28px;
        }

      }


      @media (max-width: 800px) {

        .pg-menu-categories,
        .pg-featured-dish-grid,
        .pg-credential-grid,
        .pg-process-grid,
        .pg-team-grid,
        .pg-product-grid,
        .pg-collection-grid {
          grid-template-columns: 1fr;
        }

        .pg-retail-promo-inner {
          align-items: flex-start;
          flex-direction: column;
        }


        .pg-restaurant-reservation-inner {
          align-items: flex-start;
          flex-direction: column;
        }

      }


      @media (max-width: 520px) {

        .pg-gallery-grid {
          grid-template-columns: 1fr;
        }


        .pg-gallery-item {
          min-height: 230px;
        }


        .pg-container {
          width: min(100% - 32px, 1120px);
        }


        .pg-logo-name {
          max-width: 175px;
        }


        .pg-nav-cta {
          padding: 9px 11px;

          font-size: 11px;
        }


        .pg-hero {
          padding: 54px 0 60px;
        }


        .pg-hero h1 {
          font-size: 45px;
        }


        .pg-hero-copy {
          font-size: 15px;
        }


        .pg-hero-actions {
          flex-direction: column;
        }


        .pg-button {
          width: 100%;
        }


        .pg-section {
          padding: 58px 0;
        }


        .pg-services-grid {
          grid-template-columns: 1fr;
        }


        .pg-service-card {
          min-height: 190px;
        }


        .pg-contact-grid {
          gap: 14px;
        }


        .pg-hours-card,
        .pg-contact-card {
          padding: 24px;
        }


        .pg-footer-grid {
          grid-template-columns: 1fr;

          gap: 18px;
        }


        .pg-footer-meta {
          text-align: left;
        }

      }

    </style>


    <div
      class="
        pg-site
        pg-texture-${selectedTextures.page}
        pg-card-texture-${selectedTextures.cards}
      "
    >

      <!-- NAVIGATION -->

      <nav class="pg-nav">

        <div class="pg-container pg-nav-inner">

          <a class="pg-logo" href="#">

            ${
              logoDataURL
                ? `
                  <span class="pg-logo-image">
                    <img
                      src="${logoDataURL}"
                      alt="${safeBusinessName} logo"
                    >
                  </span>
                `
                : `
                  <span class="pg-logo-mark">
                    ${safeBusinessName.charAt(0).toUpperCase()}
                  </span>
                `
            }

            <span class="pg-logo-name">
              ${safeBusinessName}
            </span>

          </a>


          <div class="pg-nav-links">

            ${navLinks}

            <a
              class="pg-nav-cta"
              href="tel:${phoneLink}"
            >
              Call Now
            </a>

          </div>


          <button
            class="pg-menu-toggle"
            type="button"
            aria-label="Open navigation"
            aria-expanded="false"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

        </div>

      </nav>


      <div class="pg-mobile-menu">

        ${navLinks}

        <a
          class="pg-mobile-call"
          href="tel:${phoneLink}"
        >
          Call ${safePhone}
        </a>

      </div>



      <!-- HERO -->

      <header class="pg-hero pg-texture-${selectedTextures.hero}" data-site-section="hero">

        <div
          class="
            pg-container
            pg-hero-layout
            pg-hero-${selectedHeroStyle}
          "
        >

          <div class="pg-hero-content">

            <div class="pg-eyebrow">

              <span class="pg-eyebrow-dot"></span>

              Local Business

            </div>


            <h1>
              ${safeTagline}
            </h1>


            <p class="pg-hero-copy">

              ${safeBusinessName} provides dependable,
              professional service for customers in
              ${safeAddress}.

            </p>


            <div class="pg-hero-actions">

              <a
                class="pg-button"
                href="tel:${phoneLink}"
              >
                Call ${safePhone}
              </a>

              <a
                class="pg-button pg-button-secondary"
                href="#pg-services"
              >
                View Services
              </a>

            </div>


            <div class="pg-trust-row">

              <span class="pg-trust-item">
                Local Service
              </span>

              <span class="pg-trust-item">
                Dependable Support
              </span>

              <span class="pg-trust-item">
                Easy to Reach
              </span>

            </div>

          </div>


          ${
            heroImageDataURL
              ? `
                <div class="pg-hero-visual">

                  <img
                    class="${parallaxToggle?.checked ? "pg-parallax-image" : ""}"
                    src="${heroImageDataURL}"
                    alt="${safeBusinessName}"
                  >

                </div>
              `
              : ""
          }

        </div>

      </header>



      <!-- SERVICES -->

      <section
        id="pg-services"
        class="pg-section pg-section-soft"
        data-site-section="services"
      >

        <div class="pg-container">

          <div class="pg-section-heading">

            <div class="pg-eyebrow">

              <span class="pg-eyebrow-dot"></span>

              What We Do

            </div>

            <h2>
              Services built around what you need.
            </h2>

            <p>
              Straightforward, professional service
              from a local business that values the work.
            </p>

          </div>


          <div class="pg-services-grid">

            ${serviceCards}

          </div>

        </div>

      </section>



      <!-- ABOUT -->

      <section
        id="pg-about"
        class="pg-section"
        data-site-section="about"
      >

        <div class="pg-container pg-about-grid">

          <div class="pg-about-copy">

            <div class="pg-eyebrow">

              <span class="pg-eyebrow-dot"></span>

              About Us

            </div>

            <h2>
              Local service without the runaround.
            </h2>

            <p>
              ${safeDescription}
            </p>

          </div>


          <div class="pg-area-card">

            <div class="pg-area-icon">
              ⌖
            </div>

            <small>
              Service Area
            </small>

            <strong>
              ${safeAddress}
            </strong>

            ${
              serviceZips.length
                ? `
                  <div class="pg-zip-list">
                    ${serviceZipMarkup}
                  </div>
                `
                : ""
            }

            <a
              class="pg-area-link"
              href="${serviceAreaMapLink}"
              target="_blank"
              rel="noopener"
            >
              View Service Area on Google Maps →
            </a>

          </div>

        </div>

      </section>



      ${testimonials.length ? `

        <!-- TESTIMONIALS -->

        <section class="pg-section pg-section-soft" data-site-section="testimonials">

          <div class="pg-container">

            <div class="pg-section-heading">

              <div class="pg-eyebrow">

                <span class="pg-eyebrow-dot"></span>

                Customer Feedback

              </div>

              <h2>
                What customers are saying.
              </h2>

              <p>
                Real feedback from people who have
                worked with ${safeBusinessName}.
              </p>

            </div>


            <div class="pg-testimonials-grid">

              ${testimonialCards}

            </div>

          </div>

        </section>

      ` : ""}


      ${galleryDataURLs.length ? `

        <!-- GALLERY -->

        <section class="pg-section" data-site-section="gallery">

          <div class="pg-container">

            <div class="pg-section-heading">

              <div class="pg-eyebrow">

                <span class="pg-eyebrow-dot"></span>

                Our Work

              </div>

              <h2>
                See the work for yourself.
              </h2>

            </div>


            <div class="pg-gallery-grid">

              ${galleryItems}

            </div>

          </div>

        </section>

      ` : ""}


      ${faqs.length ? `

        <!-- FAQ -->

        <section
          class="pg-section pg-section-soft"
          data-site-section="faq"
        >

          <div class="pg-container">

            <div class="pg-section-heading">

              <div class="pg-eyebrow">

                <span class="pg-eyebrow-dot"></span>

                FAQ

              </div>

              <h2>
                Questions? We've got answers.
              </h2>

            </div>


            <div class="pg-faq-list">

              ${faqItems}

            </div>

          </div>

        </section>

      ` : ""}


      <!-- CONTACT -->

      <section
        id="pg-contact"
        class="pg-section pg-section-soft"
        data-site-section="contact"
      >

        <div class="pg-container">

          <div class="pg-section-heading">

            <div class="pg-eyebrow">

              <span class="pg-eyebrow-dot"></span>

              Get In Touch

            </div>

            <h2>
              Ready when you need us.
            </h2>

            <p>
              Reach out directly to ask a question,
              discuss your needs, or request service.
            </p>

          </div>


          <div class="pg-contact-grid">

            <div class="pg-hours-card">

              <h3>
                Business Hours
              </h3>

              ${hoursRows}

            </div>


            <div class="pg-contact-card">

              <h3>
                Contact ${safeBusinessName}
              </h3>


              <a
                class="pg-contact-method"
                href="tel:${phoneLink}"
              >

                <small>
                  Phone
                </small>

                <strong>
                  ${safePhone}
                </strong>

              </a>


              <a
                class="pg-contact-method"
                href="mailto:${safeEmail}"
              >

                <small>
                  Email
                </small>

                <strong>
                  ${safeEmail}
                </strong>

              </a>


              <a
                class="pg-contact-method"
                href="${mapLink}"
                target="_blank"
                rel="noopener"
              >

                <small>
                  Location / Service Area
                </small>

                <strong>
                  ${safeAddress}
                </strong>

              </a>


              <a
                class="pg-button"
                href="tel:${phoneLink}"
              >
                Call Now
              </a>

            </div>

          </div>

        </div>

      </section>



      <!-- FINAL CTA -->

      <section class="pg-final" data-site-section="cta">

        <div class="pg-container">

          <div class="pg-final-inner">

            <h2>
              Let's get the job done.
            </h2>

            <p>
              Contact ${safeBusinessName} today
              to discuss how we can help.
            </p>

            <a
              class="pg-button"
              href="tel:${phoneLink}"
            >
              ${safePhone}
            </a>

          </div>

        </div>

      </section>



      <!-- FOOTER -->

      <footer class="pg-footer" data-site-section="footer">

        <div class="pg-container pg-footer-grid">

          <div class="pg-footer-brand">

            <strong>
              ${safeBusinessName}
            </strong>

            <span>
              ${safeAddress}
            </span>

          </div>


          <div class="pg-footer-contact">

            <a href="tel:${phoneLink}">
              ${safePhone}
            </a>

            <a href="mailto:${safeEmail}">
              ${safeEmail}
            </a>

          </div>


          <div class="pg-footer-meta">

            <span>
              © ${new Date().getFullYear()} ${safeBusinessName}
            </span>

          </div>

        </div>

      </footer>

    </div>
  `;


  const generatedMenuToggle =
    preview.querySelector(".pg-menu-toggle");

  const generatedMobileMenu =
    preview.querySelector(".pg-mobile-menu");


  if (
    generatedMenuToggle &&
    generatedMobileMenu
  ) {

    generatedMenuToggle.addEventListener(
      "click",
      () => {

        const isOpen =
          generatedMobileMenu.classList.toggle("open");

        generatedMenuToggle
          .classList.toggle("active", isOpen);

        generatedMenuToggle.setAttribute(
          "aria-expanded",
          String(isOpen)
        );

      }
    );


    generatedMobileMenu
      .querySelectorAll("a")
      .forEach(link => {

        link.addEventListener(
          "click",
          () => {

            generatedMobileMenu
              .classList.remove("open");

            generatedMenuToggle
              .classList.remove("active");

            generatedMenuToggle.setAttribute(
              "aria-expanded",
              "false"
            );

          }
        );

      });

  }


  renderCustomSections();

  applySectionManager();

  setupGeneratedParallax();

  setupGeneratedReveal();


  fullscreenButton.disabled = false;
  exportButton.disabled = false;

  if (!isLiveRefresh) {

    requestAnimationFrame(() => {

      const previewTop =
        preview.getBoundingClientRect().top
        + window.scrollY
        - 90;

      window.scrollTo({
        top: Math.max(0, previewTop),
        behavior: "smooth"
      });

    });

  }

});


updateTemplateSectionChoices();


renderPageManager();


/* Structured link editor UI */

sectionManager?.addEventListener(
  "change",
  event => {

    const typeControl =
      event.target.closest(
        "[data-link-type-control]"
      );

    if (!typeControl) return;


    const wrapper =
      typeControl.closest(
        "[data-link-controls]"
      );

    if (!wrapper) return;


    wrapper
      .querySelectorAll(
        "[data-link-panel]"
      )
      .forEach(panel => {

        panel.hidden =
          panel.dataset.linkPanel !==
          typeControl.value;

      });

  }
);


/* -------------------------------------------------
   STRUCTURED PRODUCT / COLLECTION ITEMS
-------------------------------------------------- */

function getStructuredItemList(
  section,
  itemType
) {

  if (!section?.content) {
    return null;
  }


  if (itemType === "product") {

    if (
      !Array.isArray(
        section.content.productItems
      )
    ) {

      section.content.productItems =
        parseProductItems(
          section.content
        );

    }

    return section.content.productItems;

  }


  if (itemType === "collection") {

    if (
      !Array.isArray(
        section.content.collectionItems
      )
    ) {

      section.content.collectionItems =
        parseCollectionItems(
          section.content
        );

    }

    return section.content.collectionItems;

  }


  return null;

}


function createStructuredItemId(
  prefix
) {

  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {

    return crypto.randomUUID();

  }


  return `${
    prefix
  }-${
    Date.now()
  }-${
    Math.random()
      .toString(36)
      .slice(2, 8)
  }`;

}


function handleStructuredItemField(
  event
) {

  const control =
    event.target.closest(
      "[data-item-field]"
    );

  if (!control) return;


  const section =
    siteSections.find(
      item =>
        item.id ===
        control.dataset.itemField
    );

  if (!section) return;


  const list =
    getStructuredItemList(
      section,
      control.dataset.itemType
    );

  if (!list) return;


  const item =
    list.find(
      entry =>
        entry.id ===
        control.dataset.itemId
    );

  if (!item) return;


  const fieldName =
    control.dataset.itemFieldName;

  if (!fieldName) return;


  item[fieldName] =
    control.value;


  /*
    Reveal the correct destination control when
    Link Type changes.
  */

  if (
    fieldName === "linkType"
  ) {

    item.linkTarget = "";


    const wrapper =
      control.closest(
        "[data-item-link-controls]"
      );


    wrapper
      ?.querySelectorAll(
        "[data-item-link-panel]"
      )
      .forEach(panel => {

        panel.hidden =
          panel.dataset.itemLinkPanel !==
          control.value;

      });

  }


  scheduleLivePreview();

}


sectionManager?.addEventListener(
  "input",
  handleStructuredItemField
);


sectionManager?.addEventListener(
  "change",
  handleStructuredItemField
);


sectionManager?.addEventListener(
  "click",
  event => {

    const addButton =
      event.target.closest(
        "[data-add-structured-item]"
      );


    if (addButton) {

      const section =
        siteSections.find(
          item =>
            item.id ===
            addButton.dataset.addStructuredItem
        );

      if (!section) return;


      const itemType =
        addButton.dataset.itemType;


      const list =
        getStructuredItemList(
          section,
          itemType
        );

      if (!list) return;


      if (itemType === "product") {

        list.push({

          id:
            createStructuredItemId(
              "product"
            ),

          name:
            "New Product",

          description:
            "Add a short product description.",

          price:
            "",

          linkType:
            "none",

          linkTarget:
            "",

          linkUrl:
            ""

        });

      }


      if (itemType === "collection") {

        list.push({

          id:
            createStructuredItemId(
              "collection"
            ),

          name:
            "New Collection",

          description:
            "Add a short collection description.",

          linkType:
            "none",

          linkTarget:
            "",

          linkUrl:
            ""

        });

      }


      renderSectionManager();

      scheduleLivePreview();

      return;

    }


    const removeButton =
      event.target.closest(
        "[data-remove-structured-item]"
      );


    if (!removeButton) return;


    const section =
      siteSections.find(
        item =>
          item.id ===
          removeButton.dataset.removeStructuredItem
      );

    if (!section) return;


    const list =
      getStructuredItemList(
        section,
        removeButton.dataset.itemType
      );

    if (!list) return;


    const index =
      list.findIndex(
        item =>
          item.id ===
          removeButton.dataset.itemId
      );


    if (index === -1) return;


    list.splice(
      index,
      1
    );


    renderSectionManager();

    scheduleLivePreview();

  }
);


/* Structured item links inside builder preview */

preview?.addEventListener(
  "click",
  event => {

    const pageLink =
      event.target.closest(
        "[data-structured-page-link]"
      );


    if (pageLink) {

      event.preventDefault();


      const pageId =
        pageLink.dataset.structuredPageLink;


      if (pageId) {

        switchSitePage(
          pageId
        );

      }


      return;

    }


    const sectionLink =
      event.target.closest(
        "[data-structured-section-link]"
      );


    if (!sectionLink) return;


    event.preventDefault();


    const [
      pageId,
      sectionId
    ] =
      String(
        sectionLink.dataset.structuredSectionLink ||
        ""
      ).split(":");


    if (
      !pageId ||
      !sectionId
    ) {

      return;

    }


    const scrollToTarget = () => {

      const target =
        preview.querySelector(
          `#pg-${sectionId}`
        );

      if (!target) return;


      const appHeader =
        document.querySelector(
          ".app-header"
        );

      const generatedNav =
        preview.querySelector(
          ".pg-nav"
        );


      const offset =
        (appHeader?.offsetHeight || 0) +
        (generatedNav?.offsetHeight || 0) +
        16;


      const top =
        target.getBoundingClientRect().top +
        window.scrollY -
        offset;


      window.scrollTo({

        top:
          Math.max(
            0,
            top
          ),

        behavior:
          "smooth"

      });

    };


    if (
      pageId !== activePageId
    ) {

      switchSitePage(
        pageId
      );


      requestAnimationFrame(() => {

        requestAnimationFrame(
          scrollToTarget
        );

      });


    } else {

      scrollToTarget();

    }

  }
);



/* -------------------------------------------------
   USER GUIDE MODAL
------------------------------------------------- */

const userGuideModal =
  document.getElementById("user-guide-modal");

const openUserGuideButton =
  document.getElementById("open-user-guide");


function openUserGuide() {

  if (!userGuideModal) return;

  userGuideModal.hidden = false;

  document.body.classList.add("user-guide-open");

  const closeButton =
    userGuideModal.querySelector(".user-guide-close");

  closeButton?.focus();

}


function closeUserGuide() {

  if (!userGuideModal) return;

  userGuideModal.hidden = true;

  document.body.classList.remove("user-guide-open");

  openUserGuideButton?.focus();

}


openUserGuideButton?.addEventListener(
  "click",
  openUserGuide
);


userGuideModal?.addEventListener(
  "click",
  event => {

    if (
      event.target.closest(
        "[data-close-user-guide]"
      )
    ) {
      closeUserGuide();
    }

  }
);


document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Escape" &&
      userGuideModal &&
      !userGuideModal.hidden
    ) {
      closeUserGuide();
    }

  }
);
