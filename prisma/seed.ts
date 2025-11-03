import { PrismaClient } from "@/generated/prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const interests = [
  { name: 'Photography', iconName: 'camera' },
  { name: 'Cooking', iconName: 'cooking' },
  { name: 'Video Games', iconName: 'gamepad' },
  { name: 'Music', iconName: 'music' },
  { name: 'Traveling', iconName: 'airplane' },
  { name: 'Shopping', iconName: 'shopping-bag' },
  { name: 'Speeches', iconName: 'microphone' },
  { name: 'Art & Crafts', iconName: 'palette' },
  { name: 'Swimming', iconName: 'water' },
  { name: 'Drinking', iconName: 'wine' },
  { name: 'Extreme Sports', iconName: 'mountain' },
  { name: 'Fitness', iconName: 'dumbbell' },
];

const mockUsers = [
  {
    email: 'john.doe@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: new Date('1995-06-15'),
    gender: 'MALE' as const,
    orientation: 'HETEROSEXUAL' as const,
    photos: ['/photos/mock/male-1.jpg'],
    interests: ['Photography', 'Traveling', 'Music'],
  },
  {
    email: 'mike.johnson@example.com',
    password: 'password123',
    firstName: 'Mike',
    lastName: 'Johnson',
    dateOfBirth: new Date('1992-03-22'),
    gender: 'MALE' as const,
    orientation: 'HETEROSEXUAL' as const,
    photos: ['/photos/mock/male-2.jpg'],
    interests: ['Video Games', 'Fitness', 'Cooking'],
  },
  {
    email: 'sarah.williams@example.com',
    password: 'password123',
    firstName: 'Sarah',
    lastName: 'Williams',
    dateOfBirth: new Date('1997-11-08'),
    gender: 'FEMALE' as const,
    orientation: 'HETEROSEXUAL' as const,
    photos: ['/photos/mock/female-1.jpg'],
    interests: ['Shopping', 'Art & Crafts', 'Music'],
  },
  {
    email: 'emily.davis@example.com',
    password: 'password123',
    firstName: 'Emily',
    lastName: 'Davis',
    dateOfBirth: new Date('1994-08-30'),
    gender: 'FEMALE' as const,
    orientation: 'BISEXUAL' as const,
    photos: ['/photos/mock/female-2.jpg'],
    interests: ['Swimming', 'Traveling', 'Photography'],
  },
  {
    email: 'alex.brown@example.com',
    password: 'password123',
    firstName: 'Alex',
    lastName: 'Brown',
    dateOfBirth: new Date('1996-01-12'),
    gender: 'MALE' as const,
    orientation: 'GAY' as const,
    photos: ['/photos/mock/male-1.jpg'],
    interests: ['Speeches', 'Fitness', 'Drinking'],
  },
  {
    email: 'jessica.miller@example.com',
    password: 'password123',
    firstName: 'Jessica',
    lastName: 'Miller',
    dateOfBirth: new Date('1998-05-19'),
    gender: 'FEMALE' as const,
    orientation: 'LESBIAN' as const,
    photos: ['/photos/mock/female-1.jpg'],
    interests: ['Extreme Sports', 'Music', 'Traveling'],
  },
];

async function main() {
  console.log('Start seeding...');

  // Limpar dados existentes (opcional - cuidado em produção!)
  await prisma.message.deleteMany();
  await prisma.match.deleteMany();
  await prisma.reaction.deleteMany();
  await prisma.userInterest.deleteMany();
  await prisma.photo.deleteMany();
  await prisma.session.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.interest.deleteMany();

  console.log('Deleted existing data');

  // Criar interesses
  console.log('Creating interests...');
  const createdInterests = await Promise.all(
    interests.map((interest) =>
      prisma.interest.create({
        data: interest,
      })
    )
  );
  console.log(`Created ${createdInterests.length} interests`);

  // Criar mapa de interesses por nome
  const interestMap = new Map(
    createdInterests.map((interest) => [interest.name, interest.id])
  );

  // Criar usuários
  console.log('Creating users...');
  for (const userData of mockUsers) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        dateOfBirth: userData.dateOfBirth,
        profile: {
          create: {
            gender: userData.gender,
            orientation: userData.orientation,
          },
        },
        photos: {
          create: userData.photos.map((url, index) => ({
            url,
            order: index,
            isMain: index === 0,
          })),
        },
        interests: {
          create: userData.interests.map((interestName) => ({
            interestId: interestMap.get(interestName)!,
          })),
        },
      },
    });

    console.log(`Created user: ${user.firstName} ${user.lastName}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
