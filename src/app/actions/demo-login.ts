"use server";

import { clerkClient } from "@clerk/nextjs/server";

export async function getDemoLoginUrl(email: string) {
  try {
    const client = await clerkClient();
    const users = await client.users.getUserList({ emailAddress: [email] });
    
    const firstUser = users.data?.[0];
    if (!firstUser) {
      throw new Error(`Demo user ${email} not found. Please run the setup scripts.`);
    }
    
    const userId = firstUser.id;
    
    // Create a fresh, single-use sign-in token valid for 20 minutes
    // By minting it on-demand, we avoid the "Token already used" error entirely!
    const token = await client.signInTokens.createSignInToken({
      userId,
      expiresInSeconds: 60 * 20, 
    });
    
    return token.url;
  } catch (error) {
    console.error("Error generating demo token:", error);
    throw new Error("Failed to generate demo login link");
  }
}
