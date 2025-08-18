/* apmody.js — Firebase-free license loader */
(() => {
  // ==== CONFIG URL (base64) ====
  // Example for "https://cdn.jsdelivr.net/gh/MausamModz/blog/config.json"
  const CONFIG_URL_B64 = "aHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L2doL01hdXNhbU1vZHovYmxvZy9jb25maWcuanNvbg==";
  const CONFIG_URL = atob(CONFIG_URL_B64);

  // ==== helpers ====
  const norm = (host) => host.replace(/\./g, "_");

  const injectJS = (url) => {
    if (!url) return;
    const s = document.createElement("script");
    s.src = url;
    s.async = true;
    document.head.appendChild(s);
  };

  const injectCSS = (url) => {
    if (!url) return;
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = url;
    document.head.appendChild(l);
  };

  const logValid = (data, host) => {
    console.groupCollapsed("%cValid License", "color:#57956A;font-size:12px");
    console.groupCollapsed("License for");
    console.log("ID : " + (data.id || ""));
    console.log("Domain : " + (data.url || host));
    console.log("Owner : " + (data.owner || ""));
    console.log("Type : " + (data.type || "Premium"));
    console.groupEnd();
    console.group((data.ttl || "APMODY") + " - Blogger templates");
    console.log("Demo : " + (data.demo || "https://apmody.blogspot.com/"));
    console.groupEnd();
    console.groupEnd();
  };

  const showBody = (on = true) => {
    document.body.style.display = on ? "block" : "none";
  };

  async function start() {
    try {
      const res = await fetch(CONFIG_URL, { cache: "no-cache" });
      if (!res.ok) throw new Error("config fetch failed");
      const conf = await res.json();

      const defaults = {
        js: conf.defaultJsUrl || "",
        css: conf.defaultCssUrl || ""
      };

      const host = window.location.hostname;
      const key = norm(host);

      const site = (conf.sites && conf.sites[key]) || null;

      if (site && (site.isActive === undefined || site.isActive)) {
        injectCSS(site.cssUrl || defaults.css);
        injectJS(site.jsUrl || defaults.js);
        logValid(site, host);
        showBody(true);
      } else {
        console.warn("Unlicensed or inactive domain. Loading defaults.");
        injectCSS(defaults.css);
        injectJS(defaults.js);
        showBody(true);
      }
    } catch (e) {
      console.warn("Falling back to defaults:", e.message || e);
      showBody(true);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    showBody(false);
    start();
    setTimeout(() => showBody(true), 6000); // fail-safe
  });
})();
