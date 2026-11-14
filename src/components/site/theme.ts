export const THEME_KEY = "duang-theme";

export const THEME_EVENT = "duang:themechange";

/** Every style the site can wear. `swatch` is [stage, goo] for the picker's preview dot. */
export const THEMES = [
  { id: "fog", name: "雾白", swatch: ["#e9e7e2", "#161616"] },
  { id: "dopamine", name: "多巴胺", swatch: ["#ffd23f", "#ff3d94"] },
  { id: "slime", name: "粘液", swatch: ["#17181a", "#3ddc6a"] },
  { id: "paper", name: "纸本", swatch: ["#efe8d8", "#ff5b4a"] },
] as const;

export type Theme = (typeof THEMES)[number]["id"];

const ids = new Set<string>(THEMES.map((t) => t.id));

export const currentTheme = (): Theme => {
  const t = document.documentElement.dataset.theme;
  return t && ids.has(t) ? (t as Theme) : "fog";
};

/** Inline <head> script: applies the saved theme before first paint. */
export const themeBootScript = `try{var t=localStorage.getItem("${THEME_KEY}");if(${JSON.stringify([...ids])}.indexOf(t)>0)document.documentElement.dataset.theme=t}catch(e){}`;
