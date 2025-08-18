const THEME_NAME = "apmody";
const CONFIG_URL_B64 = "aHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L2doL01hdXNhbU1vZHovYmxvZ3cvY29uZmlnLmpzb24=";
const CONFIG_URL = atob(CONFIG_URL_B64);

let firebaseConfig = null;
let defaults = { js: "", css: "", theme: THEME_NAME };

const norm = (host) => host.replace(/\./g, "_");

function injectJS(url) {
  if (!url) return;
  const s = document.createElement("script");
  s.src = url;
  s.async = true;
  s.onerror = () => {};
  document.head.appendChild(s);
}

function injectCSS(url) {
  if (!url) return;
  const l = document.createElement("link");
  l.rel = "stylesheet";
  l.href = url;
  document.head.appendChild(l);
}

function initDB(cfg) {
  try {
    if (!cfg || !cfg.apiKey) return null;
    if (window.firebase && window.firebase.apps && window.firebase.apps.length) return firebase.database();
    firebase.initializeApp(cfg);
    return firebase.database();
  } catch (e) {
    console.error("Firebase init failed", e);
    return null;
  }
}

async function start() {
  try {
    const r = await fetch(CONFIG_URL);
    const conf = await r.json();

    firebaseConfig = conf.firebaseConfig || null;
    defaults = {
      js: conf.defaultJsUrl,
      css: conf.defaultCssUrl,
      theme: conf.themeName || THEME_NAME
    };

    if (!firebaseConfig || !firebaseConfig.apiKey) {
      console.warn("No firebaseConfig; loading defaults.");
      injectCSS(defaults.css);
      injectJS(defaults.js);
      document.body.style.display = "block";
      return;
    }

    const db = initDB(firebaseConfig);
    if (!db) {
      injectCSS(defaults.css);
      injectJS(defaults.js);
      document.body.style.display = "block";
      return;
    }

    const host = window.location.hostname;
    const key = norm(host);
    const ref = db.ref(`themes/${defaults.theme}/websites/${key}`);

    const snap = await ref.get();
    if (snap.exists()) {
      const data = snap.val();
      injectCSS(data.cssUrl || defaults.css);
      injectJS(data.jsUrl || defaults.js);

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

      ref.on("value", s2 => {
        const v = s2.val();
        document.body.style.display = v && v.isActive ? "block" : "none";
      });
      document.body.style.display = data.isActive === false ? "none" : "block";

    } else {
      console.warn("Unlicensed domain. Loading defaults.");
      injectCSS(defaults.css);
      injectJS(defaults.js);
      document.body.style.display = "block";
    }
  } catch (e) {
    console.error(e);
    document.body.style.display = "block";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.style.display = "none";
  start();
});
