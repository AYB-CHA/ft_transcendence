import { PrismaClient } from '@prisma/client';
import UserFactory from '../factories/UserFactory';
import ChannelFactory from '../factories/ChannelFactory';

const prisma = new PrismaClient();

async function seedAchievements() {
  try {
    const achievementsData = [
      {
        name: 'New player',
        description: 'Play your first match',
        icon: 'Play first match.png',
        maxProgress: 1,
      },
      {
        name: 'I am a player 1',
        description: 'Score 7 goals in a match',
        icon: 'Score 7-0.png',
        maxProgress: 7,
      },
      {
        name: 'I am a player 2',
        description: 'Play 20 matchs',
        icon: 'Play 20 matchs.png',
        maxProgress: 20,
      },
      {
        name: 'I am a winner',
        description: 'Win 20 matchs',
        icon: 'Win 20 matchs.png',
        maxProgress: 20,
      },
    ];
    for (const achievement of achievementsData) {
      await prisma.achievement.upsert({
        create: achievement,
        update: {
          description: achievement.description,
          icon: achievement.icon,
          maxProgress: achievement.maxProgress,
        },
        where: {
          name: achievement.name,
        },
      });
    }
  } catch (error) {
    console.log('error seeding achievements', error);
  }
}

async function main() {
  const promises: Promise<unknown>[] = [];
  // achievements
  promises.push(seedAchievements());
  // users
  const userFactory = new UserFactory();
  promises.push(prisma.user.createMany({ data: userFactory.generateMany(20) }));

  // channels
  const channelFactory = new ChannelFactory();
  promises.push(
    prisma.channel.createMany({ data: channelFactory.generateMany(10) }),
  );

  // push all records to the database
  await Promise.all(promises);
  promises.length = 0;

  // friendship
  const friendshipUserIds = userFactory.pickRandomN(16);
  const firstHalfOfUserIDs = friendshipUserIds.slice(
    0,
    friendshipUserIds.length / 2,
  );

  const secondHalfOfUserIDs = friendshipUserIds.slice(
    friendshipUserIds.length / 2,
    friendshipUserIds.length,
  );

  firstHalfOfUserIDs.forEach((topEl) => {
    secondHalfOfUserIDs.forEach((el) => {
      const promise = prisma.friendship.create({
        data: {
          isPending: Math.random() < 0.5,
          receiverId: topEl,
          senderId: el,
        },
      });
      promises.push(promise);
    });
  });

  // channel Members
  const channels = channelFactory.IDs;
  type UserRole = 'MEMBER' | 'ADMINISTRATOR' | 'MODERATOR';
  const roles: UserRole[] = ['MEMBER', 'ADMINISTRATOR', 'MODERATOR'];

  channels.forEach((channel) => {
    const channelMembers = userFactory.pickRandomN(10);
    channelMembers.forEach((member) => {
      const promise = prisma.channelsOnUsers.create({
        data: {
          role: roles.at(Math.ceil(Math.random() * 3)),
          userId: member,
          channelId: channel,
        },
      });
      promises.push(promise);
    });
  });
  return await Promise.all(promises);
}

main()
  .then((/* data */) => {
    // console.log('resolved', data);
  })
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

console.log('GETTING OUT');
