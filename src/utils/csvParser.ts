import type { WeekData, ESPData, TeamMemberData, KeyActivity, PlanItem } from '../types';

/**
 * Robust CSV line splitter that handles quotes, dates with commas, and leading/trailing whitespace.
 */
export function splitCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim().replace(/^"|"$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim().replace(/^"|"$/g, ''));
  return result;
}

/**
 * Generate a sample CSV string template that users can download, fill out, and re-upload.
 */
export function generateSampleCSV(): string {
  return `# METADATA
Date Range,Aug 24 – Aug 28, 2026
Previous Week Range,Aug 17 – Aug 21, 2026

# ESP_PLATFORMS
Name,Campaigns,Hours
Ongage,450,36.0
Netcore,325,29.5
Maropost,95,13.0
ValueFirst,135,16.5

# TEAM_MEMBERS
Name,Role,Campaigns,Hours
Sravani,Sr. Operations Specialist,270,31.5
Dhanusri,Campaign Operations Manager,245,32.0
Sricharan,ESP Infrastructure Lead,260,32.5
Rajesh,Deliverability & QA Analyst,180,30.5
Ananya,Email Marketing Operations Specialist,160,30.0
Vikram,Junior Operations Associate,130,30.0

# ACTIVITIES
Activity,Owner,Status,CompletionPercentage,Category
Weekly campaign scheduling & execution,Team,Completed,100,Operations
Domain authentication & SPF monitoring,Sravani,Completed,100,Deliverability
ESP API connection health check,Dhanusri,Completed,100,Infrastructure
Bounce rate anomaly detection setup,Sravani,In Progress,85,Deliverability
Suppression list auto-cleaner update,Rajesh,In Progress,60,Quality Assurance

# ACTION_PLAN
Activity,Owner,Priority,TargetDate,Status
Complete upcoming holiday campaign queue,Team,High,Sep 04,In Progress
Q3 deliverability & domain warming audit,Rajesh,Medium,Sep 10,Planned
ESP load balancing setup across IP pools,Sricharan,High,Sep 08,Planned
`;
}

/**
 * Generate a sample JSON template matching WeekData schema.
 */
