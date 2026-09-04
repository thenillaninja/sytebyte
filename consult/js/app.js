const STORAGE_KEY = "sytebyte-consult-data";

const legacyStorageKey = "sytebyte-consult-workspace";

const defaultWorkspace = {
  currentStage: 1,
  maxStageReached: 1,
  userType: "",

  intake: {
    businessName: "",
    industry: "",
    website: "",
    location: "",
    businessGoal: ""
  },

  review: {
    websiteStatus: "",
    googleStatus: "",
    leadStatus: "",
    socialStatus: "",
    trustStatus: "",

    websiteNotes: "",
    googleNotes: "",
    leadNotes: "",
    socialNotes: "",
    trustNotes: ""
  },

  consultNotes: "",
  findings: [],
  priorities: []
};

const reviewDefinitions = [
  {
    key: "website",
    title: "Website",
    description:
      "Presence, clarity, usability and whether it supports the business."
  },
  {
    key: "google",
    title: "Google Presence",
    description:
      "Business profile, discoverability, reviews and basic local visibility."
  },
  {
    key: "lead",
    title: "Lead Capture",
    description:
      "How easily a potential customer can call, message, book or request service."
  },
  {
    key: "social",
    title: "Social Presence",
    description:
      "Active channels, consistency and whether they help customers trust the business."
  },
  {
    key: "trust",
    title: "Trust Signals",
    description:
      "Reviews, testimonials, photos, credentials, guarantees and proof of work."
  }
];

let appData = loadAppData();
let workspace = getActiveWorkspace();
let appView = "workspace";

const stageContent = document.getElementById("stageContent");
const completionMetric = document.getElementById("completionMetric");
const findingsMetric = document.getElementById("findingsMetric");
const prioritiesMetric = document.getElementById("prioritiesMetric");
const consultNotes = document.getElementById("consultNotes");

function createConsultation() {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...structuredClone(defaultWorkspace)
  };
}

function loadAppData() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved) {
    try {
      const parsed = JSON.parse(saved);

      if (
        Array.isArray(parsed.consultations) &&
        parsed.consultations.length
      ) {
        return parsed;
      }
    } catch (error) {
      console.error("Unable to load Consult data:", error);
    }
  }

  const legacy = localStorage.getItem(legacyStorageKey);

  if (legacy) {
    try {
      const legacyWorkspace = JSON.parse(legacy);
      const migrated = createConsultation();

      Object.assign(migrated, legacyWorkspace);

      migrated.intake = {
        ...defaultWorkspace.intake,
        ...(legacyWorkspace.intake || {})
      };

      migrated.review = {
        ...defaultWorkspace.review,
        ...(legacyWorkspace.review || {})
      };

      migrated.findings = Array.isArray(legacyWorkspace.findings)
        ? legacyWorkspace.findings
        : [];

      migrated.priorities = Array.isArray(legacyWorkspace.priorities)
        ? legacyWorkspace.priorities
        : [];

      migrated.maxStageReached =
        Math.max(
          migrated.currentStage || 1,
          legacyWorkspace.maxStageReached || 1
        );

      migrated.userType =
        legacyWorkspace.userType || "consultant";

      const data = {
        activeId: migrated.id,
        consultations: [migrated]
      };

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
      );

      return data;
    } catch (error) {
      console.error("Unable to migrate old Consult workspace:", error);
    }
  }

  const firstConsultation = createConsultation();

  return {
    activeId: firstConsultation.id,
    consultations: [firstConsultation]
  };
}

function getActiveWorkspace() {
  let active = appData.consultations.find(
    (consultation) => consultation.id === appData.activeId
  );

  if (!active) {
    active = appData.consultations[0];
    appData.activeId = active.id;
  }

  if (active.maxStageReached === undefined) {
    active.maxStageReached =
      Math.max(active.currentStage || 1, 1);
  }

  if (!active.userType) {
    active.userType = "consultant";
  }

  return active;
}

function saveWorkspace() {
  workspace.updatedAt = new Date().toISOString();

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(appData)
  );
}

function switchConsultation(id) {
  openConsultation(id);
}

function createNewConsultation() {
  const consultation = createConsultation();

  appData.consultations.unshift(consultation);
  appData.activeId = consultation.id;
  workspace = consultation;

  saveWorkspace();

  if (consultNotes) {
    consultNotes.value = "";
  }

  closeConsultationDrawer();
  renderStage();
}

function updateSaveStatus(text = "Saved locally") {
  const saveStatus = document.getElementById("saveStatus");

  if (saveStatus) {
    saveStatus.textContent = text;
  }
}

function setSaving() {
  updateSaveStatus("Saving...");

  window.clearTimeout(setSaving.timeout);

  setSaving.timeout = window.setTimeout(() => {
    updateSaveStatus("Saved locally");
  }, 500);
}

function updateWorkflow() {
  updateSidebarConsultation();

  const steps = document.querySelectorAll(".workflow-step");

  steps.forEach((step, index) => {
    const stepNumber = index + 1;
    const unlocked =
      stepNumber <= (workspace.maxStageReached || 1);

    step.classList.toggle(
      "active",
      stepNumber === workspace.currentStage
    );

    step.classList.toggle(
      "complete",
      stepNumber < workspace.currentStage
    );

    step.classList.toggle(
      "locked",
      !unlocked
    );

    step.setAttribute(
      "role",
      unlocked ? "button" : "presentation"
    );

    step.tabIndex = unlocked ? 0 : -1;

    step.setAttribute(
      "aria-disabled",
      unlocked ? "false" : "true"
    );

    step.onclick = null;
    step.onkeydown = null;

    if (unlocked) {
      step.onclick = () => {
        navigateToStage(stepNumber);
      };

      step.onkeydown = (event) => {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();
          navigateToStage(stepNumber);
        }
      };
    }
  });

  completionMetric.textContent =
    `${workspace.currentStage * 20}%`;

  findingsMetric.textContent =
    workspace.findings.length;

  prioritiesMetric.textContent =
    workspace.priorities.length;
}

function scrollWorkspaceToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function navigateToStage(stageNumber) {
  if (
    stageNumber < 1 ||
    stageNumber > 5 ||
    stageNumber > (workspace.maxStageReached || 1)
  ) {
    return;
  }

  workspace.currentStage = stageNumber;
  saveWorkspace();
  renderStage();
  scrollWorkspaceToTop();
}

