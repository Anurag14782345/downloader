document.getElementById('download-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const playlistUrl = document.getElementById('playlistUrl').value;
    const messageElement = document.getElementById('message');

    if (!playlistUrl) {
        messageElement.textContent = 'Please provide a valid playlist URL.';
        return;
    }

    try {
        const response = await fetch('/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ playlistUrl }),
        });

        const message = await response.text();
        messageElement.textContent = message;

    } catch (error) {
        messageElement.textContent = 'Error downloading playlist.';
        console.error('Error:', error);
    }
});
