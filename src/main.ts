import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import Fastify from "fastify";

const app = Fastify();
const prisma = new PrismaClient();

await app.register(swagger);
await app.register(swaggerUI, {
  routePrefix: "/docs",
});

const registerSchema = {
  body: {
    type: "object",
    required: ["name", "email", "password"],
    properties: {
      name: { type: "string" },
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 6 },
    },
  },
  response: {
    201: {
      type: "object",
      properties: {
        message: { type: "string" },
        user: {
          type: "object",
          properties: {
            id: { type: "number" },
            name: { type: "string" },
            email: { type: "string" },
            createAt: { type: "string" },
            updateAt: { type: "string" },
          },
        },
      },
    },
  },
};

app.post("/register", { schema: registerSchema }, async (req, res) => {
  const { name, email, password } = req.body as any;

  const userExists = await prisma.users.findUnique({ where: { email } });
  if (userExists) {
    return res.status(400).send({ error: "Email já cadastrado." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.users.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  res.status(201).send({
    message: "Usuário cadastrado com sucesso!",
    user,
  });
});

const loginSchema = {
  body: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string" },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        message: { type: "string" },
        user: {
          type: "object",
          properties: {
            id: { type: "number" },
            name: { type: "string" },
            email: { type: "string" },
          },
        },
      },
    },
  },
};

app.post("/login", { schema: loginSchema }, async (req, res) => {
  const { email, password } = req.body as any;

  const user = await prisma.users.findUnique({ where: { email } });

  if (!user) {
    return res.status(404).send({ error: "Usuário não encontrado." });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).send({ error: "Credenciais inválidas." });
  }

  res.status(200).send({
    message: "Login realizado com sucesso!",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

app.listen({ port: 3333, host: "0.0.0.0" }, () => {
  console.log("🚀 Servidor rodando em http://localhost:3333");
});
