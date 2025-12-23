import { PrismaClient } from "@prisma/client"
import * as fs from "fs"
import * as path from "path"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting seed...")

  // Read seed data
  const seedDataPath = path.join(__dirname, "seed-data.json")
  const seedData = JSON.parse(fs.readFileSync(seedDataPath, "utf-8"))

  // Clear existing data
  console.log("🧹 Clearing existing data...")
  await prisma.review.deleteMany()
  await prisma.product.deleteMany()
  await prisma.customer.deleteMany()

  // Seed products
  console.log("📦 Seeding products...")
  const createdProducts = []
  for (const product of seedData.products) {
    const created = await prisma.product.create({
      data: product,
    })
    createdProducts.push(created)
    console.log(`  ✓ Created product: ${product.name} ${product.version}`)
  }

  // Seed reviews (link to products)
  console.log("⭐ Seeding reviews...")
  for (let i = 0; i < seedData.reviews.length; i++) {
    const review = seedData.reviews[i]
    const product = createdProducts[i % createdProducts.length]
    await prisma.review.create({
      data: {
        ...review,
        productId: product.id,
      },
    })
    console.log(`  ✓ Created review by ${review.name} for ${product.name}`)
  }

  // Seed customers
  console.log("👥 Seeding customers...")
  for (const customer of seedData.customers) {
    await prisma.customer.create({
      data: {
        ...customer,
        birth: new Date(customer.birth),
      },
    })
    console.log(`  ✓ Created customer: ${customer.name}`)
  }

  console.log("✅ Seed completed successfully!")
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
