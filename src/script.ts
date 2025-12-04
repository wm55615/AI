type StyleEntry = {
    name: string;
    file: string;
};

const styles: Record<string, StyleEntry> = {
    "light": { name: "Light Theme", file: "public/style-1.css" },
    "dark": { name: "Dark Theme", file: "public/style-2.css" },
    "retro": { name: "Retro Theme", file: "public/style-3.css" }
};

let currentStyleKey: string = "light";

function applyStyle(styleKey: string): void {
    const styleInfo = styles[styleKey];
    if (!styleInfo) return;

    const oldLink = document.getElementById("dynamic-style");
    if (oldLink) oldLink.remove();

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.id = "dynamic-style";
    link.href = styleInfo.file;
    document.head.appendChild(link);

    currentStyleKey = styleKey;
}

function renderMenu(): void {
    const container = document.getElementById("style-menu");
    if (!container) return;

    container.innerHTML = "";

    Object.entries(styles).forEach(([key, entry]) => {
        const link = document.createElement("a");
        link.href = "#";
        link.textContent = entry.name;

        link.addEventListener("click", (e) => {
            e.preventDefault();
            applyStyle(key);
        });

        container.appendChild(link);
        container.appendChild(document.createElement("br"));
    });
}

window.addEventListener("DOMContentLoaded", () => {
    renderMenu();
    applyStyle(currentStyleKey);
});
