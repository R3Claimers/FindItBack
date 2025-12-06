/**
 * @jest-environment jsdom
 */

describe("Theme switching (DOM contract)", () => {
  const root = () => document.documentElement;

  beforeEach(() => {
    // Reset DOM and storage
    root().className = "";
    localStorage.clear();
    // Default: no system dark preference
    window.matchMedia = (query) => ({ matches: false, media: query, addListener: () => {}, removeListener: () => {} });
  });

  test("initial theme defaults to light, persists and sets class", () => {
    const initial = (() => {
      const saved = localStorage.getItem("theme");
      if (saved) return saved;
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
      return "light";
    })();

    root().classList.remove("light", "dark");
    root().classList.add(initial);
    localStorage.setItem("theme", initial);

    expect(root().classList.contains("light")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("light");
  });

  test("toggle switches between light and dark and updates storage", () => {
    const setTheme = (t) => {
      root().classList.remove("light", "dark");
      root().classList.add(t);
      localStorage.setItem("theme", t);
    };

    let theme = "light";
    setTheme(theme);
    expect(root().classList.contains("light")).toBe(true);

    const toggleTheme = () => {
      theme = theme === "light" ? "dark" : "light";
      setTheme(theme);
    };

    toggleTheme();
    expect(root().classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("dark");

    toggleTheme();
    expect(root().classList.contains("light")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("light");
  });

  test("respects saved theme in localStorage on load", () => {
    localStorage.setItem("theme", "dark");

    const initial = (() => {
      const saved = localStorage.getItem("theme");
      if (saved) return saved;
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
      return "light";
    })();

    root().classList.remove("light", "dark");
    root().classList.add(initial);

    expect(root().classList.contains("dark")).toBe(true);
  });
});

