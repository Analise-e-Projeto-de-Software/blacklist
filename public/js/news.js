document.addEventListener('DOMContentLoaded', () => {
    const newsForm = document.getElementById('newsForm');
    const newsContainer = document.getElementById('newsContainer');

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
});
