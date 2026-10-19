/**
 * Apparitions au défilement, sans bibliothèque :
 *   - `data-reveal`          l'élément glisse vers le haut en apparaissant ;
 *   - `data-reveal-stagger`  ses enfants apparaissent l'un après l'autre.
 *
 * Le masquage initial n'est actif que sous `html[data-motion]`, posé avant
 * l'affichage par le script de <head> (voir MOTION_BOOT_SCRIPT) : sans
 * JavaScript, ou si le visiteur demande moins d'animations, tout reste
 * visible. On marque les éléments révélés par un attribut (et non une
 * classe) pour que les rendus React suivants ne l'effacent pas.
 */

const SELECTOR = "[data-reveal],[data-reveal-stagger]";

function reveal(element: Element) {
  if (element.hasAttribute("data-reveal-stagger")) {
    Array.from(element.children).forEach((child, index) => {
      (child as HTMLElement).style.setProperty("--reveal-i", String(index));
    });
  }
  element.setAttribute("data-revealed", "");
}

export function startMotion() {
  if (typeof window === "undefined") return;
  const w = window as Window & { __omMotion?: boolean };
  if (w.__omMotion) return;
  w.__omMotion = true;

  if (
    !document.documentElement.hasAttribute("data-motion") ||
    !("IntersectionObserver" in window)
  ) {
    document.documentElement.removeAttribute("data-motion");
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        reveal(entry.target);
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
  );

  const scan = (root: ParentNode) => {
    root.querySelectorAll(SELECTOR).forEach((element) => {
      if (!element.hasAttribute("data-revealed")) observer.observe(element);
    });
  };
  scan(document);

  // Pages ouvertes par la navigation interne : nouveaux éléments à observer.
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return;
        if (node.matches(SELECTOR) && !node.hasAttribute("data-revealed")) observer.observe(node);
        scan(node);
      });
    }
  }).observe(document.body, { childList: true, subtree: true });
}

/**
 * Exécuté dans <head> avant le premier affichage : active le masquage initial
 * seulement si le visiteur accepte les animations, et le lève au bout de
 * 4 s si le JavaScript du site ne s'est pas chargé.
 */
export const MOTION_BOOT_SCRIPT = `(function(){try{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;var d=document.documentElement;d.setAttribute("data-motion","");setTimeout(function(){if(!window.__omMotion)d.removeAttribute("data-motion")},4000)}catch(e){}})();`;
