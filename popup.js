document.getElementById('paraphraseBtn').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const tab = tabs[0];
        chrome.scripting.executeScript(
            {
                target: { tabId: tab.id },
                func: () => {
                    // Reuse content_script logic to scrape and send a message
                    const container = document.querySelector('.elfjS');
                    if (!container) return;
                    const parts = [];
                    container.querySelectorAll('p, pre,strong').forEach(el => parts.push(el.innerText.trim()));
                    const text = parts.join('\n\n');
                    chrome.runtime.sendMessage({ action: 'PARAPHRASE', text }, response => {
                        chrome.runtime.sendMessage({ action: 'SHOW_IN_POPUP', text: response.paraphrased });
                    });
                }
            }
        );
    });
});

// Receive paraphrased text and display
chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === 'SHOW_IN_POPUP') {
        document.getElementById('result').value = msg.text || 'Failed to paraphrase.';
    }
});