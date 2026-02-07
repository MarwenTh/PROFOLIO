import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

export interface Referral {
  id: number;
  referrer_id: number;
  referred_email?: string;
  referred_user_id?: number;
  referred_user_name?: string;
  referred_user_email?: string;
  status: 'pending' | 'completed' | 'rewarded';
  reward_amount: number;
  referral_code?: string;
  created_at: string;
  completed_at?: string;
}

export interface ReferralStats {
  total_referrals: number;
  completed_referrals: number;
  total_rewards: number;
}

export function useReferrals() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [referralCode, setReferralCode] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const fetchReferrals = async () => {
    try {
      setLoading(true);
      const response = await api.get('/referrals');
      if (response.data.success) {
        setReferrals(response.data.referrals);
        setStats(response.data.stats);
      }
    } catch (error: any) {
      console.error('Error fetching referrals:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch referrals');
    } finally {
      setLoading(false);
    }
  };

  const getReferralCode = async () => {
    try {
      const response = await api.get('/referrals/code');
      if (response.data.success) {
        setReferralCode(response.data.referralCode);
        return response.data.referralCode;
      }
    } catch (error: any) {
      console.error('Error getting referral code:', error);
      toast.error(error.response?.data?.message || 'Failed to get referral code');
      throw error;
    }
  };

  const sendInvite = async (email: string) => {
    try {
      const response = await api.post('/referrals/invite', { email });
      if (response.data.success) {
        toast.success('Referral invite sent!');
        fetchReferrals();
        return response.data;
      }
    } catch (error: any) {
      console.error('Error sending invite:', error);
      toast.error(error.response?.data?.message || 'Failed to send invite');
      throw error;
    }
  };

  useEffect(() => {
    fetchReferrals();
    getReferralCode();
  }, []);

  return { referrals, stats, referralCode, loading, sendInvite, refetch: fetchReferrals };
}
