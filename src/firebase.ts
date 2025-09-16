import admin from "firebase-admin";
import serviceAccount from "./uai-mdw-2025-firebase-adminsdk.json";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });

export default admin;