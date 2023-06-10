import { ActivityType } from'../features/allActivities/activityTypes'

export default function generateActivityName(activityType: ActivityType) {
  const now = new Date()

  return `${getNameForHourOfDay(now.getHours())} ${activityType}`
}

function getNameForHourOfDay(hour: number) {
  if(0 <= hour && hour < 5) return 'Overnight'
  if(5 <= hour && hour < 7) return 'Early morning'
  if(7 <= hour && hour < 10) return 'Overnight'
  if(10 <= hour && hour < 12) return 'Late morning'
  if(12 <= hour && hour < 14) return 'Early afternoon'
  if(14 <= hour && hour < 17) return 'Afternoon'
  if(17 <= hour && hour < 19) return 'Evening'
  return 'Nighttime'
}
