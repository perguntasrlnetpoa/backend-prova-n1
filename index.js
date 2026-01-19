const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");

const app = express();
app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/send-result", async (req, res) => {
  const { user, answers, score, status } = req.body;

  try {
    const statusIcon = status === "APROVADO" ? "✅" : "⚠️";

    const messageHtml = `
      <h2>Resultado da Prova</h2>
      <p><strong>Aluno:</strong> ${user}</p>
      <p><strong>Pontuação:</strong> ${score}%</p>
      <p><strong>Status:</strong> ${statusIcon} <b>${status}</b></p>
      <hr />
      ${answers.map((a, i) => `
        <p>
          <strong>${i + 1}. ${a.question}</strong><br />
          Resposta: ${a.answer}<br />
          Correta: ${a.correctAnswer}<br />
          Resultado: ${a.isCorrect ? "✅" : "❌"}
        </p>
        <hr />
      `).join("")}
    `;

    await resend.emails.send({
      from: "Prova Online <onboarding@resend.dev>",
      to: [perguntasrlnetpoa@gmail.com"],
      subject: `Resultado da Prova - ${user}`,
      html: messageHtml
    });

    console.log("✅ Email enviado com Resend");
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("❌ ERRO RESEND:", error);
    return res.status(500).json({ success: false });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend rodando na porta ${PORT}`);
});
