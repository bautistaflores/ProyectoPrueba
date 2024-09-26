const controller = {}

// Función para listar posts y renderizar la vista especificada
controller.list = (view, req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            return res.json(err);
        }
        conn.query('SELECT * FROM Post', (err, post) => {
            if (err) {
                return res.json(err);
            }
            // Formatear la fecha para cada entrada
            post.forEach(p => {
                p.fecha = p.fecha.toISOString().split('T')[0]; // Formato YYYY-MM-DD
            });
            res.render(view, {
                data: post // Pasa los posts a la vista
            });
        });
    });
};



// controller.save = (req, res) => {

//     const data = req.body

//     req.getConnection((err, conn) => {
//         conn.query('INSERT INTO post set ?', [data], (err, post) => {
//             console.log(post)
//             res.send('works')
//             // res.redirect('/')
//         })
//     })
// }

// Función para guardar un nuevo post
controller.save = (req, res) => {
    const data = req.body;

    if (!req.file) {
        return res.status(400).send('No se subió ningún archivo.'); // Manejo de error si no hay archivo
    }

    const imagePath = '/uploads/' + req.file.filename; // Ruta de la imagen subida
    const newPost = {
        descripcion: data.descripcion,
        foto: imagePath,
        Rubro_idOficio: data.Rubro_idOficio,
        Usuario_idUsuario: data.Usuario_idUsuario,
        valoracion: data.valoracion
    };

    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error en la conexión a la base de datos:', err);
            return res.status(500).json({ error: 'Error en la conexión a la base de datos' });
        }

        // Desactivar las restricciones de clave foránea
        conn.query('SET FOREIGN_KEY_CHECKS = 0', (err) => {
            if (err) {
                return res.json(err);
            }

            // Insertar los datos en la tabla 'post'
            conn.query('INSERT INTO post SET ?', [newPost], (err, post) => {
                if (err) {
                    return res.json(err);
                }

                // Reactivar las restricciones de clave foránea
                conn.query('SET FOREIGN_KEY_CHECKS = 1', (err) => {
                    if (err) {
                        return res.json(err);
                    }

                    res.redirect('/'); // redirigir al home después de guardar
                });
            });
        });
    });
};



// controller.edit = (req, res) => {
//     const idPost = req.params.idPost;
//     req.getConnection((err, conn) => {
//         if (err) {
//             return res.json(err);
//         }
//         conn.query('SELECT * FROM post WHERE idPost = ?', [idPost], (err, post) => {
//             if (err) {
//                 return res.json(err);
//             }
//             res.render('post_edit', {
//                 data: post[0] 
//             });
//         });
//     });
// }

// Función para editar un post
controller.edit = (view, req, res) => {
    const idPost = req.params.idPost;
    console.log("ID del post:", idPost);  // Agregar para depurar

    req.getConnection((err, conn) => {
        if (err) {
            return res.json(err);
        }

        conn.query('SELECT * FROM post WHERE idPost = ?', [idPost], (err, post) => {
            if (err) {
                return res.json(err);
            }

            // Verificar si el post fue encontrado
            if (post.length === 0) {
                return res.status(404).send('Post no encontrado');
            }

            res.render(view, {
                data: post[0] // Enviar el post como primer elemento del array
            });
        });
    });
};


// Función para actualizar un post
controller.update = (req, res) => {
    const idPost = req.params.idPost;
    const data = req.body;

    req.getConnection((err, conn) => {
        if (err) {
            return res.json(err);
        }

        // Primero, recuperar la foto actual de la base de datos
        conn.query('SELECT foto FROM post WHERE idPost = ?', [idPost], (err, results) => {
            if (err) {
                return res.json(err);
            }

            // Si el post no existe
            if (results.length === 0) {
                return res.status(404).send('Post no encontrado.');
            }

            const currentPhoto = results[0].foto; // Foto actual

            // Si se subió un nuevo archivo, usar la nueva imagen; si no, mantener la anterior
            const imagePath = req.file ? '/uploads/' + req.file.filename : currentPhoto; // Asegúrate de que la ruta sea correcta


            const updatedPost = {
                descripcion: data.descripcion,
                foto: imagePath, // Usar la ruta completa
                Rubro_idOficio: data.Rubro_idOficio,
                Usuario_idUsuario: data.Usuario_idUsuario,
                valoracion: data.valoracion
            };

            // Actualizar el post
            conn.query('UPDATE post SET ? WHERE idPost = ?', [updatedPost, idPost], (err, result) => {
                if (err) {
                    return res.json(err);
                }
                res.redirect('/'); // Redirigir al home después de actualizar
            });
        });
    });
};



// Función para eliminar un post
controller.delete = (req, res) => {
    const idPost = req.params.idPost;

    req.getConnection((err, conn) => {
        if (err) {
            return res.json(err);
        }

        conn.query('DELETE FROM post WHERE idPost = ?', [idPost], (err, result) => {
            if (err) {
                return res.json(err);
            }
            res.redirect('/'); // Redirigir al home después de eliminar
        });
    });
};

module.exports = controller