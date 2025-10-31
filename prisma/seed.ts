import { Gender, Interest, PrismaClient } from '@/generated/prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Seed Interests
  const interests = [
    'Photography',
    'Cooking',
    'Video Games',
    'Music',
    'Traveling',
    'Shopping',
    'Speeches',
    'Art & Crafts',
    'Swimming',
    'Drinking',
    'Extreme Sports',
    'Fitness',
  ];

  const createdInterests: Interest[] = [];
  for (const interestName of interests) {
    const interest = await prisma.interest.upsert({
      where: { name: interestName },
      update: {},
      create: { name: interestName },
    });
    createdInterests.push(interest);
    console.log(`✓ Interest "${interestName}" created/verified`);
  }

  // Seed Users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const maleNames = [
    { firstName: 'John', lastName: 'Doe' },
    { firstName: 'Michael', lastName: 'Smith' },
    { firstName: 'David', lastName: 'Johnson' },
    { firstName: 'James', lastName: 'Brown' },
    { firstName: 'Robert', lastName: 'Williams' },
  ];

  const femaleNames = [
    { firstName: 'Emma', lastName: 'Wilson' },
    { firstName: 'Olivia', lastName: 'Taylor' },
    { firstName: 'Sophia', lastName: 'Anderson' },
    { firstName: 'Isabella', lastName: 'Thomas' },
    { firstName: 'Mia', lastName: 'Moore' },
  ];

  const otherNames = [
    { firstName: 'Alex', lastName: 'Martinez' },
    { firstName: 'Jordan', lastName: 'Garcia' },
    { firstName: 'Taylor', lastName: 'Rodriguez' },
    { firstName: 'Casey', lastName: 'Davis' },
    { firstName: 'Riley', lastName: 'Miller' },
  ];

  const genders: Gender[] = ['MALE', 'FEMALE', 'OTHER'];
  const getRandomGender = () => genders[Math.floor(Math.random() * genders.length)];
  const getRandomInterests = (count: number) => {
    const shuffled = [...createdInterests].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };
  const getRandomDate = () => {
    const start = new Date(1980, 0, 1);
    const end = new Date(2003, 11, 31);
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  };

  // Create Male Users
  for (let i = 0; i < maleNames.length; i++) {
    const user = await prisma.user.create({
      data: {
        email: `${maleNames[i].firstName.toLowerCase()}.${maleNames[i].lastName.toLowerCase()}@example.com`,
        password: hashedPassword,
        firstName: maleNames[i].firstName,
        lastName: maleNames[i].lastName,
        dateOfBirth: getRandomDate(),
        profile: {
          create: {
            gender: 'MALE',
            preference: getRandomGender(),
          },
        },
        interests: {
          create: getRandomInterests(3 + Math.floor(Math.random() * 4)).map((interest) => ({
            interestId: interest.id,
          })),
        },
      },
    });
    console.log(`✓ Male user "${user.firstName} ${user.lastName}" created`);
  }

  // Create Female Users
  for (let i = 0; i < femaleNames.length; i++) {
    const user = await prisma.user.create({
      data: {
        email: `${femaleNames[i].firstName.toLowerCase()}.${femaleNames[i].lastName.toLowerCase()}@example.com`,
        password: hashedPassword,
        firstName: femaleNames[i].firstName,
        lastName: femaleNames[i].lastName,
        dateOfBirth: getRandomDate(),
        profile: {
          create: {
            gender: 'FEMALE',
            preference: getRandomGender(),
          },
        },
        interests: {
          create: getRandomInterests(3 + Math.floor(Math.random() * 4)).map((interest) => ({
            interestId: interest.id,
          })),
        },
      },
    });
    console.log(`✓ Female user "${user.firstName} ${user.lastName}" created`);
  }

  // Create Other Gender Users
  for (let i = 0; i < otherNames.length; i++) {
    const user = await prisma.user.create({
      data: {
        email: `${otherNames[i].firstName.toLowerCase()}.${otherNames[i].lastName.toLowerCase()}@example.com`,
        password: hashedPassword,
        firstName: otherNames[i].firstName,
        lastName: otherNames[i].lastName,
        dateOfBirth: getRandomDate(),
        profile: {
          create: {
            gender: 'OTHER',
            preference: getRandomGender(),
          },
        },
        interests: {
          create: getRandomInterests(3 + Math.floor(Math.random() * 4)).map((interest) => ({
            interestId: interest.id,
          })),
        },
      },
    });
    console.log(`✓ Other gender user "${user.firstName} ${user.lastName}" created`);
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
