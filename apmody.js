(() => {
  const CONFIG_URL_B64 = "aHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L2doL01hdXNhbU1vZHovYmxvZy9jb25maWcuanNvbg==";
  const CONFIG_URL = atob(CONFIG_URL_B64);

  const norm = (host) => host.replace(/\./g, "_");

  const injectJS = (url) => {
    if (!url) return;
    const s = document.createElement("script");
    s.src = url;
    s.async = true;
    s.onerror = () => console.warn("Failed to load JS:", url);
    document.head.appendChild(s);
  };

  const injectCSS = (url) => {
    if (!url) return;
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = url;
    l.onerror = () => console.warn("Failed to load CSS:", url);
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

  const showBody = () => {
    document.body.style.display = "block";
  };

  async function start() {
    try {
      const res = await fetch(CONFIG_URL, { cache: "no-cache" });
      const conf = await res.json();

      const defaults = {
        js: conf.defaultJsUrl || "",
        css: conf.defaultCssUrl || ""
      };

      const host = window.location.hostname;
      const key = norm(host);
      const site = (conf.sites && conf.sites[key]) || null;

      if (site && (site.isActive === undefined || site.isActive)) {
        injectCSS(site.cssUrl || valid.css);
        injectJS(site.jsUrl || valid.js);
        logValid(site, host);
      } else {
        console.warn("Unlicensed or inactive domain. Loading defaults.");
        injectCSS(styles.css);
        injectJS(script.js);
      }
    } catch (e) {
      console.warn("Could not fetch config, loading defaults.", e.message || e);
    } finally {
      showBody();
    }
  }

  document.addEventListener("DOMContentLoaded", start);
})();
