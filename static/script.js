const form = document.getElementById("textForm");
const input = document.getElementById("originText");
const output = document.getElementById("glyphs");

form.addEventListener("submit", async (event) => {
    event.preventDefault(); // stops the page reloading

    // split into words, dropping punctuation and empty bits
    const words = input.value
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, "")
        .split(/\s+/)
        .filter(Boolean);

    output.innerHTML = "";
    if (words.length === 0) return;

    // ask for all the words at once; results stay in the same order
    const results = await Promise.all(
        words.map(async (word) => {
            const res = await fetch(`/icon/${encodeURIComponent(word)}`);
            return res.json();
        })
    );

    results.forEach((item) => {
        if (item.found) {
            const img = document.createElement("img");
            img.src = item.thumbnail_url;
            img.alt = item.word;
            img.title = item.attribution || item.word;
            img.className = "glyph";
            output.appendChild(img);
        } else {
            // placeholder so the sentence keeps its shape
            const missing = document.createElement("span");
            missing.className = "glyph missing";
            missing.textContent = "?";
            output.appendChild(missing);
        }
    });
});