/**
 * Dashboard API endpoints
 * 
 * Provides methods for dashboard data
 */
import { crud } from '~/utils/crud';

/**
 * Dashboard API methods
 */
export const dashboardApi = {
  /**
   * Get finance summary
   */
  getFinanceSummary: async () => {
    return crud.get('/api/finance/summary');
  },

  /**
   * Get login activity data
   */
  getLoginActivity: async () => {
    return crud.get('/api/login-activity');
  }
};

export default dashboardApi;
