import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createSupabaseAdminClient } from "@/src/lib/supabase/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MEDIA_BUCKET = "dearly-media";
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

async function isAdminSession() {
  const cookieStore = await cookies();
  return cookieStore.get("dearly_admin")?.value === "true";
}

function getFileExtension(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension && ["jpg", "jpeg", "png", "webp"].includes(extension)) {
    return extension;
  }

  return file.type.split("/")[1] || "jpg";
}

async function ensureMediaBucket() {
  const supabase = createSupabaseAdminClient();
  const { data: buckets, error } = await supabase.storage.listBuckets();

  if (error) {
    throw new Error(error.message);
  }

  const bucketExists = buckets.some((bucket) => bucket.name === MEDIA_BUCKET);

  if (bucketExists) {
    return supabase;
  }

  const { error: createError } = await supabase.storage.createBucket(
    MEDIA_BUCKET,
    {
      public: true,
    },
  );

  if (createError) {
    throw new Error(createError.message);
  }

  return supabase;
}

export async function POST(request: Request) {
  try {
    if (!(await isAdminSession())) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder");

    if (!(file instanceof File)) {
      return NextResponse.json({ message: "File is required." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { message: "Only JPG, PNG, and WebP images are allowed." },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: "Image must be 5MB or smaller." },
        { status: 400 },
      );
    }

    const safeFolder = typeof folder === "string" ? folder : "general";
    const extension = getFileExtension(file);
    const path = `${safeFolder}/${crypto.randomUUID()}.${extension}`;
    const supabase = await ensureMediaBucket();

    const { error } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(path, file, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);

    return NextResponse.json({
      path,
      url: data.publicUrl,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to upload media.",
      },
      { status: 500 },
    );
  }
}
