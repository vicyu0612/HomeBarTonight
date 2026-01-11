
import { useSubscriptionContext } from '../contexts/SubscriptionContext';
import type { SubscriptionContextType } from '../contexts/SubscriptionContext';

export type SubscriptionState = SubscriptionContextType;

export const useSubscription = (): SubscriptionState => {
    return useSubscriptionContext();
};
