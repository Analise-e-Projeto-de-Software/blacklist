document.addEventListener('DOMContentLoaded', () => {
    const logsContainer = document.getElementById('logsContainer');
    const loadLogsButton = document.getElementById('loadLogs');

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

    if (loadLogsButton) {
        loadLogsButton.addEventListener('click', async () => {
            showLoading(logsContainer);

            try {
                const response = await fetch('/logs', {
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                const responseText = await response.text(); // Lê a resposta como texto
                console.log('Resposta do servidor:', responseText); // Log para depuração

                try {
                    const logs = JSON.parse(responseText); // Tenta analisar o texto como JSON
                    if (logsContainer) {
                        logsContainer.innerHTML = logs.map(log => `<p>${log.timestamp}: ${log.activity}</p>`).join('');
                    }
                } catch (e) {
                    console.error('Erro ao analisar JSON:', responseText); // Adiciona a resposta completa ao console
                    throw new Error(`Erro ao analisar JSON: ${responseText}`);
                }
            } catch (error) {
                console.error('Erro ao carregar logs:', error); // Adiciona a mensagem de erro ao console
                showError(logsContainer, error.message);
            }
        });
    }
});
