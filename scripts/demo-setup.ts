import "dotenv/config";
import { clerkClient } from "@clerk/nextjs/server";
import { db } from "../src/server/db";

async function main() {
  const client = await clerkClient();
  const demoAccounts = [
    { email: "manu@aceternity.com", firstName: "Manu", lastName: "Paji", orgName: "Aceternity Inc" },
    { email: "dev@corsair.com", firstName: "Dev", lastName: "Jain", orgName: "Corsair Devs" }
  ];

  for (const account of demoAccounts) {
    let users = await client.users.getUserList({ emailAddress: [account.email] });
    let user = users.data?.[0];
    if (!user) {
      console.log(`Creating user ${account.email}...`);
      user = await client.users.createUser({
        emailAddress: [account.email],
        firstName: account.firstName,
        lastName: account.lastName,
        skipPasswordChecks: true,
        skipPasswordRequirement: true,
      });
    } else {
      console.log(`User ${account.email} already exists (${user.id}).`);
    }

    console.log(`Creating DB records for ${user.id}...`);
    // Upsert User
    await db.user.upsert({
      where: { id: user.id },
      create: { id: user.id },
      update: {},
    });

    // Create Organization if they don't have one
    const orgs = await client.users.getOrganizationMembershipList({ userId: user.id });
    let org = orgs.data?.[0]?.organization;
    if (!org) {
      console.log(`Creating organization ${account.orgName}...`);
      org = await client.organizations.createOrganization({
        name: account.orgName,
        createdBy: user.id,
      });
    }

    // Give max subscriptions (Enterprise) to both User and Org
    for (const owner of [
      { type: "user", id: user.id },
      { type: "org", id: org.id },
    ]) {
      const customer = await db.billingCustomer.upsert({
        where: { ownerType_ownerId: { ownerType: owner.type, ownerId: owner.id } },
        create: { ownerType: owner.type, ownerId: owner.id, dodoCustomerId: `demo_${owner.id}` },
        update: {},
      });

      await db.subscription.upsert({
        where: { id: `demo_sub_${owner.id}` },
        create: {
          id: `demo_sub_${owner.id}`,
          billingCustomerId: customer.id,
          status: "active",
          plan: "enterprise",
          dodoSubscriptionId: `demo_dodo_sub_${owner.id}`
        },
        update: {
          plan: "enterprise",
          status: "active",
          dodoSubscriptionId: `demo_dodo_sub_${owner.id}`
        },
      });
      console.log(`Granted Enterprise plan to ${owner.type} ${owner.id}`);
    }
  }

  console.log("Setup complete!");
}

main().catch(console.error).finally(() => db.$disconnect());
