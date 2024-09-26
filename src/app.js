const express = require('express')
const path = require('path')
const morgan = require('morgan')
const mysql = require('mysql2')
const myConnection = require('express-myconnection')
const multer = require('multer');

const app = express()

// Importando routes
const postRouter = require('./routes/post')

// Settings
app.set('port', process.env.PORT || 3000)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Configuración de almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public/uploads')); // Ruta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop()
        cb(null, `${Date.now()}.${ext}`); // Nombra el archivo con la fecha y la extensión original
    }
});

// Middleware para manejar la subida de archivos
const upload = multer({ storage });


// Middlewares
app.use(morgan('dev'))
app.use(myConnection(mysql, {
    host: "localhost",
    user: 'root',
    password: 'josefina22',
    database: 'mydb'
}, 'single'))
app.use(express.urlencoded({extended: false}))

// Routes
app.use('/', postRouter)
app.use('/post', postRouter); // Asegúrate de que la base de la ruta sea '/post


// Static files 
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../build'))); 


app.listen(app.get('port'), () => {
    console.log('Server on port 3000')
})