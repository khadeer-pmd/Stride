import type { RiskAssessment, RiskFactors, StudentProfile, Assessment } from '../types/academic';

/**
 * Calculates academic risk score using STRIDE's transparent early warning model:
 * Risk Score = (Performance Risk × 0.40) + (Decline Risk × 0.25) + (Attendance Risk × 0.20) + (Assignment Risk × 0.15)
 */
export function calculateRiskAssessment(
  academicAverage: number,
  assessments: Assessment[],
  attendancePercentage: number,
  completedAssignments: number,
  totalAssignments: number
): RiskAssessment {
  // 1. Performance Risk (0-100): Lower average = higher risk
  // If average is 85%, performance risk is 15%. If average is 50%, performance risk is 50%.
  const performanceRisk = Math.max(0, Math.min(100, 100 - academicAverage));

  // 2. Decline Risk (0-100): Detect downward trend in recent assessments
  let declineRisk = 0;
  let silentStruggleDetected = false;

  if (assessments.length >= 2) {
    const sorted = [...assessments].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const recent = sorted.slice(-4);
    
    // Check consecutive drops
    let totalDrop = 0;
    let consecutiveDrops = 0;
    
    for (let i = 1; i < recent.length; i++) {
      const diff = recent[i - 1].score - recent[i].score;
      if (diff > 0) {
        totalDrop += diff;
        consecutiveDrops++;
      }
    }

    if (recent.length >= 3 && consecutiveDrops >= 2) {
      silentStruggleDetected = true;
    }

    declineRisk = Math.min(100, Math.round(totalDrop * 2.5 + consecutiveDrops * 15));
  }

  // 3. Attendance Risk (0-100): Lower attendance = higher risk
  const attendanceRisk = Math.max(0, Math.min(100, 100 - attendancePercentage));

  // 4. Assignment Risk (0-100): Incomplete ratio
  const pendingCount = totalAssignments - completedAssignments;
  const assignmentRisk = totalAssignments > 0 
    ? Math.round((pendingCount / totalAssignments) * 100) 
    : 0;

  // Calculate weighted score
  const totalScore = Math.round(
    performanceRisk * 0.40 +
    declineRisk * 0.25 +
    attendanceRisk * 0.20 +
    assignmentRisk * 0.15
  );

  let category: 'Low' | 'Medium' | 'High' = 'Low';
  if (totalScore >= 60) {
    category = 'High';
  } else if (totalScore >= 30) {
    category = 'Medium';
  }

  // Generate data-driven human-friendly explanation
  const explanationParts: string[] = [];
  if (declineRisk > 30) {
    explanationParts.push(`recent assessment scores dropped`);
  }
  if (assignmentRisk > 25) {
    explanationParts.push(`${pendingCount} assignments are currently pending`);
  }
  if (attendanceRisk > 20) {
    explanationParts.push(`attendance has fluctuated recently (${attendancePercentage}%)`);
  }
  if (performanceRisk > 40) {
    explanationParts.push(`current average is ${academicAverage}%`);
  }

  let explanation = "Your learning momentum is steady. Keep up the good work!";
  if (explanationParts.length > 0) {
    explanation = `Your academic support priority was adjusted because ${explanationParts.join(', and ')}.`;
  }

  const factors: RiskFactors = {
    performanceRisk,
    declineRisk,
    attendanceRisk,
    assignmentRisk
  };

  return {
    score: totalScore,
    category,
    factors,
    explanation,
    hasMissingData: false,
    silentStruggleDetected,
    lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };
}

/**
 * What-If Scenario Calculator
 */
export interface WhatIfScenario {
  extraAssignmentsCompleted: number;
  remedialSessionsPerWeek: number;
  projectedMathScoreIncrease: number;
}

export function simulateWhatIfScenario(student: StudentProfile, scenario: WhatIfScenario) {
  const newCompletedAssignments = Math.min(
    student.totalAssignments,
    student.completedAssignments + scenario.extraAssignmentsCompleted
  );

  // Remedial sessions add attendance & subject boost
  const attendanceBoost = scenario.remedialSessionsPerWeek * 2.5;
  const newAttendance = Math.min(100, Math.round(student.attendancePercentage + attendanceBoost));

  // Subject score boost
  const avgBoost = scenario.projectedMathScoreIncrease * 0.4;
  const newAcademicAverage = Math.min(100, Math.round(student.academicAverage + avgBoost));

  const projectedRisk = calculateRiskAssessment(
    newAcademicAverage,
    student.assessments,
    newAttendance,
    newCompletedAssignments,
    student.totalAssignments
  );

  return {
    currentAverage: student.academicAverage,
    projectedAverage: newAcademicAverage,
    currentAttendance: student.attendancePercentage,
    projectedAttendance: newAttendance,
    currentRiskScore: student.riskAssessment.score,
    projectedRiskScore: projectedRisk.score,
    currentCategory: student.riskAssessment.category,
    projectedCategory: projectedRisk.category,
    riskReducedBy: Math.max(0, student.riskAssessment.score - projectedRisk.score)
  };
}
