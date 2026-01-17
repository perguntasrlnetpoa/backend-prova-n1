const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

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
  const { user, answers, score } = req.body;

  try {
    let body = `Aluno: ${user}\n\nPontuação: ${score}\n\n`;

    answers.forEach((a, i) => {
      body += `Questão ${i + 1}\n`;
      body += `Pergunta: ${a.question}\n`;
      body += `Resposta marcada: ${a.answer}\n`;
      body += `Resposta correta: ${a.correctAnswer}\n`;
      body += `Resultado: ${a.isCorrect ? "CORRETA" : "ERRADA"}\n\n`;
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Prova N1 - ${user}`,
      text: body
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.listen(3001, () => {
  console.log("Backend rodando");
});
