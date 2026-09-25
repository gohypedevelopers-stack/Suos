import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient, OrderStatus } from "../generated/prisma/client"
import { subDays, subHours } from "date-fns"

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://suos:suosghm@2026@127.0.0.1:5433/suos"

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Seeding sample customers and orders...")

  // 1. Create sample customers
  const sampleCustomers = [
    {
      name: "Aarav Sharma",
      email: "aarav.sharma@example.com",
      emailMarketingSubscribed: true,
    },
    {
      name: "Priya Patel",
      email: "priya.patel@example.com",
      emailMarketingSubscribed: true,
    },
    {
      name: "Rohan Verma",
      email: "rohan.verma@example.com",
      emailMarketingSubscribed: false,
    },
    {
      name: "Ananya Iyer",
      email: "ananya.iyer@example.com",
      emailMarketingSubscribed: true,
    },
    {
      name: "Kabir Mehta",
      email: "kabir.mehta@example.com",
      emailMarketingSubscribed: true,
    },
  ]

  const customers = []
  for (const c of sampleCustomers) {
    const user = await prisma.user.upsert({
      where: { email: c.email },
      update: {},
      create: {
        name: c.name,
        email: c.email,
        role: "CUSTOMER",
        emailMarketingSubscribed: c.emailMarketingSubscribed,
      },
    })
    customers.push(user)
  }
  console.log(`Created/ensured ${customers.length} customers.`)

  // 2. Fetch available product variants
  const variants = await prisma.productVariant.findMany({
    include: { product: true },
    take: 10,
  })

  if (variants.length === 0) {
    console.log("No product variants found. Run 'npx tsx prisma/seed.ts' first.")
    return
  }

  // 3. Create realistic sample orders distributed over the last 30 days
  const now = new Date()

  const orderTemplates: Array<{
    customerIdx: number
    daysAgo: number
    status: OrderStatus
    items: Array<{ variantIdx: number; quantity: number }>
    address: Record<string, string>
  }> = [
    {
      customerIdx: 0,
      daysAgo: 1,
      status: "CONFIRMED",
      items: [{ variantIdx: 0, quantity: 1 }],
      address: { city: "Mumbai", state: "Maharashtra", country: "India" },
    },
    {
      customerIdx: 1,
      daysAgo: 3,
      status: "CONFIRMED",
      items: [
        { variantIdx: 1 % variants.length, quantity: 1 },
        { variantIdx: 2 % variants.length, quantity: 1 },
      ],
      address: { city: "Bengaluru", state: "Karnataka", country: "India" },
    },
    {
      customerIdx: 2,
      daysAgo: 6,
      status: "PENDING",
      items: [{ variantIdx: 3 % variants.length, quantity: 1 }],
      address: { city: "Delhi", state: "Delhi", country: "India" },
    },
    {
      customerIdx: 3,
      daysAgo: 10,
      status: "FULFILLED",
      items: [
        { variantIdx: 0, quantity: 2 },
        { variantIdx: 4 % variants.length, quantity: 1 },
      ],
      address: { city: "Hyderabad", state: "Telangana", country: "India" },
    },
    {
      customerIdx: 4,
      daysAgo: 15,
      status: "FULFILLED",
      items: [{ variantIdx: 1 % variants.length, quantity: 1 }],
      address: { city: "Jaipur", state: "Rajasthan", country: "India" },
    },
    {
      customerIdx: 0,
      daysAgo: 22,
      status: "FULFILLED",
      items: [{ variantIdx: 2 % variants.length, quantity: 1 }],
      address: { city: "Mumbai", state: "Maharashtra", country: "India" },
    },
    {
      customerIdx: 1,
      daysAgo: 27,
      status: "FULFILLED",
      items: [{ variantIdx: 3 % variants.length, quantity: 2 }],
      address: { city: "Bengaluru", state: "Karnataka", country: "India" },
    },
  ]

  let createdOrders = 0
  for (const template of orderTemplates) {
    const customer = customers[template.customerIdx]
    const orderDate = subHours(subDays(now, template.daysAgo), 3)

    const lineItems = template.items.map((item) => {
      const v = variants[item.variantIdx]
      const price = Number(v.price)
      return {
        variantId: v.id,
        title: v.title === "Default" ? v.product.title : `${v.product.title} - ${v.title}`,
        sku: v.sku,
        quantity: item.quantity,
        unitPrice: v.price,
        total: price * item.quantity,
      }
    })

    const subtotal = lineItems.reduce((acc, curr) => acc + Number(curr.total), 0)

    await prisma.order.create({
      data: {
        userId: customer.id,
        email: customer.email,
        status: template.status,
        currency: "INR",
        subtotal,
        discount: 0,
        shipping: 0,
        total: subtotal,
        shippingAddress: template.address,
        createdAt: orderDate,
        updatedAt: orderDate,
        items: {
          create: lineItems.map((li) => ({
            variantId: li.variantId,
            title: li.title,
            sku: li.sku,
            quantity: li.quantity,
            unitPrice: li.unitPrice,
            total: li.total,
          })),
        },
      },
    })
    createdOrders++
  }

  console.log(`Successfully created ${createdOrders} orders!`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