export function generateSampleJSON(previousWeek?: WeekData): string {
  const dateStr = 'Aug 24 – Aug 28, 2026';
  const prevDateStr = previousWeek?.dateRange || 'Aug 17 – Aug 21, 2026';

  const sample: WeekData = {
    id: `week-${Date.now()}`,
    dateRange: dateStr,
    previousWeekRange: prevDateStr,
    summary: {
      teamUtilization: 96.8,
      prevTeamUtilization: previousWeek?.summary.teamUtilization || 92.0,
      totalCampaigns: 1245,
      prevTotalCampaigns: previousWeek?.summary.totalCampaigns || 1180,
      totalHours: 186.5,
      prevTotalHours: previousWeek?.summary.totalHours || 178.0,
      totalTeamMembers: 6,
      prevTotalTeamMembers: previousWeek?.summary.totalTeamMembers || 6,
      completedActivitiesCount: 22,
      prevCompletedActivitiesCount: previousWeek?.summary.completedActivitiesCount || 18,
    },
    espData: [
      { id: 'esp-1', name: 'Ongage', campaigns: 420, hours: 58.5, utilization: 95.0, previousWeekUtilization: 91.2 },
      { id: 'esp-2', name: 'Netcore', campaigns: 385, hours: 54.0, utilization: 98.0, previousWeekUtilization: 94.5 },
      { id: 'esp-3', name: 'Maropost', campaigns: 180, hours: 28.0, utilization: 92.0, previousWeekUtilization: 88.0 },
      { id: 'esp-4', name: 'ValueFirst', campaigns: 260, hours: 46.0, utilization: 96.0, previousWeekUtilization: 92.5 },
    ],
    teamData: [
      {
        id: 'tm-1',
        name: 'Sravani',
        role: 'Sr. Operations Specialist',
        campaigns: 270,
        hours: 31.5,
        avgHoursPerDay: 7.88,
        utilization: 95.5,
        dailyUtilization: 98.5,
        previousWeekUtilization: 93.75,
        status: 'Submitted',
        espBreakdown: [
          { id: 'sb-1', esp: 'Ongage', campaigns: 120, utilization: 95.0 },
          { id: 'sb-2', esp: 'Netcore', campaigns: 85, utilization: 98.0 },
          { id: 'sb-3', esp: 'Maropost', campaigns: 25, utilization: 92.0 },
          { id: 'sb-4', esp: 'ValueFirst', campaigns: 40, utilization: 96.0 },
        ],
        description: 'Campaign scheduling, QA, ESP rotation and monitoring.',
        keyActivities: ['Campaign scheduling', 'ESP utilization monitoring', 'Domain monitoring'],
        thisWeekPlan: ['Complete campaign scheduling', 'Monitor ESP credits'],
      },
      {
        id: 'tm-2',
        name: 'Dhanusri',
        role: 'Campaign Operations Manager',
        campaigns: 245,
        hours: 32.0,
        avgHoursPerDay: 8.0,
        utilization: 98.0,
        dailyUtilization: 100.0,
        previousWeekUtilization: 96.0,
        status: 'Submitted',
        espBreakdown: [
          { id: 'db-1', esp: 'Ongage', campaigns: 110, utilization: 96.0 },
          { id: 'db-2', esp: 'Netcore', campaigns: 80, utilization: 99.0 },
        ],
        description: 'ESP connection management and supervision.',
        keyActivities: ['Team workflow management', 'ESP API connection check'],
        thisWeekPlan: ['Quarterly campaign capacity review'],
      },
    ],
    activities: [
      { id: 'act-1', activity: 'Weekly campaign scheduling & execution', owner: 'Team', status: 'Completed', completionPercentage: 100, category: 'Operations' },
    ],
    planItems: [
      { id: 'pi-1', activity: 'Complete upcoming holiday campaign queue', owner: 'Team', priority: 'High', targetDate: 'Sep 04', status: 'In Progress' },
    ],
  };

  return JSON.stringify(sample, null, 2);
}

/**
 * Parse CSV format text into structured WeekData object with automatic metric calculations.
 */
