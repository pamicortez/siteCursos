const bcrypt = require('bcryptjs');  // Usando require para importar o bcryptjs
import prisma from "../lib/prismaClient";

async function main() {
  const usuarios = await prisma.usuario.findMany();

  for (const user of usuarios) {
    if (!user.senha.startsWith("$2")) { // Evita recriptografar senhas já criptografadas
      const hash = bcrypt.hashSync(user.senha, 10);  // Usando bcrypt para gerar hash da senha
      await prisma.usuario.update({
        where: { id: user.id },
        data: { senha: hash },
      });
      console.log(`Senha criptografada para ${user.email}`);
    }
  }
}

main();
