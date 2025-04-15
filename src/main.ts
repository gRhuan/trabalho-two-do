import Fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const app = Fastify();
const prisma = new PrismaClient();

app.post("/register", async (request, reply) => {
  const { name, email, password } = request.body as {
    name: string;
    email: string;
    password: string;
  };

  try {
    const userExists = await prisma.users.findUnique({ where: { email } });

    if (userExists) {
      return reply.status(400).send({ error: "Email já cadastrado." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return reply.status(201).send({ message: "Usuário cadastrado!", user });
  } catch (err) {
    return reply.status(500).send({ error: "Erro ao cadastrar." });
  }
});

app.post("/login", async (request, reply) => {
  const { email, password } = request.body as {
    email: string;
    password: string;
  };

  try {
    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      return reply.status(404).send({ error: "Usuário não encontrado." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return reply.status(401).send({ error: "Senha incorreta." });
    }

    return reply.send({ message: "Login feito com sucesso!", user });
  } catch (err) {
    return reply.status(500).send({ error: "Erro no login." });
  }
});

app.listen({ port: 3333 }, () => {
  console.log("🚀 Fastify rodando na porta 3333");
});
