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

const db = {
    host: 'adog.linceonline.com.br',
    port: 3306,
    user: 'adog_user',
    password: 'ZBBL7Ts)P52N',
    database: 'adog_banco'
};

const execSQLQuery = (sqlQry, id, res) => {
    const connection = mysql.createConnection(db);
    connection.query(sqlQry, id, (error, results, fields) => {
        if (error) {
            res.json(error);
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

app.get('/usuarios', (req, res) => {
    const id = [];
    execSQLQuery("SELECT * from Usuario", id, res);
});

app.get('/pets', (req, res) => {
    const id = [];
    execSQLQuery("SELECT * from Pet", id, res);
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

app.post('/login', async (req, res) => {
    const id = [req.body.email, req.body.senha];
    let result = await resultSQLQuery('SELECT * FROM Usuario WHERE email=? and senha=?', id);

    if (result.length > 0)
        res.json({ "mensagem": "Usuário válido" });
    else {
        res.json({ "mensagem": "Usuário Inválido" });
    }
    console.log(result);
    console.log("brilhou");
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); 
    },
  });
  
  const upload = multer({ storage });
  
  app.post('/pets', upload.single('foto'), (req, res) => {
    console.log('Recebendo requisição POST em /pets');
    const {
      tipo, raca, nome, sexo, data_nascimento, porte, comportamento, cidade, rua, fk_usuario_id, fk_raca_id
    } = req.body;
  
    const foto = req.file ? req.file.filename : null; 
  
    const petData = [tipo, raca, nome, sexo, data_nascimento, porte, comportamento, cidade, rua, fk_usuario_id, fk_raca_id];
  
    const petQuery = `
      INSERT INTO Pet (Tipo, Raca, Nome, Sexo, Data_Nascimento, Porte, Comportamento, Cidade, Rua, FK_Usuario_ID, FK_Raca_ID)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
  
    execSQLQuery(petQuery, petData, (result) => {
      const petId = result.insertId;
  
      if (foto) {
        const fotoQuery = `
          INSERT INTO Foto (URL, FK_Pet_ID_Animal)
          VALUES (?, ?)
        `;
        execSQLQuery(fotoQuery, [foto, petId], (fotoResult) => {
          res.status(200).send('Pet cadastrado com sucesso, com foto.');
        });
      } else {
        res.status(200).send('Pet cadastrado com sucesso, sem foto.');
      }
    });
  });

app.post('/anuncios', (req, res) => {
    console.log('Recebendo requisição POST em /anuncios');
    const { tipo, fk_usuario_id, favorito } = req.body;
    console.log('Dados recebidos:', req.body);

    const id = [tipo, fk_usuario_id, favorito];
    const query = `
        INSERT INTO Anuncio (Tipo, FK_Usuario_ID, Favorito)
        VALUES (?, ?, ?)
    `;

    execSQLQuery(query, id, res);
});


app.put('/anuncios/:id', (req, res) => {
    const { tipo, favorito } = req.body;
    const { id } = req.params;

    console.log('Recebendo requisição PUT em /anuncios');
    console.log('Dados recebidos:', req.body);

    const query = `
        UPDATE Anuncio
        SET Tipo = ?, Favorito = ?
        WHERE ID_Anuncio = ?
    `;

    const idParams = [tipo, favorito, id];
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

app.post('/parceiros', (req, res) => {
    console.log('Recebendo requisição POST em /parceiros');
    const { tipo, nome, telefone, local } = req.body;
    console.log('Dados recebidos:', req.body);

    const id = [tipo, nome, telefone, local];
    const query = `
        INSERT INTO Parceiro (Tipo, Nome, Telefone, Local)
        VALUES (?, ?, ?, ?)
    `;

    execSQLQuery(query, id, res);
});

app.put('/parceiros/:id', (req, res) => {
    const { tipo, nome, telefone, local } = req.body;
    const { id } = req.params;

    console.log('Recebendo requisição PUT em /parceiros');
    console.log('Dados recebidos:', req.body);

    const query = `
        UPDATE Parceiro
        SET Tipo = ?, Nome = ?, Telefone = ?, Local = ?
        WHERE ID_Parceiro = ?
    `;

    const idParams = [tipo, nome, telefone, local, id];
    execSQLQuery(query, idParams, res);
});

app.delete('/parceiros/:id', (req, res) => {
    const { id } = req.params;
    console.log(`Deletando parceiro com ID: ${id}`);

    const query = `
        DELETE FROM Parceiro
        WHERE ID_Parceiro = ?
    `;

    const idParams = [id];
    execSQLQuery(query, idParams, res);
});

app.post('/likes', (req, res) => {
    console.log('Recebendo requisição POST em /likes');
    const { idUsuario, idPet } = req.body;
    console.log('Dados recebidos:', req.body);

    const query = `
        INSERT INTO Adota_Like (FK_Usuario_ID, FK_Pet_ID_Animal)
        VALUES (?, ?)
    `;
    const idParams = [idUsuario, idPet];
    
    execSQLQuery(query, idParams, (result) => {
        checkForMatch(idUsuario, idPet, res);
    });
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


app.listen(port, () => {
    console.log(`App escutando na porta ${port}`);
});




