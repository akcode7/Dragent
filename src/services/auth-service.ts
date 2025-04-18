import { ID } from 'appwrite';
import { account, appwriteService } from '@/lib/api/appwrite';

export interface UserCredentials {
    email: string;
    password: string;
}

export interface NewUser extends UserCredentials {
    name: string;
}

export type AuthResponse = {
    success: boolean;
    data?: any;
    error?: string;
}

export const authService = {
    async createAccount(user: NewUser): Promise<AuthResponse> {
        try {
            // First, create the account in Appwrite Auth
            const authAccount = await account.create(
                ID.unique(),
                user.email,
                user.password,
                user.name
            );

            if (authAccount) {
                // Then create a user profile document in the database
                try {
                    await appwriteService.createUserProfile(
                        authAccount.$id,
                        {
                            name: user.name,
                            email: user.email,
                            // Add any other user data you want to store
                        }
                    );
                } catch (profileError) {
                    console.error("Error creating user profile:", profileError);
                    // Continue anyway since the auth account was created
                }

                return { 
                    success: true,
                    data: authAccount 
                };
            }
            
            return { 
                success: false,
                error: 'Failed to create account' 
            };
        } catch (error: any) {
            return { 
                success: false,
                error: error.message || 'Failed to create account'
            };
        }
    },

    async login(credentials: UserCredentials): Promise<AuthResponse> {
        try {
            const session = await account.createSession(
                credentials.email,
                credentials.password
            );

            if (session) {
                // Get the user account details
                const authAccount = await account.get();
                
                // Get the user profile from the database
                const userProfile = await appwriteService.getUserProfile(authAccount.$id);

                return { 
                    success: true,
                    data: {
                        session,
                        user: authAccount,
                        profile: userProfile
                    }
                };
            }

            return { 
                success: false,
                error: 'Failed to login' 
            };
        } catch (error: any) {
            return { 
                success: false,
                error: error.message || 'Failed to login'
            };
        }
    },

    async logout(): Promise<AuthResponse> {
        try {
            const response = await account.deleteSession('current');
            
            return { 
                success: true,
                data: response 
            };
        } catch (error: any) {
            return { 
                success: false,
                error: error.message || 'Failed to logout'
            };
        }
    },

    async forgotPassword(email: string): Promise<AuthResponse> {
        try {
            const response = await account.createRecovery(
                email,
                'https://dragent.app/reset-password' // Update with your actual domain
            );

            return { 
                success: true,
                data: response 
            };
        } catch (error: any) {
            return { 
                success: false,
                error: error.message || 'Failed to process forgot password request'
            };
        }
    },

    async getCurrentUser(): Promise<AuthResponse> {
        try {
            // Get the user account information
            const authAccount = await account.get();
            
            // Get the user profile from the database
            const userProfile = await appwriteService.getUserProfile(authAccount.$id);
            
            return { 
                success: true,
                data: {
                    user: authAccount,
                    profile: userProfile
                }
            };
        } catch (error) {
            return { 
                success: false,
                error: 'No user is currently logged in'
            };
        }
    },

    async updateProfile(userId: string, profileId: string, userData: any): Promise<AuthResponse> {
        try {
            const response = await appwriteService.updateUserProfile(
                profileId, 
                userData
            );
            
            return {
                success: true,
                data: response
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Failed to update profile'
            };
        }
    }
};