document.addEventListener('DOMContentLoaded', function () {
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

    // Save paraphrased response to history (max 10, always as object)
    function saveToHistory(text) {
        if (!text) return;
        chrome.storage.local.get(['paraphraseHistory'], (result) => {
            let history = result.paraphraseHistory || [];
            // Convert old string entries to object
            history = history.map(item =>
                typeof item === 'string' ? { text: item, ts: Date.now() } : item
            );
            // Remove duplicates by text
            history = history.filter(item => item.text !== text);
            // Add new at the start with timestamp
            history.unshift({ text, ts: Date.now() });
            // Keep only last 10
            if (history.length > 10) history = history.slice(0, 10);
            chrome.storage.local.set({ paraphraseHistory: history });
        });
    }

    // Format timestamp as "Today, 12:34 PM" or "Yesterday, 11:22 AM" or "2024-06-10, 09:15"
    function formatTimestamp(ts) {
        if (!ts) return '';
        const d = new Date(ts);
        const now = new Date();
        const isToday = d.toDateString() === now.toDateString();
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        const isYesterday = d.toDateString() === yesterday.toDateString();
        const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (isToday) return `Today, ${time}`;
        if (isYesterday) return `Yesterday, ${time}`;
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}, ${time}`;
    }

    // Show history modal
    function showHistory() {
        chrome.storage.local.get(['paraphraseHistory'], (result) => {
            let history = result.paraphraseHistory || [];
            // Convert any old string entries to object
            let changed = false;
            history = history.map(item => {
                if (typeof item === 'string') {
                    changed = true;
                    return { text: item, ts: Date.now() };
                }
                return item;
            });
            if (changed) {
                chrome.storage.local.set({ paraphraseHistory: history });
            }
            const list = document.getElementById('historyList');
            list.innerHTML = '';
            // Show or hide the "Clear" button
            const clearBtn = document.getElementById('clearHistoryBtn');
            clearBtn.style.display = history.length > 0 ? 'inline-block' : 'none';

            if (history.length === 0) {
                list.innerHTML = '<li style="color:#aaa;">No history yet.</li>';
            } else {
                history.forEach((item, idx) => {
                    const li = document.createElement('li');
                    li.style.cssText = 'margin-bottom:12px; background:#18181a; border-radius:6px; padding:10px; cursor:pointer; border:1px solid #282828;';
                    li.innerHTML = `
                        <div style="font-size:0.97em; color:#ffa116; margin-bottom:2px;">${formatTimestamp(item.ts)}</div>
                        <div style="font-size:1em; color:#f7f7f8; white-space:pre-line;">${item.text.length > 120 ? item.text.slice(0, 120) + '...' : item.text}</div>
                    `;
                    li.title = "Click to load this paraphrase";
                    li.onclick = () => {
                        document.getElementById('result').value = item.text;
                        document.getElementById('historyModal').style.display = 'none';
                    };
                    list.appendChild(li);
                });
            }
            document.getElementById('historyModal').style.display = 'flex';
        });
    }

    // Instantly clear history, no confirmation
    document.getElementById('clearHistoryBtn').onclick = () => {
        chrome.storage.local.set({ paraphraseHistory: [] }, () => {
            document.getElementById('historyList').innerHTML = '<li style="color:#aaa;">No history yet.</li>';
            document.getElementById('clearHistoryBtn').style.display = 'none';
        });
    };

    // Hide history modal
    document.getElementById('closeHistory').onclick = () => {
        document.getElementById('historyModal').style.display = 'none';
    };
    document.getElementById('historyModal').onclick = (e) => {
        if (e.target === document.getElementById('historyModal')) {
            document.getElementById('historyModal').style.display = 'none';
        }
    };

    // History button event
    document.getElementById('historyBtn').onclick = showHistory;

    // When receiving a new paraphrased response, save to history
    chrome.runtime.onMessage.addListener((msg) => {
        if (msg.action === 'SHOW_IN_POPUP') {
            document.getElementById('result').value = msg.text || 'Failed to paraphrase.';
            saveToHistory(msg.text);
        }
    });
});