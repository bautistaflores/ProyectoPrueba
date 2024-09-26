const express = require('express')
const router = express.Router();
const multer = require('multer');
const path = require('path');
const postController = require('../controllers/postController')

router.get('/post', (req, res) => postController.list('post', req, res)); // Para post.ejs
router.post('/add', postController.save);
router.get('/delete/:idPost', postController.delete);
router.get('/update/:idPost', (req, res) => postController.edit('post_edit', req, res)); // Para post_edit.ejs
router.post('/update/:idPost', postController.update);

router.get('/', (req, res) => postController.list('index', req, res)); // Para index.ejs

// Mostrar el formulario de creación de post
router.get('/create', (req, res) => {
    res.render('post/create'); // Renderiza el formulario en 'views/create.ejs'
});



/// Configuración de almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/uploads')); // Ruta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop()
        cb(null, `${Date.now()}.${ext}`); // Nombra el archivo con la fecha y la extensión original
    }
});

// Filtrar los archivos para permitir solo imágenes
const upload = multer({ storage });

// Manejar el envío del formulario con la imagen
router.post('/create', upload.single('foto'), postController.save); // Asegúrate de que 'foto' coincida con el nombre del input


module.exports = router;