function advanceToStage(stageNumber) {
  workspace.currentStage = stageNumber;
  workspace.maxStageReached =
    Math.max(
      workspace.maxStageReached || 1,
      stageNumber
    );

  saveWorkspace();
  renderStage();
  scrollWorkspaceToTop();
}

function updateSidebarConsultation() {
  const list =
    document.getElementById("consultationList");

  if (!list) return;

  const stageNames = {
    1: "Intake",
    2: "Review",
    3: "Analyze",
    4: "Prioritize",
    5: "Present"
  };

  list.innerHTML = appData.consultations
    .map((consultation) => {
      const businessName =
        consultation.intake?.businessName?.trim() ||
        "Untitled Consultation";

      const stageNumber =
        String(consultation.currentStage || 1)
          .padStart(2, "0");

      const stageName =
        consultation.userType
          ? stageNames[consultation.currentStage || 1]
          : "Choose mode";

      const active =
        consultation.id === appData.activeId;

      return `
        <button
          class="consultation-list-item ${active ? "active" : ""}"
          type="button"
          data-consultation-id="${consultation.id}"
        >
          <span class="active-consultation-dot"></span>

          <span class="active-consultation-copy">
            <strong>${escapeHTML(businessName)}</strong>
            <span>
              Stage ${stageNumber} · ${stageName}
            </span>
          </span>
        </button>
      `;
    })
    .join("");

  list
    .querySelectorAll("[data-consultation-id]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        switchConsultation(
          button.dataset.consultationId
        );
      });
    });
}

function bindInputs(scope, objectName) {
  scope.querySelectorAll("[data-field]").forEach((field) => {
    const handler = () => {
      workspace[objectName][field.dataset.field] = field.value;

      if (
        objectName === "intake" &&
        field.dataset.field === "businessName"
      ) {
        updateSidebarConsultation();
      }

      setSaving();
      saveWorkspace();
    };

    field.addEventListener("input", handler);
    field.addEventListener("change", handler);
  });
}

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderModeChooser() {
  stageContent.innerHTML = `
    <div class="mode-chooser">
      <div class="panel-header">
        <div>
          <p class="panel-label">GET STARTED</p>
          <h2>How are you using SyteByte Consult?</h2>
        </div>
      </div>

      <p class="stage-intro">
        Choose the experience that fits how you are reviewing the business.
      </p>

      <div class="mode-choice-grid">
        <button
          type="button"
          class="mode-choice-card"
          data-user-type="business"
        >
          <span class="mode-choice-kicker">BUSINESS OWNER</span>

          <strong>Review my own business</strong>

          <span>
            A guided path with simpler prompts to help you evaluate your business and build an action plan.
          </span>

          <span class="mode-choice-action">
            Start guided review →
          </span>
        </button>

        <button
          type="button"
          class="mode-choice-card"
          data-user-type="consultant"
        >
          <span class="mode-choice-kicker">CONSULTANT</span>

          <strong>Review a client business</strong>

          <span>
            A faster professional workspace for capturing observations, findings and recommendations.
          </span>

          <span class="mode-choice-action">
            Open consultant workspace →
          </span>
        </button>
      </div>
    </div>
  `;

  document
    .querySelectorAll("[data-user-type]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        workspace.userType =
          button.dataset.userType;

        workspace.currentStage = 1;
        workspace.maxStageReached =
          Math.max(workspace.maxStageReached || 1, 1);

        saveWorkspace();
        renderStage();
      });
    });
}

function isBusinessMode() {
  return workspace.userType === "business";
}

function renderIntake() {
  const businessMode = isBusinessMode();

  stageContent.innerHTML = `
    <div class="panel-header">
      <div>
        <p class="panel-label">
          ${businessMode ? "YOUR BUSINESS" : "BUSINESS"}
        </p>

        <h2>
          ${businessMode
            ? "Tell Us About Your Business"
            : "Consultation Intake"}
        </h2>
      </div>

      <span class="status-badge">
        ${businessMode ? "Guided Mode" : "Draft"}
      </span>
    </div>

    <p class="stage-intro">
      ${
        businessMode
          ? "Start with the basics. You do not need perfect answers — just capture what you know today."
          : "Capture the core business information and the reason for the consultation."
      }
    </p>

    <div class="form-grid">
      <label class="field">
        <span>
          ${businessMode ? "Your business name" : "Business name"}
        </span>

        <input
          data-field="businessName"
          type="text"
          placeholder="Example Business"
          value="${escapeHTML(workspace.intake.businessName)}"
        />
      </label>

      <label class="field">
        <span>Industry</span>

        <input
          data-field="industry"
          type="text"
          placeholder="Home services"
          value="${escapeHTML(workspace.intake.industry)}"
        />
      </label>

      <label class="field">
        <span>Website</span>

        <input
          data-field="website"
          type="url"
          placeholder="https://example.com"
          value="${escapeHTML(workspace.intake.website)}"
        />
      </label>

      <label class="field">
        <span>Location</span>

        <input
          data-field="location"
          type="text"
          placeholder="Fort Myers, FL"
          value="${escapeHTML(workspace.intake.location)}"
        />
      </label>
    </div>

    <label class="field">
      <span>
        ${
          businessMode
            ? "What would you most like to improve?"
            : "What does the business need help with?"
        }
      </span>

      <textarea
        data-field="businessGoal"
        rows="5"
        placeholder="${
          businessMode
            ? "Example: Get more leads, improve our website, show up better on Google, or make it easier for customers to contact us."
            : "Capture the owner's main problem, goal, or reason for the consultation."
        }"
      >${escapeHTML(workspace.intake.businessGoal)}</textarea>
    </label>

    <div class="panel-actions">
      <span class="save-status" id="saveStatus">
        Saved locally
      </span>

      <button class="secondary-button" id="continueButton">
        ${
          businessMode
            ? "Review My Business →"
            : "Continue to Review →"
        }
      </button>
    </div>
  `;

  bindInputs(stageContent, "intake");

  document
    .getElementById("continueButton")
    .addEventListener("click", () => {
      advanceToStage(2);
    });
}

