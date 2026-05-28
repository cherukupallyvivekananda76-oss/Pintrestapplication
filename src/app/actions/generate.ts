"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getProductProvider } from "@/services/product-provider";
import { getAIGenerator } from "@/services/ai";
import { buildAffiliateLink } from "@/utils/affiliate";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function isValidUrl(urlString: string) {
  try {
    new URL(urlString);
    return true;
  } catch (err) {
    return false;
  }
}

export async function generateContent(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Check required environment variables
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Configuration Error: GEMINI_API_KEY is missing. AI generation requires this key.");
  }

  // Load the authenticated user's settings to get their specific affiliate tag
  const settings = await prisma.userSettings.findUnique({
    where: { userId: session.user.id }
  });

  const affiliateTag = settings?.affiliateTag;

  if (!affiliateTag) {
    throw new Error("You must save your Amazon Affiliate Tag in Settings before generating content.");
  }

  const niche = formData.get("niche") as string;
  const pinCount = parseInt(formData.get("pinCount") as string);
  const audience = formData.get("audience") as string;
  const tone = formData.get("tone") as string;

  if (!niche || !pinCount) {
    throw new Error("Missing required fields");
  }

  // Create Job associated with the specific user
  const job = await prisma.generationJob.create({
    data: {
      userId: session.user.id,
      niche,
      pinCount,
      audience: audience || null,
      tone: tone || null,
      status: "processing"
    }
  });

  try {
    // 1. Fetch Products
    const productProvider = getProductProvider();
    const products = await productProvider.searchProducts(niche, pinCount);

    if (!products || products.length === 0) {
      throw new Error(`Failed to find real products for niche: ${niche}`);
    }

    // 2. Generate AI Content & Save Products
    const aiGenerator = getAIGenerator();

    let validProductsSaved = 0;

    for (const product of products) {
      // Defensive validation for image and URL
      if (!product.url || !isValidUrl(product.url)) {
        console.warn(`[Generation Action] Skipping product due to invalid URL: ${product.url}`);
        continue;
      }

      if (!product.imageUrl || !isValidUrl(product.imageUrl) || product.imageUrl.includes('picsum.photos')) {
         console.warn(`[Generation Action] Skipping product due to invalid or placeholder image: ${product.imageUrl}`);
         continue;
      }

      // Use ONLY the authenticated user's tracking ID
      const affiliateUrl = buildAffiliateLink(product.url, affiliateTag);

      const pinContent = await aiGenerator.generatePinContent(
        product,
        audience,
        tone
      );

      await prisma.generatedProduct.create({
        data: {
          jobId: job.id,
          productId: product.id,
          productTitle: product.title,
          productUrl: product.url,
          affiliateUrl,
          imageUrl: product.imageUrl,
          price: product.price,
          featuresJson: JSON.stringify(product.features),
          generatedPinTitle: pinContent.title,
          generatedDescription: pinContent.description,
          keywordsJson: JSON.stringify(pinContent.keywords)
        }
      });
      validProductsSaved++;
    }

    if (validProductsSaved === 0) {
        throw new Error("Failed to process and save any valid products.");
    }

    // Mark complete
    await prisma.generationJob.update({
      where: { id: job.id },
      data: { status: "completed" }
    });

  } catch (error: any) {
    console.error(`[Generation Action] Job ${job.id} failed:`, error);

    const isTransientError = error?.message?.includes('high demand');
    const finalStatus = isTransientError ? 'failed_temp' : 'failed';

    await prisma.generationJob.update({
      where: { id: job.id },
      data: { status: finalStatus }
    });

    // Pass the clean UI-friendly message back to the frontend form
    throw new Error(error.message || "An unexpected error occurred during generation.");
  }

  revalidatePath("/dashboard");
  revalidatePath("/history");
  redirect(`/history/${job.id}`);
}
