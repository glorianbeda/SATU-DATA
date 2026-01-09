/**
 * Full migration script for Task Sharing feature
 * This handles existing data by:
 * 1. Creating TaskList table
 * 2. Creating TaskListMember table
 * 3. Creating default TaskList for each user
 * 4. Adding taskListId column to Task with default
 * 5. Migrating existing tasks to their owner's TaskList
 * 6. Adding assigneeId column
 */
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function migrate() {
  console.log("=== Task Sharing Migration ===\n");

  // Step 1: Create TaskList table if not exists
  console.log("Step 1: Creating TaskList table...");
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS TaskList (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      ownerId INT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (ownerId) REFERENCES User(id) ON DELETE CASCADE
    )
  `);
  console.log("✓ TaskList table created\n");

  // Step 2: Create TaskListMember table if not exists
  console.log("Step 2: Creating TaskListMember table...");
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS TaskListMember (
      id INT AUTO_INCREMENT PRIMARY KEY,
      taskListId INT NOT NULL,
      userId INT NOT NULL,
      permission VARCHAR(50) DEFAULT 'EDITOR',
      invitedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (taskListId) REFERENCES TaskList(id) ON DELETE CASCADE,
      FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
      UNIQUE KEY unique_member (taskListId, userId)
    )
  `);
  console.log("✓ TaskListMember table created\n");

  // Step 3: Create default TaskList for each user who doesn't have one
  console.log("Step 3: Creating default TaskLists for users...");
  const users = await prisma.user.findMany({
    select: { id: true, name: true },
  });

  for (const user of users) {
    const existing = await prisma.$queryRawUnsafe(
      `SELECT id FROM TaskList WHERE ownerId = ? LIMIT 1`,
      user.id
    );

    if (existing.length === 0) {
      await prisma.$executeRawUnsafe(
        `INSERT INTO TaskList (name, description, ownerId) VALUES (?, ?, ?)`,
        "Personal",
        "Default personal task list",
        user.id
      );
      console.log(`  ✓ Created "Personal" TaskList for ${user.name}`);
    }
  }
  console.log("");

  // Step 4: Add taskListId column to Task if not exists
  console.log("Step 4: Checking taskListId column...");
  try {
    const columns = await prisma.$queryRawUnsafe(
      `SHOW COLUMNS FROM Task LIKE 'taskListId'`
    );

    if (columns.length === 0) {
      // Add column with a default of 1 (will update next)
      await prisma.$executeRawUnsafe(
        `ALTER TABLE Task ADD COLUMN taskListId INT`
      );
      console.log("✓ Added taskListId column\n");

      // Step 5: Migrate existing tasks to their owner's TaskList
      console.log("Step 5: Migrating existing tasks...");

      // Get all tasks with their userId
      const tasks = await prisma.$queryRawUnsafe(
        `SELECT t.id, t.userId FROM Task t WHERE t.taskListId IS NULL`
      );

      for (const task of tasks) {
        // Find user's default TaskList
        const taskList = await prisma.$queryRawUnsafe(
          `SELECT id FROM TaskList WHERE ownerId = ? LIMIT 1`,
          task.userId
        );

        if (taskList.length > 0) {
          await prisma.$executeRawUnsafe(
            `UPDATE Task SET taskListId = ? WHERE id = ?`,
            taskList[0].id,
            task.id
          );
        }
      }
      console.log(`  ✓ Migrated ${tasks.length} tasks\n`);

      // Make taskListId NOT NULL and add foreign key
      await prisma.$executeRawUnsafe(
        `ALTER TABLE Task MODIFY taskListId INT NOT NULL`
      );
      await prisma.$executeRawUnsafe(
        `ALTER TABLE Task ADD FOREIGN KEY (taskListId) REFERENCES TaskList(id) ON DELETE CASCADE`
      );
    } else {
      console.log("✓ taskListId column already exists\n");
    }
  } catch (err) {
    console.log("Note: taskListId migration skipped or already done\n");
  }

  // Step 6: Add assigneeId column if not exists
  console.log("Step 6: Checking assigneeId column...");
  try {
    const columns = await prisma.$queryRawUnsafe(
      `SHOW COLUMNS FROM Task LIKE 'assigneeId'`
    );

    if (columns.length === 0) {
      await prisma.$executeRawUnsafe(
        `ALTER TABLE Task ADD COLUMN assigneeId INT`
      );
      await prisma.$executeRawUnsafe(
        `ALTER TABLE Task ADD FOREIGN KEY (assigneeId) REFERENCES User(id)`
      );
      console.log("✓ Added assigneeId column\n");
    } else {
      console.log("✓ assigneeId column already exists\n");
    }
  } catch (err) {
    console.log("Note: assigneeId already exists\n");
  }

  // Step 7: Drop old userId column from Task if migration is complete
  console.log("Step 7: Cleaning up old userId column...");
  try {
    const columns = await prisma.$queryRawUnsafe(
      `SHOW COLUMNS FROM Task LIKE 'userId'`
    );

    if (columns.length > 0) {
      // First drop the foreign key constraint
      const fks = await prisma.$queryRawUnsafe(`
        SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE 
        WHERE TABLE_NAME = 'Task' AND COLUMN_NAME = 'userId' AND REFERENCED_TABLE_NAME IS NOT NULL
      `);

      for (const fk of fks) {
        await prisma.$executeRawUnsafe(
          `ALTER TABLE Task DROP FOREIGN KEY ${fk.CONSTRAINT_NAME}`
        );
      }

      await prisma.$executeRawUnsafe(`ALTER TABLE Task DROP COLUMN userId`);
      console.log("✓ Removed old userId column\n");
    }
  } catch (err) {
    console.log("Note: userId column cleanup skipped\n");
  }

  console.log("=== Migration Complete! ===");
}

migrate()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
