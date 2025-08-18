// Licensed site assets
console.log("%c✔ Licensed domain detected. Premium assets loaded.", "color: green; font-size:14px;");

// Example: Add a floating license badge
document.addEventListener("DOMContentLoaded", () => {
  const badge = document.createElement("div");
  badge.textContent = "✔ Licensed Theme";
  badge.style.cssText = `
    position: fixed;
    bottom: 10px;
    right: 10px;
    background: #4caf50;
    color: white;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 13px;
    font-family: system-ui, Arial, sans-serif;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    z-index: 9999;
  `;
  document.body.appendChild(badge);
});
