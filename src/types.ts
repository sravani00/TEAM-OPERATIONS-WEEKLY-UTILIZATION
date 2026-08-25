export type UserRole = 'manager' | 'sravani' | 'sricharan' | 'vamsi' | 'vivek' | 'dhanusri' | 'vishnu' | 'rahul';

export type ReportStatus = 'Draft' | 'Submitted' | 'Approved';

export interface ESPBreakdownItem {
  id: string;
  esp: string;
  campaigns: number;
  utilization: number;
}

export interface ESPData {
  id: string;
  name: string;
  campaigns: number;
  hours: number;
  utilization: number;
  previousWeekUtilization: number;
}

export interface DailyLogEntry {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  dateStr?: string;
  campaigns: number;
  hours: number;
  notes?: string;
}

export interface TeamMemberData {
  id: string;
  name: string;
  role?: string;
  campaigns: number;
  hours: number;
  avgHoursPerDay: number;
  utilization: number;
  dailyUtilization: number;
  previousWeekUtilization: number;
  status: ReportStatus;
  espBreakdown: ESPBreakdownItem[];
  dailyLogs?: DailyLogEntry[];
  description: string;
  keyActivities: string[];
  thisWeekPlan: string[];
  lastSubmittedAt?: string;
}

export interface KeyActivity {
  id: string;
  activity: string;
  owner: string;
  status: 'Completed' | 'In Progress' | 'Blocked';
  completionPercentage: number;
  category?: string;
}

export interface PlanItem {
  id: string;
  activity: string;
  owner: string;
  priority: 'High' | 'Medium' | 'Low';
  targetDate: string;
  status: 'In Progress' | 'Planned' | 'Completed';
}

export interface MetricSummary {
  teamUtilization: number;
  prevTeamUtilization: number;
  totalCampaigns: number;
  prevTotalCampaigns: number;
  totalHours: number;
  prevTotalHours: number;
  totalTeamMembers: number;
  prevTotalTeamMembers: number;
  completedActivitiesCount: number;
  prevCompletedActivitiesCount: number;
}

export interface WeekData {
  id: string;
  dateRange: string;
  previousWeekRange: string;
  summary: MetricSummary;
  espData: ESPData[];
  teamData: TeamMemberData[];
  activities: KeyActivity[];
  planItems: PlanItem[];
}
