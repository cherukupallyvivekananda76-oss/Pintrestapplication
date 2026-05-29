import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { niche, productUrl, platform, pinId, productName } = body;

    if (!niche || !productUrl || !platform || !productName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Fetch user settings to get their specific tags
    const settings = await prisma.userSettings.findUnique({
      where: { userId },
    });

    let affiliateUrl = productUrl;

    try {
      const url = new URL(productUrl);

      if (platform.toLowerCase() === 'amazon') {
        const tag = settings?.affiliateTag || process.env.AMAZON_AFFILIATE_TAG;
        if (tag) {
          url.searchParams.set('tag', tag);
        }
      } else {
        const tag = settings?.genericAffiliateTag || process.env.AFFILIATE_TAG;
        if (tag) {
          // Standard generic parameters
          if (platform.toLowerCase() === 'clickbank') {
            url.searchParams.set('aff', tag);
          } else {
            url.searchParams.set('ref', tag);
          }
        }
      }

      affiliateUrl = url.toString();
    } catch (e) {
      // If URL parsing fails, we fallback to naive string appending
      console.warn("URL parsing failed for:", productUrl);
    }

    const affiliateLink = await prisma.affiliateLink.create({
      data: {
        userId,
        pinId: pinId || null,
        productName,
        productUrl,
        affiliateUrl,
        platform,
        niche,
      },
    });

    return NextResponse.json(affiliateLink, { status: 201 });

  } catch (error: any) {
    console.error('Affiliate Generation Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
