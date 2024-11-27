// Массив доступных стилей
const styles = [
    { name: "Style1", file: "styles/style1.css" },
    { name: "Style2", file: "styles/style2.css" },
    { name: "Style3", file: "styles/style3.css" },
];

let currentStyle = styles[0].file;

function switchStyle(style: { name: string; file: string }): void {
    const existingLink = document.querySelector('link[rel="stylesheet"]');
    if (existingLink) {
        existingLink.remove();
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = style.file;
    document.head.appendChild(link);

    currentStyle = style.file;
}

function createStyleLinks(): void {
    const styleLinks = document.getElementById("style-links");
    if (styleLinks) {
        styles.forEach((style) => {
            const link = document.createElement("a");
            link.href = "#";
            link.textContent = style.name;
            link.addEventListener("click", (event) => {
                event.preventDefault();
                switchStyle(style);
            });

            const listItem = document.createElement("li");
            listItem.appendChild(link);
            styleLinks.appendChild(listItem);
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    createStyleLinks();
    switchStyle(styles[0]);
});
