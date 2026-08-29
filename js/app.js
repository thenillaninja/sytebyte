const form = document.querySelector("#business-form");

const preview = document.querySelector("#site-preview");
const previewTitle = document.querySelector("#preview-title");

const previewButtons = document.querySelectorAll("[data-preview]");
const paletteButtons = document.querySelectorAll("[data-palette]");


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


previewButtons.forEach(button => {

  button.addEventListener("click", () => {

    previewButtons.forEach(btn => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    const mode = button.dataset.preview;

    preview.classList.toggle(
      "mobile",
      mode === "mobile"
    );

  });

});


form.addEventListener("submit", event => {

  event.preventDefault();

  const businessName =
    document.querySelector("#business-name").value.trim()
    || "Your Business";

  previewTitle.textContent = businessName;

  preview.innerHTML = `
    <div style="
      min-height:750px;
      display:grid;
      place-items:center;
      padding:50px;
      text-align:center;
      font-family:Arial,sans-serif;
      background:#ffffff;
    ">

      <div>

        <p style="
          text-transform:uppercase;
          letter-spacing:.15em;
          font-size:12px;
          font-weight:700;
          color:${colors.accent.value};
        ">
          Pindrop Preview
        </p>

        <h1 style="
          max-width:900px;
          font-size:clamp(42px,8vw,90px);
          line-height:.95;
          letter-spacing:-.06em;
          margin:12px 0 20px;
          color:${colors.primary.value};
        ">
          ${businessName}
        </h1>

        <p style="
          color:#667085;
          font-size:18px;
          margin-bottom:30px;
        ">
          Site generation engine coming next.
        </p>

        <button style="
          border:0;
          border-radius:10px;
          padding:14px 22px;
          background:${colors.button.value};
          color:${colors.buttonText.value};
          font-weight:800;
          font-size:15px;
        ">
          Get Started
        </button>

      </div>

    </div>
  `;

});
