// Basit hash tabanlı router: #/ekran/param1/param2

const listeners = new Set();

export function navigate(path) {
  if (location.hash === `#${path}`) {
    onHashChange();
  } else {
    location.hash = path;
  }
}

export function replace(path) {
  history.replaceState(null, "", `#${path}`);
  onHashChange();
}

export function currentRoute() {
  const raw = location.hash.replace(/^#\/?/, "");
  const [screen, ...params] = raw.split("/").filter(Boolean);
  return { screen: screen || "today", params };
}

function onHashChange() {
  const route = currentRoute();
  listeners.forEach((fn) => fn(route));
}

export function onRoute(fn) {
  listeners.add(fn);
}

export function startRouter() {
  window.addEventListener("hashchange", onHashChange);
  if (!location.hash) {
    history.replaceState(null, "", "#/today");
  }
  onHashChange();
}
