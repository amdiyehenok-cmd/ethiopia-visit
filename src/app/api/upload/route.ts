import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const cloudName   = process.env.CLOUDINARY_CLOUD_NAME ?? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET ?? "ethiopia_ugc"; // unsigned preset

  // Check if Cloudinary is configured for signed uploads
  const apiKey    = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName) {
    return NextResponse.json(
      { error: "Cloudinary not configured. Set CLOUDINARY_CLOUD_NAME env var." },
      { status: 503 },
    );
  }

  try {
    // Accept multipart/form-data (from PhotoUploadWidget)
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file in request" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    let uploadUrl: string;
    let body: Record<string, string>;

    if (apiKey && apiSecret) {
      // Signed upload via server
      const { v2: cloudinary } = await import("cloudinary");
      cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });

      const result = await cloudinary.uploader.upload(dataUri, {
        folder: "ethiopia-visit/ugc",
        transformation: [
          { width: 1200, height: 900, crop: "limit", quality: "auto:good", fetch_format: "auto" },
        ],
      });

      return NextResponse.json({
        url: result.secure_url,
        id: result.public_id,
        width: result.width,
        height: result.height,
      });
    } else {
      // Unsigned upload (requires creating an unsigned upload preset in Cloudinary dashboard)
      uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      body = {
        file: dataUri,
        upload_preset: uploadPreset,
        folder: "ethiopia-visit/ugc",
      };

      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("[Upload] Cloudinary error:", err);
        throw new Error(err.error?.message ?? "Upload failed");
      }

      const data = await res.json();
      return NextResponse.json({ url: data.secure_url, id: data.public_id });
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Upload failed";
    console.error("[Upload route error]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
