import http from "http";
import fs from "fs";
import path from "path";

async function main() {
  console.log("=== Testing E2E Media & Soundtrack Upload Flow ===");

  const baseUrl = "http://localhost:3000";

  // Create temporary test MP3 and JPG files
  const testMp3Path = path.join(__dirname, "test_track.mp3");
  const testJpgPath = path.join(__dirname, "test_pic.jpg");

  // Simple valid binary mock audio & image buffers
  const mp3Buffer = Buffer.alloc(1024 * 10, "ID3 mock mp3 audio data content");
  const jpgBuffer = Buffer.alloc(1024 * 5, "FFD8FF mock image content");

  fs.writeFileSync(testMp3Path, mp3Buffer);
  fs.writeFileSync(testJpgPath, jpgBuffer);

  // Helper for multipart/form-data upload
  async function uploadFile(filePath: string, filename: string, mimeType: string): Promise<string> {
    const boundary = "----WebKitFormBoundary" + Math.random().toString(36).substring(2);
    const fileData = fs.readFileSync(filePath);

    let body = "";
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="file"; filename="${filename}"\r\n`;
    body += `Content-Type: ${mimeType}\r\n\r\n`;

    const payload = Buffer.concat([
      Buffer.from(body, "utf-8"),
      fileData,
      Buffer.from(`\r\n--${boundary}--\r\n`, "utf-8"),
    ]);

    const res = await fetch(`${baseUrl}/api/uploads`, {
      method: "POST",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
      },
      body: payload,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(`Upload failed for ${filename}: ${JSON.stringify(data)}`);
    }
    return data.url;
  }

  // 1. Upload Photo
  console.log("1. Uploading photo to /api/uploads...");
  const photoUrl = await uploadFile(testJpgPath, "memory.jpg", "image/jpeg");
  console.log("   Photo Blob URL:", photoUrl);

  // 2. Upload MP3 Soundtrack
  console.log("2. Uploading MP3 soundtrack to /api/uploads...");
  const musicUrl = await uploadFile(testMp3Path, "birthday_song.mp3", "audio/mpeg");
  console.log("   Music Blob URL:", musicUrl);

  // 3. Create Draft Gift
  console.log("3. Creating gift draft via POST /api/gifts...");
  const createRes = await fetch(`${baseUrl}/api/gifts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recipientName: "Music Lover",
      message: "Hope your birthday rocks!",
      letter: "Happy Birthday! Turn up the volume!",
      theme: "festive-party",
      musicUrl: musicUrl,
      musicName: "birthday_song.mp3",
      photos: [{ url: photoUrl, caption: "Party photo" }],
      wishes: [{ text: "Dance all night!" }],
    }),
  });

  const createData = await createRes.json();
  if (!createRes.ok) {
    throw new Error(`Create gift failed: ${JSON.stringify(createData)}`);
  }
  const giftId = createData.gift.id;
  const giftSlug = createData.gift.slug;
  console.log(`   Gift created! ID: ${giftId}, Slug: ${giftSlug}`);
  console.log("   Saved musicUrl:", createData.gift.musicUrl);

  // 4. Update Gift Draft (Simulating step navigation / save)
  console.log("4. Updating draft via PUT /api/gifts/[id]...");
  const updateRes = await fetch(`${baseUrl}/api/gifts/${giftId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recipientName: "Music Lover",
      message: "Hope your birthday rocks updated!",
      musicUrl: musicUrl,
      musicName: "birthday_song.mp3",
      photos: [{ url: photoUrl, caption: "Party photo updated" }],
      wishes: [{ text: "Dance all night!" }, { text: "Enjoy every second!" }],
    }),
  });

  const updateData = await updateRes.json();
  if (!updateRes.ok) {
    throw new Error(`Update gift failed: ${JSON.stringify(updateData)}`);
  }
  console.log("   Draft updated successfully! Saved musicUrl:", updateData.gift.musicUrl);

  // 5. Publish Gift
  console.log("5. Publishing gift via POST /api/gifts/[id]/publish...");
  const pubRes = await fetch(`${baseUrl}/api/gifts/${giftId}/publish`, {
    method: "POST",
  });
  const pubData = await pubRes.json();
  if (!pubRes.ok) {
    throw new Error(`Publish failed: ${JSON.stringify(pubData)}`);
  }
  console.log("   Published gift shareUrl:", pubData.gift.shareUrl);

  // 6. Fetch Recipient Experience Page Data by Slug
  console.log(`6. Fetching recipient gift data via GET /api/gifts?slug=${giftSlug}...`);
  const recipRes = await fetch(`${baseUrl}/api/gifts?slug=${giftSlug}`);
  const recipData = await recipRes.json();
  if (!recipRes.ok) {
    throw new Error(`Fetch recipient gift failed: ${JSON.stringify(recipData)}`);
  }

  console.log("   Recipient Gift retrieved successfully!");
  console.log("   Recipient Music URL:", recipData.gift.musicUrl);
  console.log("   Recipient Music Name:", recipData.gift.musicName);

  if (recipData.gift.musicUrl === musicUrl) {
    console.log("SUCCESS: Permanent Blob musicUrl matched perfectly!");
  } else {
    throw new Error(`Mismatch! Expected ${musicUrl}, got ${recipData.gift.musicUrl}`);
  }

  // Cleanup temp test files
  try {
    fs.unlinkSync(testMp3Path);
    fs.unlinkSync(testJpgPath);
  } catch {}

  console.log("\n=== ALL E2E TESTS PASSED SUCCESSFULLY! ===");
}

main().catch((err) => {
  console.error("TEST FAILED:", err);
  process.exit(1);
});
