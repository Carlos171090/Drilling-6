const http = require('http');
const url = require('url');
const fs = require('fs');

const port = 3000;
let animeData = [];
fs.readFile('anime.json', 'utf8', (err, data) => {

    if (err) {

        console.error('Error reading anime data:', err);
    } else {

        try {
            animeData = JSON.parse(data);
            console.log('Anime data loaded successfully.');
        } catch (parseError) {

            console.error('Error parsing anime data:', parseError);
        }
    }
});
function findAnimeById(id) {
    return animeData.find((anime) => anime.id === id);
}

function findAnimesByName(name) {
    return animeData.filter(
        (anime) => anime.nombre.toLowerCase() === name.toLowerCase()
    );
}

function generateNewId() {
    return (animeData.length + 1).toString();
}
function addAnime(newAnime) {
    newAnime.id = generateNewId();
    animeData.push(newAnime);
    saveAnimeData();
    return newAnime;
}
function updateAnime(id, updatedAnime) {
    const index = animeData.findIndex((anime) => anime.id === id);
    if (index !== -1) {
        animeData[index] = { ...animeData[index], ...updatedAnime };
        return animeData[index];
    } else {
        return null;
    }
}
function deleteAnime(id) {
    const index = animeData.findIndex((anime) => anime.id === id);
    if (index !== -1) {
        const deletedAnime = animeData.splice(index, 1);
        saveAnimeData();
        const successMessage = {
            success: `Anime with ID ${id} has been deleted.`,
            deletedAnime: deletedAnime[0]
        };
        return successMessage;
    } else {

        return null;
    }
}

function saveAnimeData() {
    console.log('Saving anime data:', animeData);
    fs.writeFile('anime.json', JSON.stringify(animeData), 'utf8', (err) => {
        if (err) {

            console.error('Error saving anime data:', err);
        } else {

            console.log('Anime data saved successfully.');
        }
    });
}

const server = http.createServer((req, res) => {

    const parsedUrl = url.parse(req.url, true);
    console.log('Request URL:', parsedUrl);


    if (req.method === 'GET' && parsedUrl.pathname === '/animes') {

        const { id, nombre } = parsedUrl.query;
        console.log('ID:', id);
        console.log('Nombre:', nombre);


        if (id) {

            const animeById = findAnimeById(id);
            console.log('Anime by ID:', animeById);
            if (animeById) {

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(animeById));
            } else {

                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Anime not found.' }));
            }

        } else if (nombre) {

            const animesByName = findAnimesByName(nombre);
            console.log('Animes by name:', animesByName);
            if (animesByName.length > 0) {

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(animesByName));
            } else {

                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Anime not found.' }));
            }
        } else {

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(animeData));
        }
    } else if (req.method === 'POST' && parsedUrl.pathname === '/animes') {

        let requestBody = '';
        req.on('data', (chunk) => {
            requestBody += chunk.toString();
        });

        req.on('end', () => {
            const newAnime = JSON.parse(requestBody);
            console.log('New Anime:', newAnime);


            if (newAnime.nombre && newAnime.genero && newAnime.año && newAnime.autor) {

                const addedAnime = addAnime(newAnime);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(addedAnime));
            } else {

                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(
                    JSON.stringify({ error: 'Incomplete data. Please provide all required fields.' })
                );
            }
        });
    } else if (req.method === 'PUT' && parsedUrl.pathname.startsWith('/animes/')) {

        const id = parsedUrl.pathname.split('/animes/')[1];
        console.log('Update Anime ID:', id);


        let requestBody = '';
        req.on('data', (chunk) => {
            requestBody += chunk.toString();
        });

        req.on('end', () => {
            const updatedAnime = JSON.parse(requestBody);
            console.log('Updated Anime:', updatedAnime);


            if (updatedAnime.nombre && updatedAnime.genero && updatedAnime.año && updatedAnime.autor) {

                const updatedData = updateAnime(id, updatedAnime);
                if (updatedData) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(updatedData));
                } else {

                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Anime not found.' }));
                }
            } else {

                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(
                    JSON.stringify({ error: 'Incomplete data. Please provide all required fields.' })
                );
            }
        });
    } else if (req.method === 'DELETE' && parsedUrl.pathname.startsWith('/animes/')) {

        const id = parsedUrl.pathname.split('/animes/')[1];
        console.log('Delete Anime ID:', id);


        const deletedAnime = deleteAnime(id);
        if (deletedAnime) {

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(deletedAnime));
        } else {

            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Anime not found.' }));
        }
    } else {

        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Route not found.' }));
    }
});



server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


module.exports = server;