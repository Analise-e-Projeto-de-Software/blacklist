document.addEventListener('DOMContentLoaded', () => {
    const emailForm = document.getElementById('emailForm');
    const urlForm = document.getElementById('urlForm');
    const newsForm = document.getElementById('newsForm');
    const reportContainer = document.getElementById('reportContainer');
    const newsContainer = document.getElementById('newsContainer');
    const logsContainer = document.getElementById('logsContainer');

    function showLoading(container) {
        if (container) {
            container.innerHTML = '<p>Carregando...</p>';
        }
    }

    function showError(container, message) {
        if (container) {
            container.innerHTML = `<p style="color: red;">Erro: ${message}</p>`;
        }
    }

    if (emailForm) {
        emailForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const header = document.getElementById('header').value;
            const body = document.getElementById('body').value;

            showLoading(reportContainer);

            try {
                const response = await fetch('/analyze-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, header, body })
                });

                const result = await response.json();
                if (reportContainer) {
                    reportContainer.innerHTML = `
                        <h3>Resultado da Análise</h3>
                        <p>Email: ${email}</p>
                        <p>Suspeito: ${result.isSuspicious ? 'Sim' : 'Não'}</p>
                        <h4>Detalhes</h4>
                        <pre>${result.details.join('\n')}</pre>
                    `;
                }
            } catch (error) {
                showError(reportContainer, error.message);
            }
        });
    }

    if (urlForm) {
        urlForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const url = document.getElementById('url').value;

            showLoading(reportContainer);

            try {
                const response = await fetch(`/check-url?url=${encodeURIComponent(url)}`);
                const result = await response.json();
                if (reportContainer) {
                    reportContainer.innerHTML = `<p>${result.message || result.error}</p>`;
                }

                if (result.message) {
                    await fetch('/log-activity', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ activity: `URL analisada: ${url} - Resultado: ${result.message}` })
                    });
                }
            } catch (error) {
                showError(reportContainer, error.message);
                await fetch('/log-activity', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ activity: `Erro ao analisar URL: ${url} - ${error.message}` })
                });
            }
        });
    }

    if (newsForm) {
        newsForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const query = document.getElementById('query').value;

            showLoading(newsContainer);

            try {
                const response = await fetch(`/verify-news?query=${encodeURIComponent(query)}`);
                const result = await response.json();

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
            } catch (error) {
                showError(newsContainer, error.message);
            }
        });
    }

    const loadLogsButton = document.getElementById('loadLogs');
    if (loadLogsButton) {
        loadLogsButton.addEventListener('click', async () => {
            showLoading(logsContainer);

            try {
                const response = await fetch('/logs');
                const logs = await response.json();
                if (logsContainer) {
                    logsContainer.innerHTML = logs.map(log => `<p>${log.timestamp}: ${log.activity}</p>`).join('');
                }
            } catch (error) {
                showError(logsContainer, error.message);
            }
        });
    }
});
