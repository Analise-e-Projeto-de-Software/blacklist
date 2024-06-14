document.addEventListener('DOMContentLoaded', () => {
    const emailForm = document.getElementById('emailForm');
    const reportContainer = document.getElementById('reportContainer');

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
                    const details = Array.isArray(result.details) ? result.details.join('\n') : 'Nenhum detalhe disponível';
                    reportContainer.innerHTML = `
                        <h3>Resultado da Análise</h3>
                        <p>Email: ${email}</p>
                        <p>Suspeito: ${result.isSuspicious ? 'Sim' : 'Não'}</p>
                        <h4>Detalhes</h4>
                        <pre>${details}</pre>
                    `;
                }
            } catch (error) {
                showError(reportContainer, error.message);
            }
        });
    }
});