function reviewRow(definition) {
  const statusKey = `${definition.key}Status`;
  const notesKey = `${definition.key}Notes`;

  return `
    <div class="review-item">
      <div class="review-copy">
        <strong>${definition.title}</strong>
        <span>${definition.description}</span>
      </div>

      <div class="review-controls">
        <select data-field="${statusKey}">
          <option value=""
            ${workspace.review[statusKey] === "" ? "selected" : ""}>
            Not reviewed
          </option>

          <option value="strong"
            ${workspace.review[statusKey] === "strong" ? "selected" : ""}>
            ${isBusinessMode() ? "Doing well" : "Strong"}
          </option>

          <option value="needs-work"
            ${workspace.review[statusKey] === "needs-work" ? "selected" : ""}>
            ${isBusinessMode() ? "Could be better" : "Needs work"}
          </option>

          <option value="missing"
            ${workspace.review[statusKey] === "missing" ? "selected" : ""}>
            ${isBusinessMode() ? "Not in place yet" : "Missing"}
          </option>

          <option value="not-relevant"
            ${workspace.review[statusKey] === "not-relevant" ? "selected" : ""}>
            Not relevant
          </option>
        </select>

        <input
          data-field="${notesKey}"
          type="text"
          placeholder="Quick observation..."
          value="${escapeHTML(workspace.review[notesKey])}"
        />
      </div>
    </div>
  `;
}

function renderReview() {
  const businessMode = isBusinessMode();

  stageContent.innerHTML = `
    <div class="panel-header">
      <div>
        <p class="panel-label">REVIEW</p>

        <h2>
          ${
            businessMode
              ? "How Is Your Business Doing Today?"
              : "What Exists Today?"
          }
        </h2>
      </div>

      <span class="status-badge">
        ${businessMode ? "Guided Review" : "Stage 02"}
      </span>
    </div>

    <p class="stage-intro">
      ${
        businessMode
          ? "Choose the option that best describes each area. Do not overthink it — this is just a snapshot of where things stand today."
          : "Capture the current state. This is observation, not diagnosis yet."
      }
    </p>

    <div class="review-list">
      ${reviewDefinitions.map(reviewRow).join("")}
    </div>

    <div class="panel-actions stage-nav-actions">
      <button class="text-button" id="backButton">
        ← Back to Intake
      </button>

      <div class="stage-action-right">
        <span class="save-status" id="saveStatus">
          Saved locally
        </span>

        <button class="secondary-button" id="analyzeButton">
          ${
            businessMode
              ? "See What It Means →"
              : "Continue to Analyze →"
          }
        </button>
      </div>
    </div>
  `;

  bindInputs(stageContent, "review");

  document
    .getElementById("backButton")
    .addEventListener("click", () => {
      navigateToStage(1);
    });

  document
    .getElementById("analyzeButton")
    .addEventListener("click", () => {
      generateFindingsFromReview();
      advanceToStage(3);
    });
}

function generateFindingsFromReview() {
  reviewDefinitions.forEach((definition) => {
    const status =
      workspace.review[`${definition.key}Status`];

    if (
      status !== "needs-work" &&
      status !== "missing"
    ) {
      return;
    }

    const existing = workspace.findings.find(
      (finding) =>
        finding.source === definition.key &&
        finding.autoGenerated
    );

    if (existing) {
      return;
    }

    const reviewNote =
      workspace.review[`${definition.key}Notes`] || "";

    workspace.findings.push({
      id: crypto.randomUUID(),
      source: definition.key,
      autoGenerated: true,
      status,
      title:
        status === "missing"
          ? `${definition.title} is missing`
          : `${definition.title} needs improvement`,
      evidence: reviewNote,
      impact: "",
      recommendation: "",
      impactLevel: "",
      effortLevel: "",
      selectedPriority: false
    });
  });
}

function draftImpactText(finding) {
  const title = (finding.title || "").toLowerCase();
  const evidence = (finding.evidence || "").trim();

  if (title.includes("website")) {
    return "A weak website experience can reduce trust, create friction and cause potential customers to leave before contacting the business.";
  }

  if (title.includes("google")) {
    return "Limited Google visibility can make the business harder to discover and reduce trust with customers comparing local options.";
  }

  if (title.includes("lead")) {
    return "If customers cannot quickly understand how to contact or book, the business may lose otherwise qualified leads.";
  }

  if (title.includes("social")) {
    return "An inconsistent social presence can weaken credibility and make the business appear less active or established.";
  }

  if (title.includes("trust")) {
    return "Weak trust signals can make customers hesitate, especially when comparing the business with competitors that show stronger proof.";
  }

  if (evidence) {
    return `This matters because ${evidence.charAt(0).toLowerCase()}${evidence.slice(1)} can create unnecessary friction, reduce trust or limit conversion.`;
  }

  return "This issue may reduce customer confidence, create friction or limit the business's ability to convert interest into action.";
}

function draftRecommendationText(finding) {
  const title = (finding.title || "").toLowerCase();
  const evidence = (finding.evidence || "").toLowerCase();

  if (
    title.includes("website") ||
    evidence.includes("cta")
  ) {
    return "Add a clear primary call to action and make the next step obvious on the most important pages.";
  }

  if (title.includes("google")) {
    return "Create or fully optimize the Google Business Profile, confirm core business information and begin building a consistent review process.";
  }

  if (title.includes("lead")) {
    return "Simplify the contact path so customers can call, message, book or request service with minimal steps.";
  }

  if (title.includes("social")) {
    return "Focus on the channels customers actually use and maintain a simple, consistent posting cadence with current business information.";
  }

  if (title.includes("trust")) {
    return "Add stronger proof such as reviews, testimonials, project photos, credentials, guarantees or other customer confidence signals.";
  }

  return "Address the issue with the smallest practical change that removes friction, improves clarity and supports the business goal.";
}

function refineFindingTitle(finding) {
  const raw = (finding.title || "").trim();

  if (!raw) {
    return "Untitled opportunity";
  }

  return raw
    .replace(/\s+/g, " ")
    .replace(/\bis missing\b/i, "is not currently in place")
    .replace(/\bneeds improvement\b/i, "has room for improvement");
}