export function parseWeeklyCSV(csvText: string, previousWeek?: WeekData): WeekData {
  if (!csvText || csvText.trim().length === 0) {
    throw new Error('CSV content is empty.');
  }

  const lines = csvText.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);

  let dateRange = `Week of ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  let previousWeekRange = previousWeek?.dateRange || 'Previous Week';

  const espData: ESPData[] = [];
  const teamData: TeamMemberData[] = [];
  const activities: KeyActivity[] = [];
  const planItems: PlanItem[] = [];

  let currentSection: 'METADATA' | 'ESP_PLATFORMS' | 'TEAM_MEMBERS' | 'ACTIVITIES' | 'ACTION_PLAN' = 'METADATA';

  const knownESPs = ['ongage', 'netcore', 'maropost', 'valuefirst', 'mailkit', 'sendgrid', 'mailchimp', 'klaviyo', 'activecampaign', 'brevo', 'hubspot'];
  const knownTeam = ['sravani', 'dhanusri', 'sricharan', 'rajesh', 'ananya', 'vikram', 'john', 'sarah', 'alex', 'mike', 'emily'];

  lines.forEach((line) => {
    const cleanLine = line.replace(/^[#\-*\s]+/, '').trim();
    const upperLine = cleanLine.toUpperCase();

    if (upperLine.startsWith('METADATA') || upperLine.includes('DATE RANGE')) {
      currentSection = 'METADATA';
    } else if (upperLine.includes('ESP') || upperLine.includes('PLATFORM') || upperLine.includes('VENDOR')) {
      currentSection = 'ESP_PLATFORMS';
    } else if (upperLine.includes('TEAM') || upperLine.includes('ROSTER') || upperLine.includes('MEMBER') || upperLine.includes('STAFF')) {
      currentSection = 'TEAM_MEMBERS';
    } else if (upperLine.includes('ACTIVIT') || upperLine.includes('TASK') || upperLine.includes('LOG')) {
      currentSection = 'ACTIVITIES';
    } else if (upperLine.includes('PLAN') || upperLine.includes('GOAL') || upperLine.includes('TARGET')) {
      currentSection = 'ACTION_PLAN';
    }

    const cleanParts = splitCSVLine(line);
    if (cleanParts.length === 0) return;

    const firstCol = cleanParts[0].toLowerCase();

    if (
      firstCol === 'name' ||
      firstCol === 'esp' ||
      firstCol === 'activity' ||
      firstCol === 'date range' ||
      firstCol === 'category' ||
      firstCol.startsWith('#')
    ) {
      if (firstCol.includes('date range') && cleanParts[1]) {
        dateRange = cleanParts[1];
      }
      return;
    }

    let effectiveSection = currentSection;
    if (knownESPs.some((e) => firstCol.includes(e))) {
      effectiveSection = 'ESP_PLATFORMS';
    } else if (knownTeam.some((t) => firstCol.includes(t))) {
      effectiveSection = 'TEAM_MEMBERS';
    }

    if (effectiveSection === 'METADATA') {
      const key = cleanParts[0]?.toLowerCase();
      const val = cleanParts[1];
      if (key && val) {
        if (key.includes('date range') && !key.includes('previous')) {
          dateRange = val;
        } else if (key.includes('previous')) {
          previousWeekRange = val;
        }
      }
    } else if (effectiveSection === 'ESP_PLATFORMS') {
      if (cleanParts.length >= 2) {
        const name = cleanParts[0];
        const campaigns = parseFloat(cleanParts[1]) || 0;
        const hours = cleanParts.length >= 3 ? (parseFloat(cleanParts[2]) || 0) : Math.round((campaigns / 12) * 10) / 10;
        
        const utilization = Math.min(100, Math.round((hours / 40) * 100 * 10) / 10);
        const prevEsp = previousWeek?.espData.find((e) => e.name.toLowerCase() === name.toLowerCase());
        const previousWeekUtilization = prevEsp ? prevEsp.utilization : utilization;

        espData.push({
          id: `esp-${Date.now()}-${espData.length + 1}`,
          name,
          campaigns,
          hours,
          utilization,
          previousWeekUtilization,
        });
      }
    } else if (effectiveSection === 'TEAM_MEMBERS') {
      if (cleanParts.length >= 2) {
        const name = cleanParts[0];
        const hasRole = cleanParts.length >= 4 || isNaN(Number(cleanParts[1]));
        const role = hasRole ? cleanParts[1] : 'Operations Specialist';
        
        const campaignsIndex = hasRole ? 2 : 1;
        const hoursIndex = hasRole ? 3 : 2;

        const campaigns = parseFloat(cleanParts[campaignsIndex]) || 0;
        const hours = parseFloat(cleanParts[hoursIndex]) || 31.5;

        const avgHoursPerDay = Math.round((hours / 5) * 100) / 100;
        const utilization = Math.min(100, Math.round((hours / 40) * 100 * 10) / 10);

        const prevTm = previousWeek?.teamData.find((t) => t.name.toLowerCase() === name.toLowerCase());
        const previousWeekUtilization = prevTm ? prevTm.utilization : utilization;

        teamData.push({
          id: `tm-${Date.now()}-${teamData.length + 1}`,
          name,
          role,
          campaigns,
          hours,
          avgHoursPerDay,
          utilization,
          dailyUtilization: utilization,
          previousWeekUtilization,
          status: 'Submitted',
          espBreakdown: [
            { id: `eb-1`, esp: 'Ongage', campaigns: Math.round(campaigns * 0.45), utilization },
            { id: `eb-2`, esp: 'Netcore', campaigns: Math.round(campaigns * 0.35), utilization },
            { id: `eb-3`, esp: 'Maropost', campaigns: Math.round(campaigns * 0.10), utilization },
            { id: `eb-4`, esp: 'ValueFirst', campaigns: Math.round(campaigns * 0.10), utilization },
          ],
          description: `${name}'s weekly operational execution, campaign scheduling and ESP monitoring.`,
          keyActivities: ['Campaign scheduling', 'ESP utilization monitoring', 'QA testing'],
          thisWeekPlan: ['Complete campaign scheduling', 'Monitor ESP limits'],
        });
      }
    } else if (effectiveSection === 'ACTIVITIES') {
      if (cleanParts.length >= 1) {
        const activity = cleanParts[0];
        const owner = cleanParts[1] || 'Team';
        const rawStatus = (cleanParts[2] || 'In Progress').toLowerCase();
        let status: 'Completed' | 'In Progress' | 'Blocked' = 'In Progress';
        if (rawStatus.includes('complete') || rawStatus.includes('done')) status = 'Completed';
        else if (rawStatus.includes('block')) status = 'Blocked';

        const completionPercentage = parseFloat(cleanParts[3]) || (status === 'Completed' ? 100 : 50);
        const category = cleanParts[4] || 'Operations';

        activities.push({
          id: `act-${Date.now()}-${activities.length + 1}`,
          activity,
          owner,
          status,
          completionPercentage,
          category,
        });
      }
    } else if (effectiveSection === 'ACTION_PLAN') {
      if (cleanParts.length >= 1) {
        const activity = cleanParts[0];
        const owner = cleanParts[1] || 'Team';
        const rawPriority = (cleanParts[2] || 'Medium').toLowerCase();
        let priority: 'High' | 'Medium' | 'Low' = 'Medium';
        if (rawPriority.includes('high')) priority = 'High';
        else if (rawPriority.includes('low')) priority = 'Low';

        const targetDate = cleanParts[3] || 'Next Week';
        const rawStatus = (cleanParts[4] || 'Planned').toLowerCase();
        let status: 'In Progress' | 'Planned' | 'Completed' = 'Planned';
        if (rawStatus.includes('progress')) status = 'In Progress';
        else if (rawStatus.includes('complete')) status = 'Completed';

        planItems.push({
          id: `pi-${Date.now()}-${planItems.length + 1}`,
          activity,
          owner,
          priority,
          targetDate,
          status,
        });
      }
    }
  });

  // Fallback default ESP list if none found in CSV
  if (espData.length === 0) {
    const defaultList = previousWeek?.espData || [
      { id: 'esp-1', name: 'Ongage', campaigns: 420, hours: 58.5, utilization: 95.0, previousWeekUtilization: 91.2 },
      { id: 'esp-2', name: 'Netcore', campaigns: 385, hours: 54.0, utilization: 98.0, previousWeekUtilization: 94.5 },
      { id: 'esp-3', name: 'Maropost', campaigns: 180, hours: 28.0, utilization: 92.0, previousWeekUtilization: 88.0 },
      { id: 'esp-4', name: 'ValueFirst', campaigns: 260, hours: 46.0, utilization: 96.0, previousWeekUtilization: 92.5 },
    ];
    espData.push(...defaultList.map((e) => ({ ...e, id: `esp-${Date.now()}-${e.name}` })));
  }

  // Fallback default Team Roster if none found in CSV
  if (teamData.length === 0) {
    const defaultRoster = previousWeek?.teamData || [
      {
        id: 'tm-1',
        name: 'Sravani',
        role: 'Sr. Operations Specialist',
        campaigns: 270,
        hours: 31.5,
        avgHoursPerDay: 7.88,
        utilization: 95.5,
        dailyUtilization: 98.5,
        previousWeekUtilization: 93.75,
        status: 'Submitted',
        espBreakdown: [
          { id: '1', esp: 'Ongage', campaigns: 120, utilization: 95.0 },
          { id: '2', esp: 'Netcore', campaigns: 85, utilization: 98.0 },
          { id: '3', esp: 'Maropost', campaigns: 25, utilization: 92.0 },
          { id: '4', esp: 'ValueFirst', campaigns: 40, utilization: 96.0 },
        ],
        description: 'Campaign scheduling, QA, ESP rotation and monitoring.',
        keyActivities: ['Campaign scheduling', 'ESP utilization monitoring', 'Domain monitoring'],
        thisWeekPlan: ['Complete campaign scheduling', 'Monitor ESP credits'],
      },
    ];
    teamData.push(...defaultRoster.map((t) => ({ ...t, id: `tm-${Date.now()}-${t.name}` })));
  }

  // Calculate totals and metrics automatically
  const totalCampaigns = teamData.reduce((acc, t) => acc + t.campaigns, 0) || espData.reduce((acc, e) => acc + e.campaigns, 0);
  const totalHours = teamData.reduce((acc, t) => acc + t.hours, 0) || espData.reduce((acc, e) => acc + e.hours, 0);
  const totalTeamMembers = teamData.length;
  
  const totalCapacity = Math.max(40, totalTeamMembers * 40);
  const teamUtilization = Math.round((totalHours / totalCapacity) * 100 * 10) / 10;
  const completedActivitiesCount = activities.filter((a) => a.status === 'Completed').length;

  return {
    id: `week-${Date.now()}`,
    dateRange,
    previousWeekRange,
    summary: {
      teamUtilization,
      prevTeamUtilization: previousWeek?.summary.teamUtilization || teamUtilization,
      totalCampaigns,
      prevTotalCampaigns: previousWeek?.summary.totalCampaigns || totalCampaigns,
      totalHours: Math.round(totalHours * 10) / 10,
      prevTotalHours: previousWeek?.summary.totalHours || totalHours,
      totalTeamMembers,
      prevTotalTeamMembers: previousWeek?.summary.totalTeamMembers || totalTeamMembers,
      completedActivitiesCount,
      prevCompletedActivitiesCount: previousWeek?.summary.completedActivitiesCount || completedActivitiesCount,
    },
    espData,
    teamData,
    activities,
    planItems,
  };
}

