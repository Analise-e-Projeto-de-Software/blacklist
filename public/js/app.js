document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('emailForm');
    form.addEventListener('submit', async (e) => {
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
});
