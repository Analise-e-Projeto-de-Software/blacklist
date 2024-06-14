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
        const reportContainer = document.getElementById('reportContainer');
        reportContainer.innerHTML = `
            <h3>Resultado da Análise</h3>
            <p>Email: ${email}</p>
            <p>Suspeito: ${result.isSuspicious ? 'Sim' : 'Não'}</p>
            <h4>Detalhes</h4>
            <pre>${result.details.join('\n')}</pre>
        `;
    });

    const urlForm = document.getElementById('urlForm');
    urlForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const url = document.getElementById('url').value;

        const response = await fetch(`/check-url?url=${encodeURIComponent(url)}`);
        const result = await response.json();
        alert(result.message || result.error);
    });

    const newsForm = document.getElementById('newsForm');
    newsForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const query = document.getElementById('query').value;

        const response = await fetch(`/verify-news?query=${encodeURIComponent(query)}`);
        const result = await response.json();

        const newsContainer = document.getElementById('newsContainer');
        newsContainer.innerHTML = `<h3>Artigos Encontrados (${result.totalResults})</h3>`;

        if (result.articles && result.articles.length > 0) {
            const articlesList = document.createElement('ul');
            result.articles.forEach(article => {
                const articleItem = document.createElement('li');
                articleItem.innerHTML = `
                    <h4>${article.title}</h4>
                    <p><strong>Autor:</strong> ${article.author || 'Desconhecido'}</p>
                    <p><strong>Fonte:</strong> ${article.source.name}</p>
                    <p><strong>Publicado em:</strong> ${new Date(article.publishedAt).toLocaleString()}</p>
                    <p>${article.description}</p>
                    <a href="${article.url}" target="_blank">Leia mais</a>
                `;
                articlesList.appendChild(articleItem);
            });
            newsContainer.appendChild(articlesList);
        } else {
            newsContainer.innerHTML += '<p>Nenhum artigo encontrado.</p>';
        }
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