function applyLocalAssist(id, action) {
  const finding = workspace.findings.find(
    (item) => item.id === id
  );

  if (!finding) return;

  if (action === "impact") {
    finding.impact = draftImpactText(finding);
  }

  if (action === "recommendation") {
    finding.recommendation =
      draftRecommendationText(finding);
  }

  if (action === "title") {
    finding.title = refineFindingTitle(finding);
  }

  saveWorkspace();
  renderStage();
}

function renderFindingCard(finding, index) {
  return `
    <article class="finding-card" data-finding-id="${finding.id}">
      <div class="finding-topline">
        <div class="finding-number">
          ${String(index + 1).padStart(2, "0")}
        </div>

        <div class="finding-source">
          ${finding.autoGenerated
            ? "FROM REVIEW"
            : "MANUAL FINDING"}
        </div>

        <button
          class="finding-remove"
          type="button"
          data-remove-finding="${finding.id}"
          aria-label="Remove finding"
        >
          ×
        </button>
      </div>

      <label class="field">
        <div class="field-heading-row">
          <span>Finding</span>

          <button
            type="button"
            class="assist-button"
            data-assist-action="title"
            data-assist-id="${finding.id}"
          >
            Refine
          </button>
        </div>

        <input
          type="text"
          data-finding-field="title"
          value="${escapeHTML(finding.title)}"
          placeholder="Describe the issue or opportunity"
        />
      </label>

      <label class="field">
        <span>Evidence / observation</span>
        <textarea
          rows="3"
          data-finding-field="evidence"
          placeholder="What did you observe?"
        >${escapeHTML(finding.evidence)}</textarea>
      </label>

      <div class="finding-grid">
        <label class="field">
          <div class="field-heading-row">
            <span>Why it matters</span>

            <button
              type="button"
              class="assist-button"
              data-assist-action="impact"
              data-assist-id="${finding.id}"
            >
              Draft Impact
            </button>
          </div>

          <textarea
            rows="3"
            data-finding-field="impact"
            placeholder="Explain the likely business impact."
          >${escapeHTML(finding.impact)}</textarea>
        </label>

        <label class="field">
          <div class="field-heading-row">
            <span>Recommended action</span>

            <button
              type="button"
              class="assist-button"
              data-assist-action="recommendation"
              data-assist-id="${finding.id}"
            >
              Draft Action
            </button>
          </div>

          <textarea
            rows="3"
            data-finding-field="recommendation"
            placeholder="What should the business do next?"
          >${escapeHTML(finding.recommendation)}</textarea>
        </label>
      </div>
    </article>
  `;
}

function renderAnalyze() {
  const findingMarkup = workspace.findings.length
    ? workspace.findings
        .map(renderFindingCard)
        .join("")
    : `
      <div class="empty-state">
        <strong>No findings yet.</strong>

        <span>
          Review items marked Needs work or Missing will appear here automatically.
        </span>
      </div>
    `;

  stageContent.innerHTML = `
    <div class="panel-header">
      <div>
        <p class="panel-label">ANALYZE</p>
        <h2>Build the Recommendation</h2>
      </div>

      <span class="status-badge">
        ${workspace.findings.length}
        ${workspace.findings.length === 1
          ? "Finding"
          : "Findings"}
      </span>
    </div>

    <p class="stage-intro">
      Turn observations into clear opportunities, business impact and recommended action.
    </p>

    <div class="analyze-toolbar">
      <div class="analyze-summary">
        <strong>${workspace.findings.length}</strong>
        <span>identified opportunities</span>
      </div>

      <button
        class="secondary-button compact-button"
        id="addFindingButton"
        type="button"
      >
        + Add Finding
      </button>
    </div>

    <div class="findings-list">
      ${findingMarkup}
    </div>

    <div class="panel-actions stage-nav-actions">
      <button class="text-button" id="backToReviewButton">
        ← Back to Review
      </button>

      <div class="stage-action-right">
        <span class="save-status" id="saveStatus">
          Saved locally
        </span>

        <button
          class="secondary-button"
          id="prioritizeButton"
        >
          Continue to Prioritize →
        </button>
      </div>
    </div>
  `;

  bindFindingInputs();

  document
    .getElementById("addFindingButton")
    .addEventListener("click", () => {
      workspace.findings.push({
        id: crypto.randomUUID(),
        source: "manual",
        autoGenerated: false,
        status: "",
        title: "",
        evidence: "",
        impact: "",
        recommendation: "",
        impactLevel: "",
        effortLevel: "",
        selectedPriority: false
      });

      saveWorkspace();
      renderStage();
    });

  document
    .getElementById("backToReviewButton")
    .addEventListener("click", () => {
      advanceToStage(2);
    });

  document
    .getElementById("prioritizeButton")
    .addEventListener("click", () => {
      ensurePriorityFields();

      advanceToStage(4);
    });
}

function bindFindingInputs() {
  document
    .querySelectorAll("[data-finding-id]")
    .forEach((card) => {
      const id = card.dataset.findingId;

      const finding = workspace.findings.find(
        (item) => item.id === id
      );

      if (!finding) return;

      card
        .querySelectorAll("[data-finding-field]")
        .forEach((field) => {
          field.addEventListener("input", () => {
            finding[field.dataset.findingField] =
              field.value;

            setSaving();
            saveWorkspace();
          });
        });
    });

  document
    .querySelectorAll("[data-assist-action]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        applyLocalAssist(
          button.dataset.assistId,
          button.dataset.assistAction
        );
      });
    });

  document
    .querySelectorAll("[data-remove-finding]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.removeFinding;

        workspace.findings =
          workspace.findings.filter(
            (finding) => finding.id !== id
          );

        workspace.priorities =
          workspace.priorities.filter(
            (priorityId) => priorityId !== id
          );

        saveWorkspace();
        renderStage();
      });
    });
}

function ensurePriorityFields() {
  workspace.findings.forEach((finding) => {
    if (finding.impactLevel === undefined) {
      finding.impactLevel = "";
    }

    if (finding.effortLevel === undefined) {
      finding.effortLevel = "";
    }

    if (finding.selectedPriority === undefined) {
      finding.selectedPriority = false;
    }
  });
}

