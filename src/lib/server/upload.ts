import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "photos");

export async function ensureUploadDir() {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
}

export async function calculateMD5(buffer: Buffer): Promise<string> {
  return crypto.createHash("md5").update(buffer).digest("hex");
}

export async function savePhoto(file: File, userId: string): Promise<string> {
  const userUploadDir = path.join(process.cwd(), "public", "photos", userId);

  // Criar diretório do usuário se não existir
  try {
    await fs.access(userUploadDir);
  } catch {
    await fs.mkdir(userUploadDir, { recursive: true });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const md5Hash = await calculateMD5(buffer);
  const filename = `${md5Hash}.png`;
  const filepath = path.join(userUploadDir, filename);

  // Verificar se arquivo já existe (evita duplicatas)
  try {
    await fs.access(filepath);
  } catch {
    // Arquivo não existe, salvar
    await fs.writeFile(filepath, buffer);
  }

  return `/photos/${userId}/${filename}`;
}

export async function deletePhoto(url: string): Promise<void> {
  if (!url.startsWith("/photos/")) {
    return;
  }
  
  const filepath = path.join(process.cwd(), "public", url);

  try {
    await fs.unlink(filepath);
  } catch (error) {
    console.error("Error deleting photo:", error);
  }
}

export async function deleteUserPhotos(userId: string): Promise<void> {
  const userUploadDir = path.join(process.cwd(), "public", "photos", userId);

  try {
    await fs.rm(userUploadDir, { recursive: true, force: true });
  } catch (error) {
    console.error("Error deleting user photos:", error);
  }
}
