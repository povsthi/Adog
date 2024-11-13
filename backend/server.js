const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const port = 3001;

app.use(express.static("public"));
app.use(cors());
app.use(express.json());
const jwt = require("jsonwebtoken"); 
const privateKey = "xxxyyyzzz123";

const middlewareValidarJWT = (req, res, next) => {
    const jwtToken = req.headers["authorization"];
  
    jwt.verify(jwtToken, privateKey, (err, userInfo) => {
        if (err) {
            res.status(403).end();
            return;
        }

        req.userInfo = userInfo;
        next();
    });
};

const db = {
    host: 'adog.linceonline.com.br',
    port: 3306,
    user: 'adog_user',
    password: 'ZBBL7Ts)P52N',
    database: 'adog_banco'
};

const execSQLQuery = (sqlQry, id, res) => {
    const connection = mysql.createConnection(db);
    connection.connect();

    connection.query(sqlQry, id, (error, results) => {
        if (error) {
            console.error("Detalhes do erro SQL:", error); 
            return res.status(500).json({ error: 'Erro ao executar a consulta SQL', detalhes: error.message });
        } else {
            res.json(results);
        }
        connection.end();
        console.log('Executou: execSQLQuery');
    });
};

async function resultSQLQuery(sqlQry, id) {
    const connection = await mysql.createConnection(db);
    let [result] = await connection.promise().query(sqlQry, id);
    try {
        return result;
    } catch (error) {
        console.log("Erro: " + error);
        throw error;
    }
};

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/usuarios', middlewareValidarJWT, (req, res) => {
    const id = [];
    execSQLQuery("SELECT * from Usuario", id, res);
});

app.get('/usuarios/:id', (req, res) => { 
    const id = req.params.id; 
    execSQLQuery(`SELECT * FROM Usuario WHERE ID = ?`, [id], res); 
});


app.get('/pets', (req, res) => {
    const id = [];
    execSQLQuery("SELECT * from Pet", id, res);
});

app.get('/pets/:id', (req, res) => { 
    const id = req.params.id; 
    execSQLQuery(`SELECT * FROM Pet WHERE ID_Animal = ?`, [id], res); 
});

app.get('/pets/usuario/:idUsuario', (req, res) => { 
    const idUsuario = req.params.idUsuario; 
    execSQLQuery(`SELECT * FROM Pet WHERE FK_Usuario_ID = ?`, [idUsuario], res); 
  });  

