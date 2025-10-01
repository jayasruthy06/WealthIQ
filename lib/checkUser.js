// lib/checkUser.js
"use server";   // <-- tells Next.js this is server-only

import { currentUser } from "@clerk/nextjs/server"; // ✅ use /server import, not /dist
import { db } from "./prisma";

export async function checkUser() {
  const user = await currentUser();
  if (!user) return null;

  try {
    const loggedInUser = await db.user.findUnique({
      where: { clerkUserId: user.id },
    });

    if (loggedInUser) return loggedInUser;

    const name = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
    return await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
}
