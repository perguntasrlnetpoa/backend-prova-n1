const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post("/send-result", async (req, res) => {
  const { user, answers, score, status } = req.body;

  try {
    console.log("📩 Requisição recebida");

    const statusIcon = status === "APROVADO" ? "✅" : "⚠️";

    const messageHtml = `
      <h2>Resultado da Prova</h2>

      <p><strong>Aluno:</strong> ${user}</p>
      <p><strong>Pontuação:</strong> ${score}%</p>
      <p><strong>Status:</strong> ${statusIcon} <b>${status}</b></p>

      <hr />

      ${answers
        .map(
          (a, i) => `
        <p>
          <strong>${i + 1}. ${a.question}</strong><br />
          Resposta: ${a.answer}<br />
          Correta: ${a.correctAnswer}<br />
          Resultado: ${a.isCorrect ? "✅" : "❌"}
        </p>
        <hr />
      `
        )
        .join("")}
    `;

    const mailOptions = {
      from: `"Prova Online" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `Resultado da Prova - ${user}`,
      html: messageHtml
    };

    await transporter.sendMail(mailOptions);

    console.log("✅ Email enviado com sucesso");
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("❌ ERRO EMAIL:", error);
    return res.status(500).json({ success: false });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando na porta ${PORT}`);
});