function priorityScore(finding) {
  const impactScores = {
    high: 3,
    medium: 2,
    low: 1
  };

  const effortScores = {
    low: 3,
    medium: 2,
    high: 1
  };

  const impact = impactScores[finding.impactLevel] || 0;
  const effort = effortScores[finding.effortLevel] || 0;

  return impact + effort;
}

function priorityLabel(score) {
  if (score >= 6) return "Quick Win";
  if (score >= 5) return "High";
  if (score >= 4) return "Medium";
  if (score >= 2) return "Low";

  return "Unscored";
}

function sortedFindingsForPriority() {
  return [...workspace.findings].sort((a, b) => {
    return priorityScore(b) - priorityScore(a);
  });
}

function renderPriorityCard(finding, index) {
  const score = priorityScore(finding);
  const label = priorityLabel(score);

  return `
    <article class="priority-card" data-priority-id="${finding.id}">
      <div class="priority-main">
        <div class="priority-order">
          ${String(index + 1).padStart(2, "0")}
        </div>

        <div class="priority-copy">
          <strong>
            ${escapeHTML(finding.title || "Untitled finding")}
          </strong>

          <span>
            ${escapeHTML(
              finding.recommendation ||
              finding.evidence ||
              "No recommendation added yet."
            )}
          </span>
        </div>

        <div class="priority-score">
          <span class="priority-badge">
            ${label}
          </span>
        </div>
      </div>

      <div class="priority-controls">
        <label class="field">
          <span>Impact</span>

          <select data-priority-field="impactLevel">
            <option value=""
              ${finding.impactLevel === "" ? "selected" : ""}>
              Select
            </option>

            <option value="high"
              ${finding.impactLevel === "high" ? "selected" : ""}>
              High
            </option>

            <option value="medium"
              ${finding.impactLevel === "medium" ? "selected" : ""}>
              Medium
            </option>

            <option value="low"
              ${finding.impactLevel === "low" ? "selected" : ""}>
              Low
            </option>
          </select>
        </label>

        <label class="field">
          <span>Effort</span>

          <select data-priority-field="effortLevel">
            <option value=""
              ${finding.effortLevel === "" ? "selected" : ""}>
              Select
            </option>

            <option value="low"
              ${finding.effortLevel === "low" ? "selected" : ""}>
              Low
            </option>

            <option value="medium"
              ${finding.effortLevel === "medium" ? "selected" : ""}>
              Medium
            </option>

            <option value="high"
              ${finding.effortLevel === "high" ? "selected" : ""}>
              High
            </option>
          </select>
        </label>

        <label class="priority-toggle">
          <input
            type="checkbox"
            data-priority-select
            ${finding.selectedPriority ? "checked" : ""}
          />

          <span>
            Add to action plan
          </span>
        </label>
      </div>
    </article>
  `;
}

function syncPriorities() {
  workspace.priorities =
    workspace.findings
      .filter((finding) => finding.selectedPriority)
      .sort((a, b) => priorityScore(b) - priorityScore(a))
      .map((finding) => finding.id);

  saveWorkspace();
  updateWorkflow();
}

function renderPrioritize() {
  ensurePriorityFields();

  const sorted = sortedFindingsForPriority();

  const priorityMarkup = sorted.length
    ? sorted
        .map(renderPriorityCard)
        .join("")
    : `
      <div class="empty-state">
        <strong>No findings to prioritize.</strong>

        <span>
          Add findings in Analyze before building the action plan.
        </span>
      </div>
    `;

  stageContent.innerHTML = `
    <div class="panel-header">
      <div>
        <p class="panel-label">PRIORITIZE</p>
        <h2>What Matters Most?</h2>
      </div>

      <span class="status-badge">
        ${workspace.priorities.length}
        ${workspace.priorities.length === 1
          ? "Priority"
          : "Priorities"}
      </span>
    </div>

    <p class="stage-intro">
      Balance business impact against effort, then choose what belongs in the action plan.
    </p>

    <div class="priority-legend">
      <div>
        <strong>Impact</strong>
        <span>How much value or risk is involved?</span>
      </div>

      <div>
        <strong>Effort</strong>
        <span>How difficult is it to execute?</span>
      </div>

      <div>
        <strong>Suggested order</strong>
        <span>Higher impact and lower effort rise to the top.</span>
      </div>
    </div>

    <div class="priority-list">
      ${priorityMarkup}
    </div>

    <div class="panel-actions stage-nav-actions">
      <button class="text-button" id="backToAnalyzeButton">
        ← Back to Analyze
      </button>

      <div class="stage-action-right">
        <span class="save-status" id="saveStatus">
          Saved locally
        </span>

        <button
          class="secondary-button"
          id="presentButton"
        >
          Continue to Present →
        </button>
      </div>
    </div>
  `;

  bindPriorityInputs();

  document
    .getElementById("backToAnalyzeButton")
    .addEventListener("click", () => {
      advanceToStage(3);
    });

  document
    .getElementById("presentButton")
    .addEventListener("click", () => {
      syncPriorities();

      advanceToStage(5);
    });
}

function selectedPriorityFindings() {
  return workspace.priorities
    .map((id) =>
      workspace.findings.find((finding) => finding.id === id)
    )
    .filter(Boolean);
}

function reviewSnapshotItems() {
  return reviewDefinitions
    .map((definition) => {
      const status =
        workspace.review[`${definition.key}Status`];

      const note =
        workspace.review[`${definition.key}Notes`];

      return {
        title: definition.title,
        status,
        note
      };
    })
    .filter((item) => item.status);
}

function reviewStatusLabel(status) {
  const labels = {
    strong: "Strong",
    "needs-work": "Needs work",
    missing: "Missing",
    "not-relevant": "Not relevant"
  };

  return labels[status] || "Not reviewed";
}

