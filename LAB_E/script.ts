const styles: Record<string, string> = {
    "styl1.css": "src/style/styl1.css",
    "styl2.css": "src/style/styl2.css",
    "styl3.css": "src/style/styl3.css",
};

function changeStyle(styleName: string): void {
    console.log(`Changing style to: ${styleName}`);
    const styleElement = document.getElementById("dynamic-style") as HTMLLinkElement;

    if (styleElement) {
        styleElement.href = styles[styleName];
        console.log(`Style changed to: ${styleElement.href}`);
    } else {
        console.error("Style element not found");
    }
}

// Attach the function to the global window object
(window as any).changeStyle = changeStyle;