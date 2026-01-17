import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import type { Session } from '@supabase/supabase-js';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { App as CapApp } from '@capacitor/app';

export function useAuth() {
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        if (!supabase) return;

        // 1. Get Initial Session
        supabase.auth.getSession().then(({ data: { session } }) => setSession(session));

        // 2. Listen for Changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Listen for Auth Callback Deep Links
    useEffect(() => {
        if (!Capacitor.isNativePlatform()) return;

        const listener = CapApp.addListener('appUrlOpen', async ({ url }) => {
            // Handle Auth Callback
            if (url.includes('access_token') || url.includes('refresh_token')) {
                const hashMap = new URLSearchParams(new URL(url).hash.substring(1));
                const accessToken = hashMap.get('access_token');
                const refreshToken = hashMap.get('refresh_token');

                if (accessToken && refreshToken && supabase) {
                    const { error } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken
                    });
                    if (error) console.error('Set Session Error:', error);
                    try { await Browser.close(); } catch { }
                }
            }
        });

        return () => {
            listener.then(handle => handle.remove());
        };
    }, []);

    const login = async (provider: 'google' | 'apple') => {
        if (!supabase) return;

        if (Capacitor.isNativePlatform()) {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: 'homebartonight://auth/callback',
                    skipBrowserRedirect: true
                }
            });

            if (error) {
                console.error('Login Error:', error);
                return;
            }

            if (data?.url) {
                await Browser.open({
                    url: data.url,
                    windowName: '_self',
                    presentationStyle: 'fullscreen'
                });
            }
        } else {
            await supabase.auth.signInWithOAuth({
                provider: provider,
                options: { redirectTo: window.location.origin }
            });
        }
    };

    const logout = async () => {
        if (!supabase) return;
        const { error } = await supabase.auth.signOut();
        if (error) console.error('SignOut Error:', error);
        setSession(null);
    };

    const deleteAccount = async () => {
        if (!supabase) return;
        try {
            const { error } = await supabase.rpc('delete_own_account');
            if (error) throw error;
            await logout();
            return true;
        } catch (e) {
            console.error('Delete Account Error:', e);
            throw e;
        }
    };

    return {
        session,
        login,
        logout,
        deleteAccount
    };
}
