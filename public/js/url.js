document.addEventListener('DOMContentLoaded', () => {
    const urlForm = document.getElementById('urlForm');
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

    async function logActivity(activity) {
        try {
            await fetch('/log-activity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ activity })
            });
        } catch (error) {
            console.error('Erro ao registrar a atividade:', error);
        }
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
                    await logActivity(`URL analisada: ${url} - Resultado: ${result.message}`);
                }
            } catch (error) {
                showError(reportContainer, error.message);
                await logActivity(`Erro ao analisar URL: ${url} - ${error.message}`);
            }
        });
    }
});