function renderPresent() {
  const priorities = selectedPriorityFindings();
  const snapshot = reviewSnapshotItems();

  const snapshotMarkup = snapshot.length
    ? snapshot.map((item) => `
        <div class="present-snapshot-item">
          <div>
            <strong>${escapeHTML(item.title)}</strong>
            <span>${escapeHTML(item.note || "No note added.")}</span>
          </div>

          <span class="present-status">
            ${reviewStatusLabel(item.status)}
          </span>
        </div>
      `).join("")
    : `
      <div class="empty-state">
        <strong>No review snapshot yet.</strong>
        <span>Complete Review to populate this section.</span>
      </div>
    `;

  const findingsMarkup = workspace.findings.length
    ? workspace.findings.map((finding, index) => `
        <div class="present-finding">
          <span class="present-index">
            ${String(index + 1).padStart(2, "0")}
          </span>

          <div class="present-finding-copy">
            <strong>
              ${escapeHTML(finding.title || "Untitled finding")}
            </strong>

            <span>
              ${escapeHTML(
                finding.impact ||
                finding.evidence ||
                "No detail added."
              )}
            </span>
          </div>
        </div>
      `).join("")
    : `
      <div class="empty-state">
        <strong>No findings yet.</strong>
        <span>Complete Analyze to populate this section.</span>
      </div>
    `;

  const prioritiesMarkup = priorities.length
    ? priorities.map((finding, index) => `
        <article class="present-priority-card">
          <div class="present-priority-top">
            <span class="present-index">
              ${String(index + 1).padStart(2, "0")}
            </span>

            <strong>
              ${escapeHTML(finding.title || "Untitled priority")}
            </strong>

            <span class="priority-badge">
              ${priorityLabel(priorityScore(finding))}
            </span>
          </div>

          <div class="present-priority-grid">
            <div>
              <span class="present-label">Recommended action</span>
              <p>
                ${escapeHTML(
                  finding.recommendation ||
                  "No recommendation added yet."
                )}
              </p>
            </div>

            <div>
              <span class="present-label">Why it matters</span>
              <p>
                ${escapeHTML(
                  finding.impact ||
                  "No business impact added yet."
                )}
              </p>
            </div>
          </div>

          <div class="present-meta">
            <span>
              Impact:
              <strong>${escapeHTML(finding.impactLevel || "Unscored")}</strong>
            </span>

            <span>
              Effort:
              <strong>${escapeHTML(finding.effortLevel || "Unscored")}</strong>
            </span>
          </div>
        </article>
      `).join("")
    : `
      <div class="empty-state">
        <strong>No priorities selected.</strong>
        <span>
          Go back to Prioritize and add findings to the action plan.
        </span>
      </div>
    `;

  stageContent.innerHTML = `
    <div class="present-toolbar no-print">
      <div>
        <p class="panel-label">PRESENT</p>
        <h2>Client Action Plan</h2>
      </div>

      <div class="present-toolbar-actions">
        <button class="text-button" id="backToPrioritizeButton">
          ← Back to Prioritize
        </button>

        <button class="primary-button" id="printPlanButton">
          Print / Save PDF
        </button>
      </div>
    </div>

    <div class="present-sheet" id="presentSheet">
      <header class="present-header">
        <div>
          <p class="present-kicker">SYTEBYTE CONSULT</p>
          <h2>
            ${escapeHTML(
              workspace.intake.businessName ||
              "Untitled Consultation"
            )}
          </h2>

          <p class="present-subtitle">
            Business Snapshot & Recommended Action Plan
          </p>
        </div>

        <div class="present-business-meta">
          ${workspace.intake.industry
            ? `<span>${escapeHTML(workspace.intake.industry)}</span>`
            : ""}

          ${workspace.intake.location
            ? `<span>${escapeHTML(workspace.intake.location)}</span>`
            : ""}
        </div>
      </header>

      <section class="present-section">
        <div class="present-section-heading">
          <span>01</span>
          <div>
            <p class="panel-label">BUSINESS GOAL</p>
            <h3>What the business needs</h3>
          </div>
        </div>

        <div class="present-copy-block">
          ${escapeHTML(
            workspace.intake.businessGoal ||
            "No business goal was added during intake."
          )}
        </div>
      </section>

      <section class="present-section">
        <div class="present-section-heading">
          <span>02</span>
          <div>
            <p class="panel-label">CURRENT STATE</p>
            <h3>Business snapshot</h3>
          </div>
        </div>

        <div class="present-snapshot-list">
          ${snapshotMarkup}
        </div>
      </section>

      <section class="present-section">
        <div class="present-section-heading">
          <span>03</span>
          <div>
            <p class="panel-label">KEY FINDINGS</p>
            <h3>What needs attention</h3>
          </div>
        </div>

        <div class="present-findings-list">
          ${findingsMarkup}
        </div>
      </section>

      <section class="present-section">
        <div class="present-section-heading">
          <span>04</span>
          <div>
            <p class="panel-label">ACTION PLAN</p>
            <h3>Recommended priorities</h3>
          </div>
        </div>

        <div class="present-priority-list">
          ${prioritiesMarkup}
        </div>
      </section>
    </div>
  `;

  document
    .getElementById("backToPrioritizeButton")
    .addEventListener("click", () => {
      advanceToStage(4);
    });

  document
    .getElementById("printPlanButton")
    .addEventListener("click", () => {
      window.print();
    });
}

function bindPriorityInputs() {
  document
    .querySelectorAll("[data-priority-id]")
    .forEach((card) => {
      const id = card.dataset.priorityId;

      const finding = workspace.findings.find(
        (item) => item.id === id
      );

      if (!finding) return;

      card
        .querySelectorAll("[data-priority-field]")
        .forEach((field) => {
          field.addEventListener("change", () => {
            finding[field.dataset.priorityField] =
              field.value;

            syncPriorities();
            renderStage();
          });
        });

      const checkbox =
        card.querySelector("[data-priority-select]");

      if (checkbox) {
        checkbox.addEventListener("change", () => {
          finding.selectedPriority =
            checkbox.checked;

          syncPriorities();
          renderStage();
        });
      }
    });
}

