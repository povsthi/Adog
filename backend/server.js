const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const port = 8080;

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
})

/*********************************endpoints para cadastro, visualização e edição de usuário********************************* */

app.get('/usuarios', middlewareValidarJWT, (req, res) => {
    const id = [];
    execSQLQuery("SELECT * from Usuario", id, res);
});

app.get('/usuarios/:id', (req, res) => { 
    const id = req.params.id; 
    execSQLQuery(`SELECT * FROM Usuario WHERE ID = ?`, [id], res); 
});

app.post('/usuarios', (req, res) => {
    console.log('Recebendo requisição POST em /usuarios');
    const { email, senha, nome, tipo, foto, data_nascimento, morada, latitude, longitude, usuario_tipo } = req.body;
    console.log('Dados recebidos:', req.body);

    const id = [email, senha, nome, tipo, foto, data_nascimento, morada, latitude, longitude, usuario_tipo];
    const query = `
        INSERT INTO Usuario (Email, Senha, Nome, Tipo, Foto, Data_nascimento, Morada, Latitude, Longitude, Usuario_TIPO)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    execSQLQuery(query, id, res);
});

app.put('/usuarios/:idUsuario', (req, res) => {
    const idUsuario = req.params.idUsuario; 
    const { email, senha, nome, cpf, tipo, foto, data_nascimento, morada, latitude, longitude, usuario_tipo } = req.body;

    const query = `
        UPDATE Usuario 
        SET Email = ?, Senha = ?, Nome = ?, Tipo = ?, Foto = ?, Data_nascimento = ?, Morada = ?, Latitude = ?, Longitude = ?, Usuario_TIPO = ?
        WHERE idUsuario = ?
    `;

    const params = [email, senha, nome, tipo, foto, data_nascimento, morada, latitude, longitude, usuario_tipo, idUsuario];
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

/*********************************endpoints para cadastro, visualização e edição de pets********************************* */

app.post('/pets', async (req, res) => {
    console.log('Recebendo requisição POST em /pets');
    
    const { tipo, raca, nome, sexo, idade, porte, comportamento, cidade, rua, foto, fk_usuario_id } = req.body;
    
    const petData = [tipo, raca, nome, sexo, idade, porte, comportamento, cidade, rua, foto, fk_usuario_id];

    const petQuery = `
    INSERT INTO Pet 
    (Tipo, Raca, Nome, Sexo, Idade, Porte, Comportamento, Cidade, Rua, Foto_URL, FK_Usuario_ID)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;
  
    const connection = mysql.createConnection(db);
    connection.connect();
  
    connection.query(petQuery, petData, (error, result) => {
      if (error) {
        console.error("Erro ao cadastrar o pet:", error);
        res.status(500).json({ error: 'Erro ao cadastrar o pet' });
        connection.end();
        return;
      }
  
      console.log('ID do pet cadastrado:', result.insertId);
      connection.end();
      res.status(200).send('Pet cadastrado com sucesso.');
    });
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
 
  app.put('/pets/:id', (req, res) => {
    console.log('Recebendo requisição PUT em /pets/:id');
  
    const petId = req.params.id;
    const { tipo, raca, nome, sexo, idade, porte, comportamento, cidade, rua, foto, fk_usuario_id } = req.body;
  
    const petData = [tipo, raca, nome, sexo, idade, porte, comportamento, cidade, rua, foto, fk_usuario_id, petId];
  
    const petQuery = `
      UPDATE Pet
      SET Tipo = ?, Raca = ?, Nome = ?, Sexo = ?, Idade = ?, Porte = ?, Comportamento = ?, Cidade = ?, Rua = ?, Foto_URL = ?, FK_Usuario_ID = ?
      WHERE ID = ?
    `;
  
    const connection = mysql.createConnection(db);
    connection.connect();
  
    connection.query(petQuery, petData, (error, result) => {
      connection.end();
  
      if (error) {
        console.error("Erro ao atualizar o pet:", error);
        res.status(500).json({ error: 'Erro ao atualizar o pet' });
        return;
      }
  
      res.status(200).send('Pet atualizado com sucesso.');
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

/********************************************endpoints para likes e matchs ******************************************************* */

app.post('/likes', (req, res) => {
    const { idUsuario, idPet } = req.body;

    console.log('Recebendo requisição POST em /likes');
    console.log('Dados recebidos:', req.body);


    if (!idUsuario || !idPet) {
        return res.status(400).json({ error: 'idUsuario e idPet são necessários.' });
    }

    const ownerQuery = `
        SELECT FK_Usuario_ID 
        FROM Pet 
        WHERE ID_Animal = ?
    `;

    execSQLQuery(ownerQuery, [idPet], {
        json: (ownerResult) => {
            if (ownerResult.length === 0) {
                return res.status(404).json({ error: 'Pet não encontrado.' });
            }

            const idDono = ownerResult[0].FK_Usuario_ID;

            const likeQuery = `
                INSERT INTO Adota_Like (FK_Usuario_ID, FK_Pet_ID_Animal)
                VALUES (?, ?)
            `;

            execSQLQuery(likeQuery, [idUsuario, idPet], {
                json: (likeResults) => {
                    res.status(200).json({
                        message: 'Like registrado com sucesso. Dono do pet será notificado.',
                        idLike: likeResults.insertId,
                        donoNotificado: idDono,
                    });
                },
                status: (errorCode) => {
                    res.status(errorCode).json({ error: 'Erro ao registrar o like.' });
                },
            });
        },
        status: (errorCode) => {
            res.status(errorCode).json({ error: 'Erro ao buscar o dono do pet.' });
        },
    });
});

  
app.post('/likes/check', (req, res) => {
    const { idUsuario, idPet } = req.body;

    const query = `
        SELECT COUNT(*) AS isLiked
        FROM Adota_Like
        WHERE FK_Usuario_ID = ? AND FK_Pet_ID_Animal = ?
    `;
    
    execSQLQuery(query, [idUsuario, idPet], {
        json: (result) => {
            
            res.status(200).json({ isLiked: result[0].isLiked > 0 });
        },
        status: (statusCode) => ({
            json: (error) => res.status(statusCode).json(error),
        }),
    });
});


app.get('/likes', (req, res) => {
    const id = [];
    execSQLQuery("SELECT * from Adota_Like", id, res);
});

app.delete('/unlike', async (req, res) => {
    const { idUsuario, idPet } = req.body;
  
    if (!idUsuario || !idPet) {
      return res.status(400).json({ error: 'idUsuario e idPet são necessários.' });
    }
  
    try {
      const query = `
        DELETE FROM Adota_Like
        WHERE FK_Usuario_ID = ? AND FK_Pet_ID_Animal = ?
      `;
      const params = [idUsuario, idPet];
  
      const result = await resultSQLQuery(query, params);
  
      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'Like removido com sucesso.' });
      } else {
        res.status(404).json({ error: 'Registro não encontrado.' });
      }
    } catch (error) {
      console.error('Erro ao remover o like:', error);
      res.status(500).json({ error: 'Erro ao remover o like.' });
    }
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

/******************************* endpoints para favoritar o pet ******************************************************* */

app.post('/favoritas', (req, res) => {
    const { idUsuario, idPet } = req.body;

    console.log('Recebendo requisição POST em /favoritas');
    console.log('Dados recebidos:', req.body);

    const checkQuery = `
        SELECT * FROM Favorita WHERE FK_Usuario_ID = ? AND FK_Pet_ID_Animal = ?
    `;
    const checkParams = [idUsuario, idPet];

    execSQLQuery(checkQuery, checkParams, (checkResult) => {
        if (checkResult.length > 0) {
            return res.status(400).json({ message: 'Este pet já foi favoritado por este usuário.' });
        }

        const insertQuery = `
            INSERT INTO Favorita (FK_Pet_ID_Animal, FK_Usuario_ID)
            VALUES (?, ?)
        `;
        const insertParams = [idPet, idUsuario];

        execSQLQuery(insertQuery, insertParams, (insertResult) => {
            res.status(200).json({ message: 'Pet favoritado com sucesso!' });
        });
    });
});

app.post('/favoritas/check', (req, res) => {
    const { idUsuario, idPet } = req.body;

    console.log('Recebendo requisição POST em /favoritas/check');
    console.log('Dados recebidos:', req.body);

    const checkQuery = `
        SELECT COUNT(*) AS isFavorited
        FROM Favorita
        WHERE FK_Usuario_ID = ? AND FK_Pet_ID_Animal = ?
    `;
    const checkParams = [idUsuario, idPet];

    execSQLQuery(checkQuery, checkParams, {
        json: (results) => {
            const isFavorited = results[0]?.isFavorited > 0;
            res.status(200).json({ isFavorited });
        },
        status: (statusCode) => ({
            json: (error) => res.status(statusCode).json(error),
        }),
    });
});


app.delete('/desfavoritar', (req, res) => {
    const { FK_Usuario_ID, FK_Pet_ID_Animal } = req.body;
  
    execSQLQuery(
      'DELETE FROM Favoritos WHERE FK_Usuario_ID = ? AND FK_Pet_ID_Animal = ?',
      [FK_Usuario_ID, FK_Pet_ID_Animal],
      (result) => {
        res.status(200).json({ message: 'Pet desfavoritado com sucesso!' });
      }
    );
  });

app.get('/favoritas', (req, res) => {
    const id = [];
    execSQLQuery("SELECT * from Favorita", id, res);
});

app.get('/favoritas/:idUsuario', (req, res) => { 
    const idUsuario = req.params.idUsuario; 
    execSQLQuery(`SELECT * FROM Favorita WHERE FK_Usuario_ID = ?`, [idUsuario], res); 
});
/******************************** endpoints para notificações******************************************************* */
app.put('/notificacaolida/:idAdota', (req, res) => {
    const { idAdota } = req.params;

    const updateQuery = `
        UPDATE Adota_Like 
        SET Lida = TRUE 
        WHERE IDAdota = ?
    `;

    execSQLQuery(updateQuery, [idAdota], {
        json: () => {
            res.status(200).json({ message: 'Notificação marcada como lida.' });
        },
        status: (errorCode, errorMessage) => {
            console.error('Erro ao marcar notificação como lida:', errorMessage);
            res.status(errorCode).json({ error: 'Erro ao atualizar a notificação.' });
        },
    });
});

app.get('/notificacoes/:idUsuario', (req, res) => {
    const { idUsuario } = req.params;

    const notificacoesQuery = `
        SELECT 
            al.IDAdota, 
            al.DataLike, 
            al.Lida, 
            u.Nome AS UsuarioQueCurtiu,
            p.Nome AS NomePet
        FROM 
            Adota_Like al
        JOIN 
            Pet p ON al.FK_Pet_ID_Animal = p.ID_Animal
        JOIN 
            Usuario u ON al.FK_Usuario_ID = u.ID
        WHERE 
            p.FK_Usuario_ID = ? -- ID do dono do pet
        ORDER BY 
            al.DataLike DESC
    `;

    execSQLQuery(notificacoesQuery, [idUsuario], {
        json: (results) => {
            if (results.length === 0) {
                return res.status(404).json({ message: 'Nenhuma notificação encontrada.' });
            }

            res.status(200).json({
                message: 'Notificações carregadas com sucesso.',
                notificacoes: results,
            });
        },
        status: (errorCode, errorMessage) => {
            console.error('Erro ao buscar notificações:', errorMessage);
            res.status(errorCode).json({ error: 'Erro ao buscar notificações.' });
        },
    });
});

app.listen(port, () => {
    console.log(`App escutando na porta ${port}`);
});




