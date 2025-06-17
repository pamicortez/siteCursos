ALTER TABLE "Usuario"
ADD COLUMN "resetToken" TEXT;

ALTER TABLE "Usuario"
ADD COLUMN "resetTokenExpires" TIMESTAMP(3);