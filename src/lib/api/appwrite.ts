// src/lib/api/appwrite.ts
import { Client, Account, Databases, Storage, ID } from 'appwrite';

// Environment variables for Appwrite configuration
// These should be defined in your .env.local file
const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '68024e490007e0e1d705';
const APPWRITE_DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '68024ee2001eb1355dba';
const APPWRITE_USER_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID || '68024f2f00007aff633b';
const APPWRITE_MEDICAL_RECORDS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_MEDICAL_RECORDS_COLLECTION_ID || '68024f44000ca023bf04';
const APPWRITE_STORAGE_BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID || '68024f6a0030bd985eb6';

// Initialize Appwrite client
export const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

// Initialize Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Helper function to sanitize userId for attribute value (not document ID)
function sanitizeUserId(userId: string): string {
    if (typeof userId !== 'string' || !userId) {
        return ID.unique();
    }
    
    // For attribute values, we need to ensure it follows the attribute rules
    // but we don't need to be as strict as with document IDs
    return userId.substring(0, 36); // Ensure it's not longer than 36 chars
}

// Helper functions for common database operations
export const appwriteService = {
    // User profile operations
    createUserProfile: async (userId: string, userData: any) => {
        try {
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