function formatUpdatedDate(value) {
  if (!value) return "No activity yet";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "No activity yet";
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function stageLabel(stage) {
  const labels = {
    1: "Intake",
    2: "Review",
    3: "Analyze",
    4: "Prioritize",
    5: "Present"
  };

  return labels[stage] || "Intake";
}

function openConsultation(id) {
  const target = appData.consultations.find(
    (consultation) => consultation.id === id
  );

  if (!target) return;

  appData.activeId = id;
  workspace = target;
  appView = "workspace";

  saveWorkspace();

  if (consultNotes) {
    consultNotes.value = workspace.consultNotes || "";
  }

  closeConsultationDrawer();
  renderStage();
}

function renameConsultation(id) {
  const consultation = appData.consultations.find(
    (item) => item.id === id
  );

  if (!consultation) return;

  const currentName =
    consultation.intake?.businessName?.trim() ||
    "Untitled Consultation";

  const nextName = window.prompt(
    "Rename consultation",
    currentName
  );

  if (nextName === null) return;

  const trimmed = nextName.trim();

  consultation.intake.businessName =
    trimmed || "Untitled Consultation";

  consultation.updatedAt = new Date().toISOString();

  saveWorkspace();
  renderConsultationsView();
}

function exportConsultation(id) {
  const consultation = appData.consultations.find(
    (item) => item.id === id
  );

  if (!consultation) return;

  const exportData = {
    type: "sytebyte-consultation",
    version: 1,
    exportedAt: new Date().toISOString(),
    consultation
  };

  const blob = new Blob(
    [JSON.stringify(exportData, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);

  const name =
    consultation.intake?.businessName?.trim() ||
    "untitled-consultation";

  const safeName = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download =
    `${safeName || "consultation"}-sytebyte-consult.json`;

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}

function duplicateConsultation(id) {
  const original = appData.consultations.find(
    (item) => item.id === id
  );

  if (!original) return;

  const duplicate = structuredClone(original);

  duplicate.id = crypto.randomUUID();
  duplicate.createdAt = new Date().toISOString();
  duplicate.updatedAt = new Date().toISOString();

  const originalName =
    duplicate.intake?.businessName?.trim() ||
    "Untitled Consultation";

  duplicate.intake.businessName =
    `${originalName} Copy`;

  appData.consultations.unshift(duplicate);

  saveWorkspace();
  renderConsultationsView();
}

function normalizeImportedConsultation(raw) {
  const source =
    raw?.type === "sytebyte-consultation"
      ? raw.consultation
      : raw;

  if (!source || typeof source !== "object") {
    throw new Error("Invalid consultation file.");
  }

  const imported = createConsultation();

  Object.assign(imported, source);

  imported.id = crypto.randomUUID();
  imported.createdAt = new Date().toISOString();
  imported.updatedAt = new Date().toISOString();

  imported.intake = {
    ...defaultWorkspace.intake,
    ...(source.intake || {})
  };

  const importedName =
    imported.intake.businessName?.trim() ||
    "Untitled Consultation";

  imported.intake.businessName =
    `${importedName} (Imported)`;

  imported.review = {
    ...defaultWorkspace.review,
    ...(source.review || {})
  };

  imported.findings =
    Array.isArray(source.findings)
      ? source.findings.map((finding) => ({
          ...finding,
          id: crypto.randomUUID()
        }))
      : [];

  const oldToNewPriorityIds = new Map();

  if (
    Array.isArray(source.findings) &&
    Array.isArray(imported.findings)
  ) {
    source.findings.forEach((oldFinding, index) => {
      if (
        oldFinding?.id &&
        imported.findings[index]?.id
      ) {
        oldToNewPriorityIds.set(
          oldFinding.id,
          imported.findings[index].id
        );
      }
    });
  }

  imported.priorities =
    Array.isArray(source.priorities)
      ? source.priorities
          .map((oldId) =>
            oldToNewPriorityIds.get(oldId)
          )
          .filter(Boolean)
      : [];

  imported.currentStage =
    Math.min(
      5,
      Math.max(
        1,
        Number(source.currentStage) || 1
      )
    );

  imported.maxStageReached =
    Math.min(
      5,
      Math.max(
        imported.currentStage,
        Number(source.maxStageReached) || imported.currentStage
      )
    );

  imported.userType =
    source.userType === "business"
      ? "business"
      : "consultant";

  imported.consultNotes =
    typeof source.consultNotes === "string"
      ? source.consultNotes
      : "";

  return imported;
}

function importConsultationFile(file) {
  const reader = new FileReader();

  reader.addEventListener("load", () => {
    try {
      const parsed = JSON.parse(reader.result);
      const imported =
        normalizeImportedConsultation(parsed);

      appData.consultations.unshift(imported);
      appData.activeId = imported.id;
      workspace = imported;

      saveWorkspace();
      renderConsultationsView();

      window.alert(
        `Imported "${
          imported.intake.businessName ||
          "Untitled Consultation"
        }".`
      );
    } catch (error) {
      console.error(error);

      window.alert(
        "That file could not be imported as a SyteByte consultation."
      );
    }
  });

  reader.readAsText(file);
}

function deleteConsultation(id) {
  const consultation = appData.consultations.find(
    (item) => item.id === id
  );

  if (!consultation) return;

  const name =
    consultation.intake?.businessName?.trim() ||
    "Untitled Consultation";

  const confirmed = window.confirm(
    `Delete "${name}"? This cannot be undone.`
  );

  if (!confirmed) return;

  appData.consultations =
    appData.consultations.filter(
      (item) => item.id !== id
    );

  if (!appData.consultations.length) {
    const replacement = createConsultation();

    appData.consultations.push(replacement);
    appData.activeId = replacement.id;
    workspace = replacement;
  } else if (appData.activeId === id) {
    appData.activeId = appData.consultations[0].id;
    workspace = appData.consultations[0];
  }

  saveWorkspace();
  renderConsultationsView();
}

function renderConsultationsView() {
  appView = "consultations";

  const consultSideStack =
    document.getElementById("consultSideStack");

  if (consultSideStack) {
    consultSideStack.hidden = true;
  }

  const sortedConsultations = [...appData.consultations]
    .sort((a, b) => {
      return new Date(b.updatedAt || 0) -
        new Date(a.updatedAt || 0);
    });

  stageContent.innerHTML = `
    <div class="panel-header">
      <div>
        <p class="panel-label">CONSULTATIONS</p>
        <h2>Saved Consultations</h2>
      </div>

      <div class="consultation-manager-header-actions">
        <span class="status-badge">
          ${sortedConsultations.length}
          ${sortedConsultations.length === 1
            ? "Consultation"
            : "Consultations"}
        </span>

        <button
          class="secondary-button compact-button"
          type="button"
          id="importConsultationButton"
        >
          Import
        </button>
      </div>
    </div>

    <p class="stage-intro">
      Open, rename or remove saved consultation workspaces.
    </p>

    <div class="consultation-manager-list">
      ${sortedConsultations.map((consultation) => {
        const name =
          consultation.intake?.businessName?.trim() ||
          "Untitled Consultation";

        const stage =
          consultation.currentStage || 1;

        const findings =
          Array.isArray(consultation.findings)
            ? consultation.findings.length
            : 0;

        const priorities =
          Array.isArray(consultation.priorities)
            ? consultation.priorities.length
            : 0;

        return `
          <article class="consultation-manager-card">
            <div class="consultation-manager-main">
              <div class="consultation-manager-title">
                <strong>${escapeHTML(name)}</strong>

                <span>
                  Stage ${String(stage).padStart(2, "0")}
                  · ${stageLabel(stage)}
                </span>
              </div>

              <div class="consultation-manager-meta">
                <span>
                  ${findings}
                  ${findings === 1 ? "finding" : "findings"}
                </span>

                <span>
                  ${priorities}
                  ${priorities === 1 ? "priority" : "priorities"}
                </span>

                <span>
                  Updated ${formatUpdatedDate(consultation.updatedAt)}
                </span>
              </div>
            </div>

            <div class="consultation-manager-actions">
              <button
                class="secondary-button compact-button"
                type="button"
                data-open-consultation="${consultation.id}"
              >
                Open
              </button>

              <button
                class="text-button"
                type="button"
                data-duplicate-consultation="${consultation.id}"
              >
                Duplicate
              </button>

              <button
                class="text-button"
                type="button"
                data-export-consultation="${consultation.id}"
              >
                Export
              </button>

              <button
                class="text-button"
                type="button"
                data-rename-consultation="${consultation.id}"
              >
                Rename
              </button>

              <button
                class="text-button danger-text-button"
                type="button"
                data-delete-consultation="${consultation.id}"
              >
                Delete
              </button>
            </div>
          </article>
        `;
      }).join("")}
    </div>
  `;

  document
    .querySelectorAll("[data-open-consultation]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        openConsultation(
          button.dataset.openConsultation
        );
      });
    });

  document
    .querySelectorAll("[data-rename-consultation]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        renameConsultation(
          button.dataset.renameConsultation
        );
      });
    });

  document
    .querySelectorAll("[data-duplicate-consultation]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        duplicateConsultation(
          button.dataset.duplicateConsultation
        );
      });
    });

  document
    .querySelectorAll("[data-export-consultation]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        exportConsultation(
          button.dataset.exportConsultation
        );
      });
    });

  const importButton =
    document.getElementById("importConsultationButton");

  const importInput =
    document.getElementById("consultImportInput");

  if (importButton && importInput) {
    importButton.addEventListener("click", () => {
      importInput.value = "";
      importInput.click();
    });
  }

  document
    .querySelectorAll("[data-delete-consultation]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        deleteConsultation(
          button.dataset.deleteConsultation
        );
      });
    });

  updateSidebarConsultation();
}

