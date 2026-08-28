const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Department = require('../models/Department');

const seedAdminAndDepartments = async () => {
  try {
    // 1. Seed Admin
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('Admin@12345', 10);
      await User.create({
        name: 'Municipal Councillor (Admin)',
        email: 'admin@civic.com',
        password: hashedPassword,
        phone: '9876543210',
        role: 'admin',
      });
      console.log('[SEED]: Default Admin Created (admin@civic.com / Admin@12345)');
    }

    // 2. Seed Default Departments and Department User Accounts
    const defaultDepts = [
      {
        name: 'Sanitation Department',
        code: 'SAN',
        description: 'Handles waste management, garbage collection, and street cleanliness.',
        email: 'sanitation@civic.com',
      },
      {
        name: 'Roads & Infrastructure Department',
        code: 'ROAD',
        description: 'Handles pothole repairs, road resurfacing, and pavement maintenance.',
        email: 'roads@civic.com',
      },
      {
        name: 'Public Electricity Department',
        code: 'ELEC',
        description: 'Handles streetlights repair, electrical poles, and public lighting.',
        email: 'electricity@civic.com',
      },
      {
        name: 'Water Supply & Sewerage Department',
        code: 'WAT',
        description: 'Handles water pipe leaks, drainage blockages, and sewage issues.',
        email: 'water@civic.com',
      },
    ];

    for (const deptData of defaultDepts) {
      let deptUser = await User.findOne({ email: deptData.email });
      if (!deptUser) {
        const hashedPassword = await bcrypt.hash('Dept@12345', 10);
        deptUser = await User.create({
          name: `${deptData.name} Official`,
          email: deptData.email,
          password: hashedPassword,
          phone: '9876500000',
          role: 'department',
          departmentName: deptData.name,
        });
        console.log(`[SEED]: Created Dept Account (${deptData.email} / Dept@12345)`);
      }

      const deptExists = await Department.findOne({ name: deptData.name });
      if (!deptExists) {
        await Department.create({
          name: deptData.name,
          code: deptData.code,
          description: deptData.description,
          officialUser: deptUser._id,
        });
        console.log(`[SEED]: Created Department (${deptData.name})`);
      }
    }
  } catch (error) {
    console.error('[SEED ERROR]:', error.message);
  }
};

module.exports = seedAdminAndDepartments;