app.post('/usuarios', (req, res) => {
    console.log('Recebendo requisição POST em /usuarios');
    const { email, senha, nome, cpf, tipo, foto, data_nascimento, morada, latitude, longitude, usuario_tipo } = req.body;
    console.log('Dados recebidos:', req.body);

    const id = [email, senha, nome, cpf, tipo, foto, data_nascimento, morada, latitude, longitude, usuario_tipo];
    const query = `
        INSERT INTO Usuario (Email, Senha, Nome, CPF, Tipo, Foto, Data_nascimento, Morada, Latitude, Longitude, Usuario_TIPO)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    execSQLQuery(query, id, res);
});

app.put('/usuarios/:idUsuario', (req, res) => {
    const idUsuario = req.params.idUsuario; 
    const { email, senha, nome, cpf, tipo, foto, data_nascimento, morada, latitude, longitude, usuario_tipo } = req.body;

    const query = `
        UPDATE Usuario 
        SET Email = ?, Senha = ?, Nome = ?, CPF = ?, Tipo = ?, Foto = ?, Data_nascimento = ?, Morada = ?, Latitude = ?, Longitude = ?, Usuario_TIPO = ?
        WHERE idUsuario = ?
    `;

    const params = [email, senha, nome, cpf, tipo, foto, data_nascimento, morada, latitude, longitude, usuario_tipo, idUsuario];
    execSQLQuery(query, params, res);
});

app.delete('/usuarios/:id', (req, res) => {
    const id = req.params.id; 
    const query = `DELETE FROM Usuario WHERE ID = ?`;

    execSQLQuery(query, [id], res);
});

app.post('/login', async (req, res) => {
    const id = [req.body.email, req.body.senha];
    let result = await resultSQLQuery('SELECT * FROM Usuario WHERE email=? and senha=?', id);

    if (result.length > 0)
        jwt.sign(req.body, privateKey, (err, token) => {
            if (err) {
                res
                    .status(500)
                    .json({ mensagem: "Erro ao gerar o JWT" });

                return;
            }
            res.json({"mensagem": "Usuário válido", "id": result[0].ID, "token": token});
            res.end();
        });
    else {
        res.json({ "mensagem": "Usuário Inválido" });
    }
    console.log(result);
    console.log("brilhou");
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

async function uploadToImgur(imageBuffer) {
    const formData = new FormData();
    formData.append('image', imageBuffer.toString('base64')); 
  
    try {
      const response = await axios.post('https://api.imgur.com/3/image', formData, {
        headers: {
          Authorization: `Client-ID 1528cabed767a7e`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data.link; 
    } catch (error) {
      console.error("Erro ao fazer upload para o Imgur:", error);
      throw new Error("Erro ao fazer upload da imagem.");
    }
  }
  
  app.post('/pets', upload.single('foto'), async (req, res) => {
    console.log('Recebendo requisição POST em /pets');
    
    const { tipo, raca, nome, sexo, idade, porte, comportamento, cidade, rua, fk_usuario_id, fk_raca_id } = req.body;
    const fotoBuffer = req.file ? req.file.buffer : null; 
  
    const petData = [tipo, raca, nome, sexo, idade, porte, comportamento, cidade, rua, fk_usuario_id, fk_raca_id];
  
    const connection = mysql.createConnection(db);
    connection.connect();
  
    connection.query(petQuery, petData, async (error, result) => {
      if (error) {
        console.error("Erro ao cadastrar o pet:", error);
        res.status(500).json({ error: 'Erro ao cadastrar o pet' });
        connection.end();
        return;
      }
  
      const petId = result.insertId;
      console.log('ID do pet cadastrado:', petId);
  
      if (fotoBuffer) {
        try {
          const imgurUrl = await uploadToImgur(fotoBuffer);
  
          const fotoQuery = `
            INSERT INTO Foto (URL, FK_Pet_ID_Animal)
            VALUES (?, ?)
          `;
          connection.query(fotoQuery, [imgurUrl, petId], (fotoError) => {
            connection.end();
            if (fotoError) {
              console.error("Erro ao salvar a URL da foto:", fotoError);
              res.status(500).json({ error: 'Erro ao salvar a URL da foto do pet' });
            } else {
              res.status(200).send('Pet cadastrado com sucesso, com foto.');
            }
          });
        } catch (uploadError) {
          console.error(uploadError.message);
          res.status(500).json({ error: 'Erro ao fazer upload da imagem para o Imgur.' });
        }
      } else {
        connection.end();
        res.status(200).send('Pet cadastrado com sucesso, sem foto.');
      }
    });
  });

app.put('/pets/:id', upload.single('foto'), (req, res) => {
    console.log('Recebendo requisição PUT em /pets/:id');
  
    const petId = req.params.id;
    const { tipo, raca, nome, sexo, idade, porte, comportamento, cidade, rua, fk_usuario_id, fk_raca_id } = req.body;
    const foto = req.file ? req.file.filename : null;
  
    const petData = [tipo, raca, nome, sexo, idade, porte, comportamento, cidade, rua, fk_usuario_id, fk_raca_id, petId];
  
    const petQuery = `
      UPDATE Pet
      SET Tipo = ?, Raca = ?, Nome = ?, Sexo = ?, Idade = ?, Porte = ?, Comportamento = ?, Cidade = ?, Rua = ?, FK_Usuario_ID = ?, FK_Raca_ID = ?
      WHERE ID = ?
    `;
  
    const connection = mysql.createConnection(db);
    connection.connect();
  
    connection.query(petQuery, petData, (error, result) => {
      if (error) {
        console.error("Erro ao atualizar o pet:", error);
        res.status(500).json({ error: 'Erro ao atualizar o pet' });
        connection.end();
        return;
      }
  
      if (foto) {
        const fotoQuery = `
          UPDATE Foto
          SET URL = ?
          WHERE FK_Pet_ID_Animal = ?
        `;
  
        connection.query(fotoQuery, [foto, petId], (fotoError) => {
          connection.end();
          if (fotoError) {
            console.error("Erro ao atualizar a foto:", fotoError);
            res.status(500).json({ error: 'Erro ao atualizar a foto do pet' });
          } else {
            res.status(200).send('Pet atualizado com sucesso, com nova foto.');
          }
        });
      } else {
        connection.end();
        res.status(200).send('Pet atualizado com sucesso, sem alteração na foto.');
      }
    });
  });
  

app.delete('/pets/:id', (req, res) => {
    const idPet = req.params.id; 
    const query = `DELETE FROM Pet WHERE ID_Animal = ?`;

    execSQLQuery(query, [idPet], res);
});


app.post('/anuncios', (req, res) => {
    console.log('Recebendo requisição POST em /anuncios');
    const { tipo, nomeParceiro, urlFoto, telefone, ruaParceiro, numeroParceiro, fkUsuarioId } = req.body;
    console.log('Dados recebidos:', req.body);

    const id = [tipo, nomeParceiro, urlFoto, telefone, ruaParceiro, numeroParceiro, fkUsuarioId ];
    const query = `
        INSERT INTO Anuncio (Tipo, NomeParceiro, urlFoto, telefone, ruaParceiro, numeroParceiro, FK_Usuario_ID)
        VALUES (?, ?, ?)
    `;

    execSQLQuery(query, id, res);
});


app.put('/anuncios/:id', (req, res) => {
    const { tipo, favorito, nomeParceiro, urlFoto, telefone, ruaParceiro, numeroParceiro } = req.body;
    const { id } = req.params;

    console.log('Recebendo requisição PUT em /anuncios');
    console.log('Dados recebidos:', req.body);

    const query = `
        UPDATE Anuncio
        SET Tipo = ?, Favorito = ?, NomeParceiro = ?, urlFoto = ?, telefone = ?, ruaParceiro = ?, numeroParceiro = ?
        WHERE ID_Anuncio = ?
    `;

    const idParams = [tipo, favorito, nomeParceiro, urlFoto, telefone, ruaParceiro, numeroParceiro, id];
    execSQLQuery(query, idParams, res);
});


app.delete('/anuncios/:id', (req, res) => {
    const { id } = req.params;
    console.log(`Deletando anúncio com ID: ${id}`);

    const query = `
        DELETE FROM Anuncio
        WHERE ID_Anuncio = ?
    `;

    const idParams = [id];
    execSQLQuery(query, idParams, res);
});

app.post('/likes', async (req, res) => {
    console.log('Recebendo requisição POST em /likes');
    const { idUsuario, idPet } = req.body;
    console.log('Dados recebidos:', req.body);
  
    if (!idUsuario || !idPet) {
      console.log('Erro: idUsuario e idPet são necessários.');
      return res.status(400).json({ error: 'idUsuario e idPet são necessários.' });
    }
  
    const query = `
        INSERT INTO Adota_Like (FK_Usuario_ID, FK_Pet_ID_Animal)
        VALUES (?, ?)
    `;
    const idParams = [idUsuario, idPet];
    
    try {
        console.log('Executando a query:', query, 'com parâmetros:', idParams);
        await resultSQLQuery(query, idParams);
        console.log('Like registrado com sucesso.');
        res.status(200).json({ message: 'Like registrado com sucesso.' });
    } catch (error) {
        console.error("Erro ao registrar o like:", error);
        res.status(500).json({ error: 'Erro ao registrar o like' });
    }
});

app.get('/likes', (req, res) => {
    const id = [];
    execSQLQuery("SELECT * from Adota_Like", id, res);
});

app.delete('/likes/:id', (req, res) => {
    const { id } = req.params;

    console.log('Recebendo requisição DELETE em /likes');
    console.log('ID do like a ser removido:', id);

    const query = `
        DELETE FROM Likes
        WHERE IDLike = ?
    `;
    const params = [id];
    execSQLQuery(query, params, res);
});

const checkForMatch = (idUsuario, idPet, res) => {
    console.log(`Verificando se há match entre o usuário ${idUsuario} e o pet ${idPet}`);
    
    const query = `
        SELECT * FROM Adota_Like 
        WHERE FK_Usuario_ID = ? AND FK_Pet_ID_Animal = ?
    `;
    
    execSQLQuery(query, [idPet, idUsuario], (result) => {
        if (result.length > 0) {
            console.log('Match encontrado!');

            const matchQuery = `
                UPDATE Adota_Like
                SET DataMatch = ?
                WHERE FK_Usuario_ID = ? AND FK_Pet_ID_Animal = ?
            `;

            const matchParams = [new Date(), idUsuario, idPet];
            execSQLQuery(matchQuery, matchParams, (matchResult) => {
                res.json({ message: "Match encontrado!", match: true });
            });
        } else {
            res.json({ message: "Like registrado, mas sem match ainda.", match: false });
        }
    });
};

app.get('/matchs/:id', (req, res) => {
    const id = req.params.id;
    console.log(`Buscando matchs para o usuário com ID ${id}`);

    const query = `
        SELECT * FROM Adota_Like 
        WHERE FK_Usuario_ID = ? AND DataMatch IS NOT NULL
    `;

    execSQLQuery(query, [id], res);
});

app.post('/favoritas', (req, res) => {
    const { idUsuario, idPet } = req.body;

    console.log('Recebendo requisição POST em /favoritas');
    console.log('Dados recebidos:', req.body);

    const query = `
        INSERT INTO Favorita (FK_Pet_ID_Animal, FK_Usuario_ID)
        VALUES (?, ?)
    `;

    const params = [idUsuario, idPet];
    execSQLQuery(query, params, res);
});

app.delete('/favoritas/:id', (req, res) => {
    const { id } = req.params;

    console.log('Recebendo requisição DELETE em /favoritas');
    console.log('ID do favorito a ser removido:', id);

    const query = `
        DELETE FROM Favorita
        WHERE IDFavorito = ?
    `;

    const params = [id];
    execSQLQuery(query, params, res);
});

app.get('/favoritas', (req, res) => {
    const id = [];
    execSQLQuery("SELECT * from Favorita", id, res);
});

app.get('/favoritas/:idUsuario', (req, res) => { 
    const idUsuario = req.params.idUsuario; 
    execSQLQuery(`SELECT * FROM Pet WHERE FK_Usuario_ID = ?`, [idUsuario], res); 
});



app.listen(port, () => {
    console.log(`App escutando na porta ${port}`);
});




