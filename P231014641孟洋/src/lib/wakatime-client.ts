interface WakaTimeStats {
  data: {
    total_seconds: number;
    total_seconds_including_other_language: number;
    daily_average: number;
    daily_average_including_other_language: number;
    days_including_other_language: number;
    days_minus_holidays: number;
    holidays: number;
    status: string;
    percent_calculated: number;
    is_already_updating: boolean;
    is_coding_activity_visible: boolean;
    is_other_usage_visible: boolean;
    is_stuck: boolean;
    is_up_to_date: boolean;
    is_up_to_date_pending_future: boolean;
    range: {
      start: string;
      end: string;
      start_date: string;
      end_date: string;
      start_text: string;
      end_text: string;
      timezone: string;
    };
    timeout: number;
    writes_only: boolean;
    user_id: string;
    username: string;
    created_at: string;
    modified_at: string;
    display_name: string;
    full_name: string;
    email: string;
    photo: string;
    website: string;
    human_readable_website: string;
    location: string;
    logged_time_public: boolean;
    logged_time_tooltip: string;
    plan: string;
    colorscheme: string;
    durations_slice_by: string;
    created_at_text: string;
    timeout_minutes: number;
    timezone: string;
    last_heartbeat_at: string;
    last_plugin: string;
    last_plugin_name: string;
    last_project: string;
    needs_payment_method: boolean;
    has_premium_features: boolean;
    public_profile_time_range: string;
    share_all_time_badge: boolean;
    share_last_year_badge: boolean;
    languages?: Array<{
      name: string;
      total_seconds: number;
      percent: number;
      digital: string;
      decimal: string;
      text: string;
      hours: number;
      minutes: number;
    }>;
    projects?: Array<{
      name: string;
      total_seconds: number;
      percent: number;
      digital: string;
      decimal: string;
      text: string;
      hours: number;
      minutes: number;
    }>;
    range_text: string;
    human_readable_total: string;
    human_readable_total_including_other_language: string;
    human_readable_daily_average: string;
    human_readable_daily_average_including_other_language: string;
    human_readable_range: string;
    machines?: Array<{
      name: string;
      machine_name_id: string;
      total_seconds: number;
      percent: number;
      digital: string;
      decimal: string;
      text: string;
      hours: number;
      minutes: number;
    }>;
    editors?: Array<{
      name: string;
      total_seconds: number;
      percent: number;
      digital: string;
      decimal: string;
      text: string;
      hours: number;
      minutes: number;
    }>;
    operating_systems?: Array<{
      name: string;
      total_seconds: number;
      percent: number;
      digital: string;
      decimal: string;
      text: string;
      hours: number;
      minutes: number;
    }>;
    categories?: Array<{
      name: string;
      total_seconds: number;
      percent: number;
      digital: string;
      decimal: string;
      text: string;
      hours: number;
      minutes: number;
    }>;
    grand_total: {
      digital: string;
      hours: number;
      minutes: number;
      text: string;
      total_seconds: number;
    };
    human_readable_total_with_seconds: string;
    human_readable_daily_average_with_seconds: string;
    is_including_today: boolean;
    percent_calculated_text: string;
    is_cached: boolean;
    is_already_updating_text: string;
    is_stuck_text: string;
    is_up_to_date_text: string;
    is_up_to_date_pending_future_text: string;
  };
}

interface WakaTimeUser {
  data: {
    id: string;
    display_name: string;
    email: string;
    full_name: string;
    has_premium_features: boolean;
    human_readable_website: string;
    is_hireable: boolean;
    location: string;
    logged_time_public: boolean;
    photo: string;
    plan: string;
    public_profile_time_range: string;
    username: string;
    website: string;
    created_at: string;
    modified_at: string;
    timeout: number;
    timezone: string;
    last_heartbeat_at: string;
    last_plugin: string;
    last_plugin_name: string;
    last_project: string;
    needs_payment_method: boolean;
    share_all_time_badge: boolean;
    share_last_year_badge: boolean;
    colorscheme: string;
    durations_slice_by: string;
    logged_time_tooltip: string;
    public_email: string;
    public_profile_time_range_text: string;
    writes_only: boolean;
  };
}

export class WakaTimeClient {
  private baseUrl = '/api/wakatime';

  private async request<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getCurrentUser(): Promise<WakaTimeUser> {
    return this.request<WakaTimeUser>('/user');
  }

  async getStats(range: 'last_7_days' | 'last_30_days' | 'last_6_months' | 'last_year' = 'last_7_days'): Promise<WakaTimeStats> {
    return this.request<WakaTimeStats>(`/stats/${range}`);
  }
}

export const wakaTimeClient = new WakaTimeClient();