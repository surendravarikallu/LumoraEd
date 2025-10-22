import admin from "firebase-admin";

// Initialize Firebase Admin with minimal configuration
// In production, use service account credentials
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    });
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error);
    // Fallback: initialize without credentials for development
    admin.initializeApp();
  }
}

export const auth = admin.auth();

export async function verifyIdToken(token: string) {
  try {
    // Verify the Firebase ID token
    const decodedToken = await auth.verifyIdToken(token, true);
    return decodedToken;
  } catch (error: any) {
    console.error("Error verifying Firebase token:", error.message);
    throw new Error("Invalid authentication token");
  }
}
