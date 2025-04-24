document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.elfjS');
    if (!container) return;

    // Collect paragraphs and code blocks for example input/output
    const parts = [];
    container.querySelectorAll('p, pre,strong').forEach(el => {
        parts.push(el.innerText.trim());
    });
    const questionText = parts.join('\n\n');

    // Send to background for paraphrasing
    chrome.runtime.sendMessage(
        { action: 'PARAPHRASE', text: questionText },
        response => {
            if (response && response.paraphrased) {
                // Display the paraphrased question (e.g., replace or insert)
                const paraEl = document.createElement('div');
                paraEl.style.cssText = 'border:2px solid #4CAF50;padding:10px;margin:10px 0;border-radius:5px;background:#f9f9f9;';
                paraEl.innerText = response.paraphrased;
                container.parentNode.insertBefore(paraEl, container);
            }
        }
    );
});