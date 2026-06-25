import { PrismaClient } from "@prisma/client";
import { DISEASES } from "../src/data/diseases";
import * as crypto from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function main() {
  console.log("Starting database seed...");

  // 1. Clear database
  console.log("Clearing existing database records...");
  await prisma.diseaseSymptom.deleteMany({});
  await prisma.symptom.deleteMany({});
  await prisma.disease.deleteMany({});
  await prisma.chatHistory.deleteMany({});
  await prisma.prediction.deleteMany({});
  await prisma.log.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Create admin user
  const adminEmail = "admin@dermarare.ai";
  const adminPassword = "adminpassword123";
  const hashedPassword = hashPassword(adminPassword);
  
  await prisma.user.create({
    data: {
      email: adminEmail,
      name: "DermaRare Admin",
      passwordHash: hashedPassword,
      role: "admin",
    },
  });
  console.log(`Created default admin account: ${adminEmail} / ${adminPassword}`);

  // 3. Keep track of created symptoms
  const symptomCache = new Map<string, string>(); // symptom name -> symptom ID

  // 4. Insert diseases and symptoms
  console.log(`Seeding ${DISEASES.length} diseases...`);
  for (const seed of DISEASES) {
    // Create the disease
    const disease = await prisma.disease.create({
      data: {
        name: seed.name,
        description: seed.description,
        causes: seed.causes,
        diagnosis: seed.diagnosis,
        treatment: seed.treatment,
        riskFactors: seed.riskFactors,
        severityLevel: seed.severityLevel,
      },
    });

    console.log(`Created disease: ${disease.name}`);

    // Process symptoms for this disease
    for (const symInfo of seed.symptoms) {
      let symptomId = symptomCache.get(symInfo.name);

      if (!symptomId) {
        // Create the symptom if it doesn't exist yet
        const symptom = await prisma.symptom.upsert({
          where: { name: symInfo.name },
          update: {},
          create: {
            name: symInfo.name,
            category: symInfo.category,
          },
        });
        symptomId = symptom.id;
        symptomCache.set(symInfo.name, symptomId);
      }

      // Link disease and symptom with frequency weight
      await prisma.diseaseSymptom.create({
        data: {
          diseaseId: disease.id,
          symptomId: symptomId,
          frequencyWeight: symInfo.weight,
        },
      });
    }
  }

  // Create a log entry
  await prisma.log.create({
    data: {
      action: "Database Seeding",
      details: `Successfully seeded database with 1 admin user, ${DISEASES.length} diseases, and ${symptomCache.size} unique symptoms.`,
    },
  });

  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
