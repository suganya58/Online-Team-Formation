const bcrypt = require("bcryptjs");
const User = require("./models/User");

/**
 * Seeder to auto-create or update development Admin account (suganya@gmail.com / 123456) in MongoDB
 */
async function seedDefaultAdmin() {
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || "suganya@gmail.com").trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || "123456";

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const existingUser = await User.findOne({ email: adminEmail });

    if (existingUser) {
      // Ensure user has role = "admin" and password = "123456"
      let updated = false;
      if (existingUser.role !== "admin") {
        existingUser.role = "admin";
        updated = true;
      }

      // Ensure password is updated to 123456
      const passMatch = await bcrypt.compare(adminPassword, existingUser.password);
      if (!passMatch) {
        existingUser.password = hashedPassword;
        updated = true;
      }

      if (updated) {
        await existingUser.save();
        console.log(`[SEED] Updated existing account (${adminEmail}) to role = "admin".`);
      } else {
        console.log(`[SEED] Admin account (${adminEmail}) verified in MongoDB.`);
      }
    } else {
      await User.create({
        fullName: "Suganya (Admin)",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        college: "HackMate Operations",
        department: "Administration",
        year: "Faculty",
        skills: ["System Administration", "Platform Management"],
        github: "",
        linkedin: "",
        about: "Default HackMate platform administrator.",
      });

      console.log(`[SEED] Admin Account Initialized -> Email: ${adminEmail}`);
    }
  } catch (error) {
    console.error("[SEED ERROR] Failed to seed admin:", error.message);
  }
}

module.exports = seedDefaultAdmin;
