const PORT = process.env.PORT || 5000
const express = require("express"); // Express - это веб-фреймворк маршрутизації та промежуточной обробки
const bodyParser = require('body-parser');
const urlencodedParser = express.urlencoded({extended: false});
const app = express();

app.set('views', './views');                // Set Views
app.set("view engine", "hbs");				// установить Handlebars в качестве движка

const {Pool} = require('pg');               // підключення до postgres

const pool = new Pool({
    user: 'me',
    host: 'localhost',
    database: 'testdb',
    password: 'zzzz-1111',
    port: 5432,
});


// const pool = new Pool({                              // для деплоя на heroku
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//         rejectUnauthorized: false
//     }
// });

// pool.query('INSERT INTO glitches (glid, gltext, glsize, glcolor) VALUES ($1, $2, $3, $4);', ['hrr', 'fff', '20px', '#febaaa']);

// підключення middleware (функцій промежуточной обробки), які мають доступ до request, response
// middleware виконується, коли відповідає базовий шлях
app.use(express.static(__dirname + '/public'));     // Static Files
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
        extended: true,
    })
)

// определяем обработчик для маршрута "/"
app.get("/", function (request, response) {
    response.render('index', {text: 'Home Page'})
});

app.get("/andrius", function (request, response) {
    response.render('andrius', {text: 'Andrius Page'})
});

// отримати глюки зі сторінки андріуса
app.get("/glitches", function (request, response) {
    const query = `SELECT * FROM glitches ORDER BY id ASC`;
    pool.query(query)
        .then(res => {
            response.status(200).json(res.rows)
        })
        .catch(err => setImmediate(() => {
            throw err
        }))
});

// додати глюки у бд з основної сторінки
app.post("/add", urlencodedParser, function (request, response) {
    if (!request.body) return response.sendStatus(400);     //  Bad Request - сервер не может понять запрос
    console.log("Глюк прилетів");
    let data = request.body;
    pool
        .query('INSERT INTO glitches (glid, gltext, glsize, glcolor) VALUES ($1, $2, $3, $4);', [data.glid, data.gltext, data.glsize, data.glcolor])
        .then((res) => response.send(res))
        .catch(err => setImmediate(() => {
            throw err
        }))
});

// очистити глюки зі сторінки андріуса
app.delete('/delete', function (request, response) {
    const query = `DELETE FROM glitches`;
    pool.query(query)
        .then(res => {
            response.status(200).json(res.rows)
        })
        .catch(err => setImmediate(() => {
            throw err
        }))

});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
