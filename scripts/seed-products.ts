import { sequelize } from "../src/config/mysql";

async function seed(limit = 10000, batchSize = 5000) {
  let inserted = 0;

  while (inserted < limit) {
    const values: any[] = [];

    for (let i = 0; i < batchSize && inserted < limit; i++) {
      const id = inserted + 1;
      values.push([
        `Product ${id}`,
        `Description ${id}`,
        id % 3 === 0 ? "milk" : id % 3 === 1 ? "vegetables" : "fruits",
        Math.floor(Math.random() * 100) + 10,
      ]);
      inserted++;
    }

    await sequelize.query(
      "INSERT INTO products (name, description, category, price) VALUES ?",
      { replacements: [values] }
    );

    console.log(`✅ Inserted ${inserted}/${limit}`);
  }

  console.log("🎉 Seeding completed");
  process.exit(0);
}

seed(1000000).catch(err => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
