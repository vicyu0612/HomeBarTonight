
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { Purchases, LOG_LEVEL, type CustomerInfo, type PurchasesOfferings } from '@revenuecat/purchases-capacitor';
import { RevenueCatUI, PAYWALL_RESULT } from '@revenuecat/purchases-capacitor-ui';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
// API Keys provided by user
const API_KEYS = {
    ios: 'appl_RSGAMXbtbUxctQmOMjFRXvUEJnx',
    default: 'appl_RSGAMXbtbUxctQmOMjFRXvUEJnx'
};

const ENTITLEMENT_ID = 'HomeBarTonight Pro';

export interface SubscriptionContextType {
    isPro: boolean;
    currentOffering: PurchasesOfferings | null;
    loading: boolean;
    presentPaywall: () => Promise<void>;
    presentCustomerCenter: () => Promise<void>;
    restorePurchases: () => Promise<CustomerInfo | null>;
    debugInfo: {
        activeEntitlements: string[];
        originalCustomerInfo: unknown;
    };
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

let isConfigured = false;

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
    const [isPro, setIsPro] = useState(false);
    const [currentOffering, setCurrentOffering] = useState<PurchasesOfferings | null>(null);
    const [loading, setLoading] = useState(true);
    const [debugInfo, setDebugInfo] = useState<{ activeEntitlements: string[], originalCustomerInfo: unknown }>({ activeEntitlements: [], originalCustomerInfo: null });

    const checkEntitlement = useCallback((info: CustomerInfo) => {
        // Debug Log

        const activeEntitlements = Object.keys(info.entitlements.active);


        setDebugInfo({
            activeEntitlements,
            originalCustomerInfo: info
        });

        // Robust check using 'all' to find the specific entitlement and check its status
        const entitlement = info.entitlements.all[ENTITLEMENT_ID];

        if (entitlement?.isActive) {

            setIsPro(true);
        } else {

            setIsPro(false);
        }
    }, []);

    const updateCustomerInfo = useCallback(async () => {
        try {
            const info = await Purchases.getCustomerInfo();
            checkEntitlement(info.customerInfo);
        } catch (e) {
            console.error("Error updating customer info", e);
        }
    }, [checkEntitlement]);

    useEffect(() => {
        const init = async () => {
            if (!Capacitor.isNativePlatform()) {
                setLoading(false);
                return;
            }

            await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });

            if (!isConfigured) {
                await Purchases.configure({ apiKey: API_KEYS.default });
                isConfigured = true;
            }

            // Setup Listener for real-time updates (e.g. from Paywall purchase)
            await Purchases.addCustomerInfoUpdateListener((info) => {

                checkEntitlement(info);
            });

            // Refresh on App Resume (Critical for external cancellations)
            App.addListener('appStateChange', async ({ isActive }) => {
                if (isActive) {

                    await updateCustomerInfo();
                }
            });

            // Initial check
            await updateCustomerInfo();

            try {
                const offerings = await Purchases.getOfferings();
                setCurrentOffering(offerings);
            } catch (e) {
                console.error("Error fetching offerings", e);
            }

            setLoading(false);
        };

        init();
    }, [updateCustomerInfo, checkEntitlement]);

    const presentPaywall = useCallback(async () => {
        if (!Capacitor.isNativePlatform()) {
            alert("Paywall is only available on native devices.");
            return;
        }

        try {
            const result = await RevenueCatUI.presentPaywall({
                displayCloseButton: true,
            });

            const paywallResult = (result as { result?: PAYWALL_RESULT }).result;

            if (paywallResult === PAYWALL_RESULT.PURCHASED || paywallResult === PAYWALL_RESULT.RESTORED) {
                await updateCustomerInfo();
            }
        } catch (e) {
            console.error("Error presenting paywall", e);
        }
    }, [updateCustomerInfo]);

    const presentCustomerCenter = useCallback(async () => {
        if (!Capacitor.isNativePlatform()) return;
        try {
            // @ts-ignore
            if (RevenueCatUI.presentCustomerCenter) {
                // @ts-ignore
                await RevenueCatUI.presentCustomerCenter();
            } else {
                console.warn("Customer Center not supported");
            }
        } catch (e) {
            console.error("Error presenting customer center", e);
        }
    }, []);

    const restorePurchases = useCallback(async () => {
        try {
            const info = await Purchases.restorePurchases();
            checkEntitlement(info.customerInfo);
            return info.customerInfo;
        } catch (e) {
            console.error("Error restoring purchases", e);
            return null;
        }
    }, [checkEntitlement]);

    return (
        <SubscriptionContext.Provider value={{
            isPro,
            currentOffering,
            loading,
            presentPaywall,
            presentCustomerCenter,
            restorePurchases,
            debugInfo
        }}>
            {children}
        </SubscriptionContext.Provider>
    );
};

export const useSubscriptionContext = () => {
    const context = useContext(SubscriptionContext);
    if (!context) {
        throw new Error('useSubscriptionContext must be used within a SubscriptionProvider');
    }
    return context;
};
