"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateSettings(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const affiliateTag = formData.get("affiliateTag") as string;
  const defaultNiche = formData.get("defaultNiche") as string;
  const defaultPinCount = parseInt(formData.get("defaultPinCount") as string) || 5;

  // Validation for Amazon Affiliate Tag
  // It usually ends in -20 (US) or -21 (UK) etc.
  if (affiliateTag && !/^[a-zA-Z0-9]+-\d{2}$/.test(affiliateTag)) {
    throw new Error("Invalid Amazon Affiliate Tag format. It should look like 'yourname-20'.");
  }

  await prisma.userSettings.upsert({
    where: { userId: session.user.id },
    update: {
      affiliateTag: affiliateTag || null,
      defaultNiche: defaultNiche || null,
      defaultPinCount,
    },
    create: {
      userId: session.user.id,
      affiliateTag: affiliateTag || null,
      defaultNiche: defaultNiche || null,
      defaultPinCount,
    }
  });

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return { success: true };
}
