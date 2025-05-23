import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";
import pool from "./db.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Get all todos
app.get("/todos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM todos ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Add new todo
app.post("/todos", async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "Title required" });

    const result = await pool.query(
      "INSERT INTO todos (title) VALUES ($1) RETURNING *",
      [title]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Update todo (title or completed)
app.patch("/todos/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, completed } = req.body;

    const fields = [];
    const values = [];
    let idx = 1;

    if (title !== undefined) {
      fields.push(`title = $${idx++}`);
      values.push(title);
    }
    if (completed !== undefined) {
      fields.push(`completed = $${idx++}`);
      values.push(completed);
    }
    if (fields.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }
    values.push(id);

    const query = `UPDATE todos SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`;
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Delete todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await pool.query("DELETE FROM todos WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Summarize todos and send to Slack
app.post("/summarize", async (req, res) => {
  try {
    const todosResult = await pool.query("SELECT * FROM todos WHERE completed = false");
    const pendingTodos = todosResult.rows.map((t) => t.title);

    if (pendingTodos.length === 0) {
      return res.json({ message: "No pending todos to summarize." });
    }

    const prompt = `Summarize the following pending todos in a concise way:\n- ${pendingTodos.join(
      "\n- "
    )}`;

    // Call OpenRouter LLM API (Mistral 7B Instruct)
    const openrouterResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 100,
        }),
      }
    );

    const openrouterData = await openrouterResponse.json();
    const summary =
      openrouterData.choices?.[0]?.message?.content || "No summary generated.";

    // Send summary to Slack via Incoming Webhook
    const slackResponse = await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: `Todo Summary:\n${summary}` }),
    });

    if (!slackResponse.ok) {
      return res.status(500).json({ message: "Failed to send message to Slack" });
    }

    res.json({ message: "Summary sent to Slack successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error during summarization" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
