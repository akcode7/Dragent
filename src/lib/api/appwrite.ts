// src/lib/api/appwrite.ts
import { Client, Account, Databases, Storage, ID } from 'appwrite';

// Environment variables for Appwrite configuration
// These should be defined in your .env.local file
const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const APPWRITE_DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const APPWRITE_USER_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID;
const APPWRITE_MEDICAL_RECORDS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_MEDICAL_RECORDS_COLLECTION_ID;
const APPWRITE_STORAGE_BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID;

// Validate environment variables
function validateEnvVariables() {
  const requiredVars = [
    { name: 'APPWRITE_ENDPOINT', value: APPWRITE_ENDPOINT },
    { name: 'APPWRITE_PROJECT_ID', value: APPWRITE_PROJECT_ID },
    { name: 'APPWRITE_DATABASE_ID', value: APPWRITE_DATABASE_ID },
    { name: 'APPWRITE_USER_COLLECTION_ID', value: APPWRITE_USER_COLLECTION_ID },
    { name: 'APPWRITE_MEDICAL_RECORDS_COLLECTION_ID', value: APPWRITE_MEDICAL_RECORDS_COLLECTION_ID },
    { name: 'APPWRITE_STORAGE_BUCKET_ID', value: APPWRITE_STORAGE_BUCKET_ID },
  ];

  const missingVars = requiredVars.filter(v => !v.value);
  
  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.map(v => v.name).join(', ')}. ` +
      'Please ensure these are set in your .env.local file.'
    );
  }
}

// Validate environment variables are set
validateEnvVariables();

// Initialize Appwrite client
export const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT!)
    .setProject(APPWRITE_PROJECT_ID!);

// Initialize Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

/**
 * Helper function to sanitize userId for attribute value
 * Ensures the userId meets Appwrite's requirements of max 36 chars
 * and only contains valid characters (a-z, A-Z, 0-9, period, hyphen, underscore)
 */
export function sanitizeUserId(userId: string): string {
    if (typeof userId !== 'string' || !userId) {
        return ID.unique();
    }
    
    // First, ensure it has only valid characters
    // Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore
    let sanitized = userId.replace(/[^a-zA-Z0-9._-]/g, '_');
    
    // Ensure it doesn't start with a special character
    if (/^[._-]/.test(sanitized)) {
        sanitized = 'u' + sanitized.substring(1);
    }
    
    // Ensure it's not longer than 36 chars
    sanitized = sanitized.substring(0, 36);
    
    return sanitized;
}

// Helper functions for common database operations
export const appwriteService = {
    // User profile operations
    createUserProfile: async (userId: string, userData: any) => {
        try {
            // Ensure userId is properly sanitized
            const safeUserId = sanitizeUserId(userId);
            
            return await databases.createDocument(
                APPWRITE_DATABASE_ID,
                APPWRITE_USER_COLLECTION_ID,
                ID.unique(), // Use unique ID for document
                {
                    userId: safeUserId, // Store sanitized userId as field
                    ...userData,
                    createdAt: new Date().toISOString(),
                }
            );
        } catch (error) {
            console.error('Error creating user profile:', error);
            throw error;
        }
    },

    getUserProfile: async (userId: string) => {
        try {
            // Ensure userId is properly sanitized
            const safeUserId = sanitizeUserId(userId);
            
            const response = await databases.listDocuments(
                APPWRITE_DATABASE_ID,
                APPWRITE_USER_COLLECTION_ID,
                [
                    // Query to find profile by userId
                    databases.queries.equal('userId', safeUserId)
                ]
            );
            
            return response.documents[0] || null;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }
    },

    updateUserProfile: async (documentId: string, userData: any) => {
        return await databases.updateDocument(
            APPWRITE_DATABASE_ID,
            APPWRITE_USER_COLLECTION_ID,
            documentId,
            userData
        );
    },

    // Medical records operations
    createMedicalRecord: async (userId: string, recordData: any) => {
        try {
            // Ensure userId is properly sanitized
            const safeUserId = sanitizeUserId(userId);
            
            return await databases.createDocument(
                APPWRITE_DATABASE_ID,
                APPWRITE_MEDICAL_RECORDS_COLLECTION_ID,
                ID.unique(),
                {
                    userId: safeUserId,
                    ...recordData,
                    createdAt: new Date().toISOString(),
                }
            );
        } catch (error) {
            console.error('Error creating medical record:', error);
            throw error;
        }
    },

    getMedicalRecords: async (userId: string) => {
        try {
            // Ensure userId is properly sanitized
            const safeUserId = sanitizeUserId(userId);
            
            const response = await databases.listDocuments(
                APPWRITE_DATABASE_ID,
                APPWRITE_MEDICAL_RECORDS_COLLECTION_ID,
                [
                    // Query to find records by userId
                    databases.queries.equal('userId', safeUserId),
                    // Sort by creation date, newest first
                    databases.queries.orderDesc('createdAt')
                ]
            );
            
            return response.documents;
        } catch (error) {
            console.error('Error fetching medical records:', error);
            return [];
        }
    },

    // File storage operations
    uploadFile: async (file: File, permissions: string[] = ['role:all']) => {
        return await storage.createFile(
            APPWRITE_STORAGE_BUCKET_ID,
            ID.unique(),
            file,
            permissions
        );
    }
};