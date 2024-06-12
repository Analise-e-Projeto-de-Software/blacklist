document.addEventListener('DOMContentLoaded', () => {
    const emailForm = document.getElementById('emailForm');
    emailForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const header = document.getElementById('header').value;
        const body = document.getElementById('body').value;
        
        const response = await fetch('/analyze-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, header, body })
        });
        
        const result = await response.json();
        alert(`Email ${result.isSuspicious ? 'suspeito' : 'seguro'}.`);
    });

    const urlForm = document.getElementById('urlForm');
    urlForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const url = document.getElementById('url').value;

        const response = await fetch(`/check-url?url=${encodeURIComponent(url)}`);
        const result = await response.json();
        alert(result.message);
    });

    const newsForm = document.getElementById('newsForm');
    newsForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const query = document.getElementById('query').value;

        const response = await fetch(`/verify-news?query=${encodeURIComponent(query)}`);
        const result = await response.json();
        console.log(result);
        alert(`Encontrado ${result.totalResults} artigos relacionados.`);
    });

    // Carregar logs de atividades
    const loadLogsButton = document.getElementById('loadLogs');
    loadLogsButton.addEventListener('click', async () => {
        const response = await fetch('/logs');
        const logs = await response.json();
        const logsContainer = document.getElementById('logsContainer');
        logsContainer.innerHTML = logs.map(log => `<p>${log.timestamp}: ${log.activity}</p>`).join('');
    });
});
