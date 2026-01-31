import { sequelize } from "../../config/mysql";

export async function fetchProducts(params: any) {
  const {
    cursor,
    limit = 20,
    sort = "id",
    order = "ASC",
    search,
    category,
    minPrice,
    maxPrice,
  } = params;

  const where: string[] = [];
  const values: any[] = [];

  if (cursor) {
    where.push("id > ?");
    values.push(cursor);
  }

  if (category) {
    where.push("category = ?");
    values.push(category);
  }

  if (minPrice) {
    where.push("price >= ?");
    values.push(minPrice);
  }

  if (maxPrice) {
    where.push("price <= ?");
    values.push(maxPrice);
  }

  if (search) {
    where.push("MATCH(name, description) AGAINST(?)");
    values.push(search);
  }

  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const query = `
    SELECT * FROM products
    ${whereClause}
    ORDER BY ${sort} ${order}
    LIMIT ?
  `;

  values.push(Number(limit));

  const [rows] = await sequelize.query(query, { replacements: values });
  return rows;
}