/**
 * Validate and parse JSON uploaded weekly report data.
 */
export function parseWeeklyJSON(jsonText: string, previousWeek?: WeekData): WeekData {
  let parsed: any;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error('Invalid JSON format: Could not parse string.');
  }

  const dateRange = parsed.dateRange || `Week of ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  const newWeek: WeekData = {
    id: `week-${Date.now()}`,
    dateRange,
    previousWeekRange: parsed.previousWeekRange || previousWeek?.dateRange || 'Previous Week',
    summary: {
      teamUtilization: parsed.summary?.teamUtilization ?? 96.8,
      prevTeamUtilization: parsed.summary?.prevTeamUtilization ?? (previousWeek?.summary.teamUtilization || 92.0),
      totalCampaigns: parsed.summary?.totalCampaigns ?? 1245,
      prevTotalCampaigns: parsed.summary?.prevTotalCampaigns ?? (previousWeek?.summary.totalCampaigns || 1180),
      totalHours: parsed.summary?.totalHours ?? 186.5,
      prevTotalHours: parsed.summary?.prevTotalHours ?? (previousWeek?.summary.totalHours || 178.0),
      totalTeamMembers: parsed.summary?.totalTeamMembers ?? 6,
      prevTotalTeamMembers: parsed.summary?.prevTotalTeamMembers ?? (previousWeek?.summary.totalTeamMembers || 6),
      completedActivitiesCount: parsed.summary?.completedActivitiesCount ?? 22,
      prevCompletedActivitiesCount: parsed.summary?.prevCompletedActivitiesCount ?? (previousWeek?.summary.completedActivitiesCount || 18),
    },
    espData: Array.isArray(parsed.espData) && parsed.espData.length > 0 ? parsed.espData : (previousWeek?.espData || []),
    teamData: Array.isArray(parsed.teamData) && parsed.teamData.length > 0 ? parsed.teamData : (previousWeek?.teamData || []),
    activities: Array.isArray(parsed.activities) && parsed.activities.length > 0 ? parsed.activities : (previousWeek?.activities || []),
    planItems: Array.isArray(parsed.planItems) && parsed.planItems.length > 0 ? parsed.planItems : (previousWeek?.planItems || []),
  };

  return newWeek;
}