function openConsultationDrawer() {
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const button = document.getElementById("mobileConsultationsButton");

  if (sidebar) {
    sidebar.classList.add("drawer-open");
  }

  if (overlay) {
    overlay.hidden = false;
  }

  if (button) {
    button.setAttribute("aria-expanded", "true");
  }

  document.body.classList.add("drawer-active");
}

function closeConsultationDrawer() {
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const button = document.getElementById("mobileConsultationsButton");

  if (sidebar) {
    sidebar.classList.remove("drawer-open");
  }

  if (overlay) {
    overlay.hidden = true;
  }

  if (button) {
    button.setAttribute("aria-expanded", "false");
  }

  document.body.classList.remove("drawer-active");
}

function renderStage() {
  appView = "workspace";

  if (!workspace.userType) {
    renderModeChooser();
    updateSidebarConsultation();
    return;
  }

  updateWorkflow();

  const consultSideStack =
    document.getElementById("consultSideStack");

  if (consultSideStack) {
    consultSideStack.hidden =
      workspace.currentStage === 5;
  }

  switch (workspace.currentStage) {
    case 1:
      renderIntake();
      break;

    case 2:
      renderReview();
      break;

    case 3:
      renderAnalyze();
      break;

    case 4:
      renderPrioritize();
      break;

    case 5:
      renderPresent();
      break;

    default:
      workspace.currentStage = 1;
      renderIntake();
  }

  updateWorkflow();
}

document
  .getElementById("newConsultationButton")
  .addEventListener("click", () => {
    createNewConsultation();
  });


if (consultNotes) {
  consultNotes.value =
    workspace.consultNotes || "";

  consultNotes.addEventListener("input", () => {
    workspace.consultNotes =
      consultNotes.value;

    saveWorkspace();
  });
}

const consultationsNavButton =
  document.getElementById("consultationsNavButton");

if (consultationsNavButton) {
  consultationsNavButton.addEventListener("click", () => {
    closeConsultationDrawer();
    renderConsultationsView();
  });
}

const sidebarNewConsultationButton =
  document.getElementById("sidebarNewConsultationButton");

if (sidebarNewConsultationButton) {
  sidebarNewConsultationButton.addEventListener("click", () => {
    createNewConsultation();
  });
}

const mobileConsultationsButton =
  document.getElementById("mobileConsultationsButton");

const sidebarOverlay =
  document.getElementById("sidebarOverlay");

if (mobileConsultationsButton) {
  mobileConsultationsButton.addEventListener("click", () => {
    const sidebar = document.querySelector(".sidebar");

    if (sidebar?.classList.contains("drawer-open")) {
      closeConsultationDrawer();
    } else {
      openConsultationDrawer();
    }
  });
}

if (sidebarOverlay) {
  sidebarOverlay.addEventListener("click", () => {
    closeConsultationDrawer();
  });
}

window.addEventListener("resize", () => {
  if (window.innerWidth > 900) {
    closeConsultationDrawer();
  }
});

const consultImportInput =
  document.getElementById("consultImportInput");

if (consultImportInput) {
  consultImportInput.addEventListener("change", () => {
    const file = consultImportInput.files?.[0];

    if (!file) return;

    importConsultationFile(file);
  });
}

renderStage();
