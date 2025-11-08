// デイリーボーナス管理フック
import { useState, useEffect } from 'react';
import { canClaimDailyBonus, claimDailyBonus, getTimeUntilNextBonus, getWaterPercentage } from '../infrastructure/storage.js';

export function useDailyBonus(onClaim) {
  const [canClaim, setCanClaim] = useState(false);
  const [timeUntilNext, setTimeUntilNext] = useState('');
  const [percentFilled, setPercentFilled] = useState(0);
  
  const updateStatus = () => {
    const claimable = canClaimDailyBonus();
    setCanClaim(claimable);
    
    if (!claimable) {
      setTimeUntilNext(getTimeUntilNextBonus());
      setPercentFilled(getWaterPercentage());
    } else {
      setPercentFilled(0);
    }
  };
  
  useEffect(() => {
    updateStatus();
    
    // 1分ごとに更新
    const interval = setInterval(updateStatus, 60000);
    return () => clearInterval(interval);
  }, []);
  
  const claim = () => {
    if (canClaim && claimDailyBonus()) {
      updateStatus();
      if (onClaim) {
        onClaim(1); // 空き試験管1本をプレゼント
      }
      return true;
    }
    return false;
  };
  
  return { canClaim, claim, timeUntilNext, percentFilled };
}
