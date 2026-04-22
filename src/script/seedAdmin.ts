import bcrypt from "bcryptjs"
import { prisma } from "../lib/prisma.js";
import { Role, Status } from "../../generated/prisma/enums.js";

const seedAdmin = async () => {
  try {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD as string, 10);

  const adminData = {
    name: process.env.ADMIN_NAME as string,
    email: process.env.ADMIN_EMAIL as string,
    password: hashedPassword,
    role: Role.ADMIN,
    status: Status.ACTIVE,
  };


  const isExist = await prisma.user.findUnique({
    where: {
      email: adminData.email
    }
  })

  if (isExist) {
    console.log("Admin already exist ⚠️");
    return
  }

  await prisma.user.create({
    data: adminData
  })

  console.log("Admin created successfully ✔️");
  } catch (error) {
    console.log(error)
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();