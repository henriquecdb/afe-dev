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
app.post("/request-password-reset", requestPasswordReset);
app.post("/verify-reset-code", verifyResetCode);
app.post("/reset-password", resetPassword);
app.post("/registerExpense", registerExpense);
app.post("/registerEntry", registerEntry);
app.get("/userExpenses/:id/:month", getUserExpenses);
app.get("/userEntries/:id/:month", getUserEntries);
app.get("/userExpensesTotal/:id/:month", getUserExpenseTotal);
app.get("/userEntriesTotal/:id/:month", getUserEntryTotal);
app.get("/expensesByCat/:id/:month", getNOfExpByCat);
app.get("/userBalance/:id/:month", getUserBalance);
app.get("/userTotalEntExpMonth/:id/:month", getUserTotalEntExpMonth);

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

async function registerExpense(req, res) {
  try {
    const { name, value, data, category, id_user } = req.body;

    if ((!name, !value || !data || !category || !id_user)) {
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios" });
    }

    try {
      saveExpense(name, value, data, category, id_user, (error, expenseId) => {
        if (error) {
          console.log(data);
          console.log(value);
          console.log(category);
          console.log(id_user);
          return res.status(500).json({ error: "Erro ao cadastrar despesa" });
        }

        res.status(201).json({
          message: "Despesa cadastrada com sucesso",
          expenseId: expenseId,
        });
      });
    } catch (error) {
      res.status(500).json({ error: "Erro ao processar despesa" });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro no servidor" });
  }
}

function saveExpense(name, value, data, category, id_user, callback) {
  connection.query(
    "INSERT INTO expenses (name, value, data, category, id_user) VALUES (?, ?, ?, ?, ?)",
    [name, value, data, category, id_user],
    (err, result) => {
      if (err) return callback(err);
      return callback(null, result.insertId);
    }
  );
}

async function registerEntry(req, res) {
  try {
    const { name, value, data, category, id_user } = req.body;

    if (!name || !value || !data || category != 0 || !id_user) {
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios" });
    }

    try {
      saveEntry(name, value, data, category, id_user, (error, entryId) => {
        if (error) {
          return res.status(500).json({ error: "Erro ao cadastrar entrada" });
        }

        res.status(201).json({
          message: "Entrada cadastrada com sucesso",
          entryId: entryId,
        });
      });
    } catch (error) {
      res.status(500).json({ error: "Erro ao processar entrada" });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro no servidor" });
  }
}

function saveEntry(name, value, data, category, id_user, callback) {
  connection.query(
    "INSERT INTO entries (name, value, data, category, id_user) VALUES (?, ?, ?, ?, ?)",
    [name, value, data, category, id_user],
    (err, result) => {
      if (err) return callback(err);
      return callback(null, result.insertId);
    }
  );
}

async function getUserEntries(req, res) {
  try {
    const userId = req.params.id;
    const month = req.params.month;

    if (!userId) {
      return res.status(400).json({ error: "ID do usuário é obrigatório" });
    }

    connection.query(
      "SELECT entries.id, entries.name, value, data FROM users JOIN entries ON users.id = ? " +
        "AND users.id = entries.id_user AND MONTH(data) = ? ORDER BY data DESC",
      [userId, month],
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

        res.json(results);
      }
    );
  } catch (error) {
    console.error("Erro no getUserExpenses:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function getUserExpenses(req, res) {
  try {
    const userId = req.params.id;
    const month = req.params.month;

    console.log(userId);
    console.log(month);

    if (!userId) {
      return res.status(400).json({ error: "ID do usuário é obrigatório" });
    }

    connection.query(
      "SELECT expenses.id, expenses.name, value, data, category FROM users JOIN expenses ON users.id = ? " +
        "AND users.id = expenses.id_user AND MONTH(data) = ? ORDER BY data DESC",
      [userId, month],
      (err, results) => {
        if (err) {
          console.error("Erro ao buscar usuário:", err);
          return res
            .status(500)
            .json({ error: "Erro ao buscar dados do usuário" });
        }

        if (results.length === 0) {
          return res
            .status(404)
            .json({ error: "Usuário não possui despesas no mês selecionado" });
        }

        res.json(results);
      }
    );
  } catch (error) {
    console.error("Erro no getUserExpenses:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function getUserExpenseTotal(req, res) {
  try {
    const userId = req.params.id;
    const month = req.params.month;

    console.log(userId);
    console.log(month);

    if (!userId) {
      return res.status(400).json({ error: "ID do usuário é obrigatório" });
    }

    connection.query(
      "SELECT SUM(value) AS totalExp FROM users JOIN expenses ON users.id = ?" +
        "AND users.id = expenses.id_user AND MONTH(data) = ?",
      [userId, month],
      (err, results) => {
        if (err) {
          console.error("Erro ao buscar usuário:", err);
          return res
            .status(500)
            .json({ error: "Erro ao buscar dados do usuário" });
        }

        if (results.length === 0) {
          return res
            .status(404)
            .json({ error: "Usuário não possui despesas no mês selecionado" });
        }

        res.json(results[0]);
      }
    );
  } catch (error) {
    console.error("Erro no getUserExpenses:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function getUserEntryTotal(req, res) {
  try {
    const userId = req.params.id;
    const month = req.params.month;

    console.log(userId);
    console.log(month);

    if (!userId) {
      return res.status(400).json({ error: "ID do usuário é obrigatório" });
    }

    connection.query(
      "SELECT SUM(value) AS totalEnt FROM users JOIN entries ON users.id = ?" +
        "AND users.id = entries.id_user AND MONTH(data) = ?",
      [userId, month],
      (err, results) => {
        if (err) {
          console.error("Erro ao buscar usuário:", err);
          return res
            .status(500)
            .json({ error: "Erro ao buscar dados do usuário" });
        }

        if (results.length === 0) {
          return res
            .status(404)
            .json({ error: "Usuário não possui entradas no mês selecionado" });
        }

        res.json(results[0]);
      }
    );
  } catch (error) {
    console.error("Erro no getUserExpenses:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function getNOfExpByCat(req, res) {
  try {
    const userId = req.params.id;
    const month = req.params.month;

    console.log(userId);
    console.log(month);

    if (!userId) {
      return res.status(400).json({ error: "ID do usuário é obrigatório" });
    }

    connection.query(
      "SELECT category, COUNT(*) AS totalPorCat FROM expenses JOIN users ON users.id = ? " +
        "AND users.id = expenses.id_user " +
        "AND MONTH(data) = ? GROUP BY category ORDER BY category",
      [userId, month],
      (err, results) => {
        if (err) {
          console.error("Erro ao buscar usuário:", err);
          return res
            .status(500)
            .json({ error: "Erro ao buscar dados do usuário" });
        }

        if (results.length === 0) {
          return res
            .status(404)
            .json({ error: "Usuário não possui despesas no mês selecionado" });
        }

        res.json(results);
      }
    );
  } catch (error) {
    console.error("Erro no getUserExpenses:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function getUserBalance(req, res) {
  try {
    const userId = req.params.id;
    const month = req.params.month;

    console.log(userId);
    console.log(month);

    if (!userId) {
      return res.status(400).json({ error: "ID do usuário é obrigatório" });
    }

    connection.query(
      "SELECT expenses.id, expenses.name, expenses.value, expenses.data, expenses.category FROM users JOIN expenses ON users.id = ? " +
        "AND users.id = expenses.id_user AND MONTH(data) = ? UNION ALL SELECT entries.id, entries.name, entries.value, entries.data, entries.category " +
        "FROM users JOIN entries ON users.id = ? AND users.id = entries.id_user AND MONTH(data) = ? ORDER BY data DESC",
      [userId, month, userId, month],
      (err, results) => {
        if (err) {
          console.error("Erro ao buscar usuário:", err);
          return res
            .status(500)
            .json({ error: "Erro ao buscar dados do usuário" });
        }

        if (results.length === 0) {
          return res
            .status(404)
            .json({ error: "Usuário não possui despesas no mês selecionado" });
        }

        res.json(results);
      }
    );
  } catch (error) {
    console.error("Erro no getUserExpenses:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function getUserTotalEntExpMonth(req, res) {
  try {
    const userId = req.params.id;
    const month = req.params.month;

    console.log(userId);
    console.log(month);

    if (!userId) {
      return res.status(400).json({ error: "ID do usuário é obrigatório" });
    }

    connection.query(
      "SELECT (SELECT COUNT(*) FROM users JOIN entries ON users.id = ? " +
        "AND users.id = entries.id_user AND MONTH(entries.data) = ?) + " +
        "(SELECT COUNT(*) FROM users JOIN expenses ON users.id = ? " +
        "AND users.id = expenses.id_user AND MONTH(expenses.data) = ?) AS totalDoMes",
      [userId, month, userId, month],
      (err, results) => {
        if (err) {
          console.error("Erro ao buscar usuário:", err);
          return res
            .status(500)
            .json({ error: "Erro ao buscar dados do usuário" });
        }

        if (results.length === 0) {
          return res
            .status(404)
            .json({ error: "Usuário não possui despesas no mês selecionado" });
        }

        res.json(results);
      }
    );
  } catch (error) {
    console.error("Erro no getUserExpenses:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

const resetCodes = new Map();

function generateResetCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function requestPasswordReset(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email é obrigatório" });
    }

    checkEmailExists(email, (error, exists) => {
      if (error) {
        return res.status(500).json({ error: "Erro ao verificar email" });
      }

      if (!exists) {
        return res.status(404).json({ error: "Email não encontrado" });
      }

      const resetCode = generateResetCode();

      resetCodes.set(email, {
        code: resetCode,
        expires: Date.now() + 10 * 60 * 1000,
      });

      // Só para testar
      console.log(`Código de recuperação para ${email}: ${resetCode}`);

      res.json({
        message: "Código de recuperação enviado para o email",
        // Só para testar
        code: resetCode,
      });
    });
  } catch (_error) {
    res.status(500).json({ error: "Erro no servidor" });
  }
}

async function verifyResetCode(req, res) {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: "Email e código são obrigatórios" });
    }

    const storedData = resetCodes.get(email);

    if (!storedData) {
      return res
        .status(400)
        .json({ error: "Código não encontrado ou expirado" });
    }

    if (Date.now() > storedData.expires) {
      resetCodes.delete(email);
      return res.status(400).json({ error: "Código expirado" });
    }

    if (storedData.code !== code) {
      return res.status(400).json({ error: "Código incorreto" });
    }

    res.json({ message: "Código verificado com sucesso" });
  } catch (_error) {
    res.status(500).json({ error: "Erro no servidor" });
  }
}

async function resetPassword(req, res) {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios" });
    }

    const storedData = resetCodes.get(email);

    if (!storedData) {
      return res
        .status(400)
        .json({ error: "Código não encontrado ou expirado" });
    }

    if (Date.now() > storedData.expires) {
      resetCodes.delete(email);
      return res.status(400).json({ error: "Código expirado" });
    }

    if (storedData.code !== code) {
      return res.status(400).json({ error: "Código incorreto" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    connection.query(
      "UPDATE users SET password = ? WHERE email = ?",
      [hashedPassword, email],
      (err, result) => {
        if (err) {
          console.error("Erro ao atualizar senha:", err);
          return res.status(500).json({ error: "Erro ao atualizar senha" });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Usuário não encontrado" });
        }

        resetCodes.delete(email);

        res.json({ message: "Senha alterada com sucesso" });
      }
    );
  } catch (error) {
    console.error("Erro no resetPassword:", error);
    res.status(500).json({ error: "Erro no servidor" });
  }
}
