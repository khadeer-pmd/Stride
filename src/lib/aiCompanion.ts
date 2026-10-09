import type { StudentProfile } from '../types/academic';

export interface AIAdviceResponse {
  attentionTopic: string;
  whyItMatters: string;
  actionSteps: string[];
  estimatedDuration: string;
  trackingMethod: string;
  encouragementNote: string;
}

export function generateCompanionResponse(prompt: string, student: StudentProfile): AIAdviceResponse {
  const lower = prompt.toLowerCase();

  if (lower.includes('math') || lower.includes('mathematics')) {
    const mathSub = student.subjects.find(s => s.subjectName.toLowerCase().includes('math'));
    const score = mathSub ? mathSub.currentScore : 68;
    return {
      attentionTopic: `Mathematics (Current Score: ${score}%)`,
      whyItMatters: `Mathematics builds sequentially on core concepts like Calculus and Linear Algebra. Strengthening foundational topics now prevents confusion in upcoming assessments.`,
      actionSteps: [
        'Review recent quiz errors on differential equations (15 mins)',
        'Solve 5 practice problems from Chapter 4 (25 mins)',
        'Write out a formula cheat-sheet for quick memory recall (10 mins)'
      ],
      estimatedDuration: '50 minutes daily for 3 days',
      trackingMethod: 'Check off Mathematics practice tasks in your STRIDE Study Planner.',
      encouragementNote: 'You have shown great persistence! Taking step-by-step problem sessions will turn this subject into your strength.'
    };
  }

  if (lower.includes('7-day') || lower.includes('seven-day') || lower.includes('revision plan') || lower.includes('plan')) {
    return {
      attentionTopic: '7-Day Balanced Revision Plan',
      whyItMatters: 'Spacing out study sessions over 7 days avoids exam night cramming and improves long-term memory retention.',
      actionSteps: [
        'Day 1-2: Mathematics key problem sets (45 min/day)',
        'Day 3-4: Data Structures & Algorithms lab practice (40 min/day)',
        'Day 5: Computer Networks flashcard review (30 min)',
        'Day 6: Complete 2 pending assignments (50 min)',
        'Day 7: Full practice test simulation & quiet rest (60 min)'
      ],
      estimatedDuration: '40 - 50 minutes per day',
      trackingMethod: 'Mark daily checkins in the "Today\'s Plan" tab.',
      encouragementNote: 'Remember: Consistency beats intensity. Every 30 minutes counted towards your progress!'
    };
  }

  if (lower.includes('pending') || lower.includes('assignment')) {
    return {
      attentionTopic: `${student.pendingAssignments} Pending Assignments requiring submission`,
      whyItMatters: 'Completing assignments on time accounts for 15% of your total academic support evaluation and boosts your continuous assessment mark.',
      actionSteps: [
        'Break assignment into 3 micro-tasks (e.g., Outline, Draft, Review)',
        'Set a 25-minute Pomodoro timer for focus',
        'Ask faculty or mentor if you hit a blocking question early'
      ],
      estimatedDuration: '35 minutes per assignment',
      trackingMethod: 'Submit on course portal and check completion badge in STRIDE.',
      encouragementNote: 'Getting even one assignment completed today will instantly relieve study pressure!'
    };
  }

  if (lower.includes('progress') || lower.includes('recent')) {
    return {
      attentionTopic: `Academic Progress Analysis (Average: ${student.academicAverage}%)`,
      whyItMatters: 'Tracking your overall trajectory helps celebrate improvements in subjects like Data Structures while providing timely focus for areas that need practice.',
      actionSteps: [
        'Maintain high performance in subjects above 80%',
        'Schedule 2 extra practice sessions for subjects below 70%',
        'Review attendance consistency (currently at ${student.attendancePercentage}%)'
      ],
      estimatedDuration: '15 minute weekly review',
      trackingMethod: 'Compare monthly trendline charts in "My Journey".',
      encouragementNote: 'You are taking active ownership of your education. Every step forward is meaningful progress!'
    };
  }

  // Default response for general queries
  return {
    attentionTopic: `Personalized Academic Support Strategy for ${student.name}`,
    whyItMatters: 'Focusing your effort on high-yield study habits keeps your learning manageable and stress-free.',
    actionSteps: [
      `Focus on ${student.subjects[0]?.subjectName || 'your core subject'} practice today`,
      'Complete 1 pending assignment before Friday',
      'Attend the next scheduled mentor check-in'
    ],
    estimatedDuration: '30 - 45 minutes',
    trackingMethod: 'Use the STRIDE Study Planner and check off items.',
    encouragementNote: 'You don\'t need to have everything solved at once. Just start with one small step!'
  };
}
