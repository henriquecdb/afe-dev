const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const connection = require("./db");
const app = express();
app.use(cors());
app.use(express.json());

app.get("/users", getUsers);
app.get("/user/:id", getUserData);
app.post("/register", registerUser);
app.post("/login", loginUser);
app.put("/user/:id", updateUser);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// Funções auxiliares ------------------

async function getUsers(req, res) {
  connection.query("SELECT * FROM users", (err, results) => {
    if (err) {
      res.status(500).json({ error: "Erro na consulta" });
    } else {
      res.json(results);
    }
  });
}

function getUserData(req, res) {
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({ error: "ID do usuário é obrigatório" });
  }

  connection.query(
    "SELECT id, name, email, objective FROM users WHERE id = ?",
    [userId],
    (err, results) => {
      if (err) {
        console.error("Erro ao buscar usuário:", err);
        return res
          .status(500)
          .json({ error: "Erro ao buscar dados do usuário" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      res.json(results[0]);
    }
  );
}

async function registerUser(req, res) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios" });
    }

    checkEmailExists(email, async (error, exists) => {
      if (error) {
        return res.status(500).json({ error: "Erro ao verificar email" });
      }

      if (exists) {
        return res.status(409).json({ error: "Email já cadastrado" });
      }

      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        saveUser(email, hashedPassword, name, (error, userId) => {
          if (error) {
            return res.status(500).json({ error: "Erro ao cadastrar usuário" });
          }

          res.status(201).json({
            message: "Usuário cadastrado com sucesso",
            userId: userId,
          });
        });
      } catch (error) {
        res.status(500).json({ error: "Erro ao processar senha" });
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Erro no servidor" });
  }
}

function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha são obrigatórios" });
  }

  getUserByEmail(email, async (error, user) => {
    if (error) {
      return res.status(500).json({ error: "Erro na consulta" });
    }

    if (!user) {
      return res.status(401).json({ error: "Email ou senha incorretos" });
    }

    try {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: "Email ou senha incorretos" });
      }

      const { password: _, ...userData } = user;

      res.json({
        message: "Login realizado com sucesso",
        user: userData,
      });
    } catch (error) {
      res.status(500).json({ error: "Erro ao verificar senha" });
    }
  });
}

function checkEmailExists(email, callback) {
  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) return callback(err);
      return callback(null, results.length > 0);
    }
  );
}

function saveUser(email, hashedPassword, name, callback) {
  connection.query(
    "INSERT INTO users (email, password, name) VALUES (?, ?, ?)",
    [email, hashedPassword, name],
    (err, result) => {
      if (err) return callback(err);
      return callback(null, result.insertId);
    }
  );
}

function getUserByEmail(email, callback) {
  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) return callback(err);
      if (results.length === 0) return callback(null, null);
      return callback(null, results[0]);
    }
  );
}

function checkUserExists(userId) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT id FROM users WHERE id = ?",
      [userId],
      (err, results) => {
        if (err) return reject(err);
        resolve(results.length > 0);
      }
    );
  });
}

function checkEmailExistsForOtherUser(email, currentUserId) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT id FROM users WHERE email = ? AND id != ?",
      [email, currentUserId],
      (err, results) => {
        if (err) return reject(err);
        resolve(results.length > 0);
      }
    );
  });
}

async function updateUser(req, res) {
  try {
    const userId = req.params.id;
    const { email, password, objective } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "ID do usuário é obrigatório" });
    }

    const userExists = await checkUserExists(userId);
    if (!userExists) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const updateFields = [];
    const values = [];

    if (email) {
      const emailTaken = await checkEmailExistsForOtherUser(email, userId);
      if (emailTaken) {
        return res
          .status(409)
          .json({ error: "Este email já está sendo usado por outro usuário" });
      }
      updateFields.push("email = ?");
      values.push(email);
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.push("password = ?");
      values.push(hashedPassword);
    }

    if (objective !== undefined) {
      updateFields.push("objective = ?");
      values.push(objective);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: "Nenhum campo para atualizar" });
    }

    values.push(userId);
    const query = `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`;

    connection.query(query, values, (err, result) => {
      if (err) {
        console.error("Erro ao atualizar usuário:", err);
        return res.status(500).json({ error: "Erro ao atualizar usuário" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      res.json({ message: "Dados atualizados com sucesso" });
    });
  } catch (error) {
    console.error("Erro no updateUser:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}
