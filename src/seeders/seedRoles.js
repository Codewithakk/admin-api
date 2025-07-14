const faker = require('@faker-js/faker').faker;
const Role = require('../models/Role');
const Permission = require('../models/Permission');

async function seedRoles() {
    const permissions = await Permission.find();
    const permissionIds = permissions.map(p => p._id);

    const roles = Array.from({ length: 5 }).map(() => ({
        name: faker.lorem.word(),
        description: faker.lorem.sentence(),
        permissions: faker.helpers.arrayElements(permissionIds, 2),
    }));

    await Role.insertMany(roles);
}
