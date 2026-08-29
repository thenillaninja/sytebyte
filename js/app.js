const form = document.querySelector("#business-form");

const brandColor = document.querySelector("#brand-color");
const colorValue = document.querySelector("#color-value");

const preview = document.querySelector("#site-preview");
const previewTitle = document.querySelector("#preview-title");

const previewButtons = document.querySelectorAll("[data-preview]");


brandColor.addEventListener("input", () => {
  colorValue.textContent = brandColor.value;
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
    ">

      <div>

        <p style="
          text-transform:uppercase;
          letter-spacing:.15em;
          font-size:12px;
          font-weight:700;
          color:${brandColor.value};
        ">
          Pindrop Preview
        </p>

        <h1 style="
          font-size:clamp(42px,8vw,90px);
          line-height:.95;
          letter-spacing:-.06em;
          margin:12px 0 20px;
        ">
          ${businessName}
        </h1>

        <p style="
          color:#667085;
          font-size:18px;
        ">
          Site generation engine coming next.
        </p>

      </div>

    </div>
  `;

});
