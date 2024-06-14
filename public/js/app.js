// Espera até que todo o conteúdo da página seja carregado antes de executar o script
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos do formulário e os contêineres de resultado
    const emailForm = document.getElementById('emailForm');
    const urlForm = document.getElementById('urlForm');
    const newsForm = document.getElementById('newsForm');
    const reportContainer = document.getElementById('reportContainer');
    const newsContainer = document.getElementById('newsContainer');
    const logsContainer = document.getElementById('logsContainer');

    // Função para mostrar um indicador de carregamento em um contêiner específico
    function showLoading(container) {
        container.innerHTML = '<p>Carregando...</p>';
    }

    // Função para mostrar uma mensagem de erro em um contêiner específico
    function showError(container, message) {
        container.innerHTML = `<p style="color: red;">Erro: ${message}</p>`;
    }

    // Adiciona um ouvinte de evento ao formulário de análise de e-mails
    emailForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Previne o envio padrão do formulário

        const email = document.getElementById('email').value;
        const header = document.getElementById('header').value;
        const body = document.getElementById('body').value;

        showLoading(reportContainer); // Mostra o indicador de carregamento

        try {
            // Envia uma solicitação POST para analisar o e-mail
            const response = await fetch('/analyze-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, header, body })
            });

            const result = await response.json(); // Aguarda a resposta em formato JSON
            // Exibe os resultados da análise no contêiner
            reportContainer.innerHTML = `
                <h3>Resultado da Análise</h3>
                <p>Email: ${email}</p>
                <p>Suspeito: ${result.isSuspicious ? 'Sim' : 'Não'}</p>
                <h4>Detalhes</h4>
                <pre>${result.details.join('\n')}</pre>
            `;
        } catch (error) {
            showError(reportContainer, error.message); // Mostra a mensagem de erro
        }
    });

    // Adiciona um ouvinte de evento ao formulário de verificação de URL
    urlForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Previne o envio padrão do formulário

        const url = document.getElementById('url').value;

        showLoading(reportContainer); // Mostra o indicador de carregamento

        try {
            // Envia uma solicitação GET para verificar a URL
            const response = await fetch(`/check-url?url=${encodeURIComponent(url)}`);
            const result = await response.json(); // Aguarda a resposta em formato JSON
            // Exibe a mensagem de verificação no contêiner
            reportContainer.innerHTML = `<p>${result.message || result.error}</p>`;
        } catch (error) {
            showError(reportContainer, error.message); // Mostra a mensagem de erro
        }
    });

    // Adiciona um ouvinte de evento ao formulário de verificação de notícias
    newsForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Previne o envio padrão do formulário

        const query = document.getElementById('query').value;

        showLoading(newsContainer); // Mostra o indicador de carregamento

        try {
            // Envia uma solicitação GET para verificar notícias com base na consulta
            const response = await fetch(`/verify-news?query=${encodeURIComponent(query)}`);
            const result = await response.json(); // Aguarda a resposta em formato JSON

            // Exibe o número de artigos encontrados no contêiner de notícias
            newsContainer.innerHTML = `<h3>Artigos Encontrados (${result.totalResults})</h3>`;

            if (result.articles && result.articles.length > 0) {
                const articlesList = document.createElement('ul');
                // Cria um item de lista para cada artigo encontrado
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
            showError(newsContainer, error.message); // Mostra a mensagem de erro
        }
    });

    // Adiciona um ouvinte de evento ao botão de carregar logs
    const loadLogsButton = document.getElementById('loadLogs');
    loadLogsButton.addEventListener('click', async () => {
        showLoading(logsContainer); // Mostra o indicador de carregamento

        try {
            // Envia uma solicitação GET para obter os logs
            const response = await fetch('/logs');
            const logs = await response.json(); // Aguarda a resposta em formato JSON
            // Exibe os logs no contêiner de logs
            logsContainer.innerHTML = logs.map(log => `<p>${log.timestamp}: ${log.activity}</p>`).join('');
        } catch (error) {
            showError(logsContainer, error.message); // Mostra a mensagem de erro
        }
    });
});
