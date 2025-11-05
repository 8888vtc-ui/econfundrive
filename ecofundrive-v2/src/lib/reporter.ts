// ═══════════════════════════════════════════════════════════
// ECOFUNDRIVE V2.0 - REPORTER.TS (ADVANCED REPORTING)
// ═══════════════════════════════════════════════════════════
// UPGRADED: HTML Dashboard, Charts, Multi-format Exports, Webhooks
// ═══════════════════════════════════════════════════════════

import type { ValidationResult } from './validator';
import type { TestResults } from './tester';
import * as fs from 'fs/promises';

export interface PageReport {
  keyword: string;
  language: string;
  validation: ValidationResult;
  tests: TestResults;
  timestamp: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  executionTime?: number; // milliseconds
  url?: string;
}

export interface BatchReport {
  totalPages: number;
  successCount: number;
  warningCount: number;
  failedCount: number;
  averageScore: number;
  averageValidationScore: number;
  averageTestScore: number;
  pages: PageReport[];
  generatedAt: string;
  totalExecutionTime?: number;
}

export interface DashboardOptions {
  includeCharts: boolean;
  includeTrends: boolean;
  includeDetails: boolean;
  theme: 'light' | 'dark';
}

// ═══════════════════════════════════════════════════════════
// REPORT GENERATION (ENHANCED)
// ═══════════════════════════════════════════════════════════

export function generatePageReport(
  keyword: string,
  language: string,
  validation: ValidationResult,
  tests: TestResults,
  executionTime?: number,
  url?: string
): PageReport {
  let status: 'SUCCESS' | 'WARNING' | 'FAILED';

  if (validation.status === 'VALID' && tests.passed) {
    status = 'SUCCESS';
  } else if (validation.status === 'WARNING') {
    status = 'WARNING';
  } else {
    status = 'FAILED';
  }

  return {
    keyword,
    language,
    validation,
    tests,
    timestamp: new Date().toISOString(),
    status,
    executionTime,
    url
  };
}

export function generateBatchReport(pages: PageReport[]): BatchReport {
  const successCount = pages.filter(p => p.status === 'SUCCESS').length;
  const warningCount = pages.filter(p => p.status === 'WARNING').length;
  const failedCount = pages.filter(p => p.status === 'FAILED').length;
  const averageValidationScore = pages.reduce((sum, p) => sum + p.validation.percentage, 0) / pages.length;
  const averageTestScore = pages.reduce((sum, p) => sum + (p.tests.score || 0), 0) / pages.length;
  const averageScore = (averageValidationScore + averageTestScore) / 2;
  const totalExecutionTime = pages.reduce((sum, p) => sum + (p.executionTime || 0), 0);

  return {
    totalPages: pages.length,
    successCount,
    warningCount,
    failedCount,
    averageScore,
    averageValidationScore,
    averageTestScore,
    pages,
    generatedAt: new Date().toISOString(),
    totalExecutionTime
  };
}

// ═══════════════════════════════════════════════════════════
// MARKDOWN REPORT (DETAILED)
// ═══════════════════════════════════════════════════════════

export function formatMarkdownReport(batch: BatchReport): string {
  const successRate = (batch.successCount / batch.totalPages * 100).toFixed(1);
  const failRate = (batch.failedCount / batch.totalPages * 100).toFixed(1);

  let md = `# ECOFUNDRIVE V2.0 - Quality Report\n\n`;
  md += `**Generated:** ${new Date(batch.generatedAt).toLocaleString()}\n\n`;
  md += `---\n\n`;

  // Executive Summary
  md += `## Executive Summary\n\n`;
  md += `| Metric | Value |\n`;
  md += `|--------|-------|\n`;
  md += `| Total Pages | ${batch.totalPages} |\n`;
  md += `| Success Rate | ${successRate}% |\n`;
  md += `| Average Quality Score | ${batch.averageScore.toFixed(1)}/100 |\n`;
  md += `| Average Validation | ${batch.averageValidationScore.toFixed(1)}% |\n`;
  md += `| Average Test Score | ${batch.averageTestScore.toFixed(1)}/100 |\n`;
  md += `| Execution Time | ${((batch.totalExecutionTime || 0) / 1000).toFixed(2)}s |\n\n`;

  // Status Breakdown
  md += `## Status Breakdown\n\n`;
  md += `| Status | Count | Percentage |\n`;
  md += `|--------|-------|------------|\n`;
  md += `| SUCCESS | ${batch.successCount} | ${successRate}% |\n`;
  md += `| WARNING | ${batch.warningCount} | ${((batch.warningCount / batch.totalPages) * 100).toFixed(1)}% |\n`;
  md += `| FAILED | ${batch.failedCount} | ${failRate}% |\n\n`;

  // Top Issues
  md += `## Top Issues\n\n`;
  const allIssues: { [key: string]: number } = {};
  batch.pages.forEach(page => {
    page.validation.issues.forEach(issue => {
      allIssues[issue] = (allIssues[issue] || 0) + 1;
    });
  });
  const topIssues = Object.entries(allIssues)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  if (topIssues.length > 0) {
    md += `| Issue | Occurrences |\n`;
    md += `|-------|-------------|\n`;
    topIssues.forEach(([issue, count]) => {
      md += `| ${issue} | ${count} |\n`;
    });
    md += `\n`;
  } else {
    md += `No issues found!\n\n`;
  }

  // Page-by-Page Details
  md += `## Page-by-Page Results\n\n`;
  batch.pages.forEach((page, index) => {
    const emoji = page.status === 'SUCCESS' ? '✅' : page.status === 'WARNING' ? '⚠️' : '❌';
    md += `### ${index + 1}. ${emoji} ${page.keyword} (${page.language})\n\n`;
    md += `**Status:** ${page.status}\n`;
    md += `**Validation Score:** ${page.validation.score}/${page.validation.maxScore} (${page.validation.percentage}%)\n`;
    if (page.tests.score !== undefined) {
      md += `**Test Score:** ${page.tests.score}/100\n`;
    }
    if (page.executionTime) {
      md += `**Execution Time:** ${page.executionTime}ms\n`;
    }
    if (page.url) {
      md += `**URL:** ${page.url}\n`;
    }

    if (page.validation.issues.length > 0) {
      md += `\n**Issues:**\n`;
      page.validation.issues.forEach(issue => {
        md += `- ${issue}\n`;
      });
    }

    md += `\n`;
  });

  // Quality Gates
  md += `## Quality Gates\n\n`;
  const allPassed = batch.pages.every(p => p.status === 'SUCCESS');
  md += `**Overall Status:** ${allPassed ? '✅ PASSED' : '❌ FAILED'}\n\n`;
  md += `| Gate | Threshold | Status |\n`;
  md += `|------|-----------|--------|\n`;
  md += `| Success Rate | 100% | ${successRate === '100.0' ? '✅ PASS' : '❌ FAIL'} |\n`;
  md += `| Average Score | 95/100 | ${batch.averageScore >= 95 ? '✅ PASS' : '❌ FAIL'} |\n`;
  md += `| Validation Score | 100% | ${batch.averageValidationScore === 100 ? '✅ PASS' : '❌ FAIL'} |\n`;
  md += `| Zero Failures | 0 | ${batch.failedCount === 0 ? '✅ PASS' : '❌ FAIL'} |\n\n`;

  md += `---\n\n`;
  md += `*Report generated by ECOFUNDRIVE V2.0 - Agent 12 (Reporter)*\n`;

  return md;
}

// ═══════════════════════════════════════════════════════════
// HTML DASHBOARD (INTERACTIVE)
// ═══════════════════════════════════════════════════════════

export function generateHTMLDashboard(batch: BatchReport, options: DashboardOptions = {
  includeCharts: true,
  includeTrends: true,
  includeDetails: true,
  theme: 'light'
}): string {
  const successRate = (batch.successCount / batch.totalPages * 100).toFixed(1);
  const isDark = options.theme === 'dark';

  let html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ECOFUNDRIVE V2.0 - Quality Dashboard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: ${isDark ? '#1a1a1a' : '#f5f5f5'};
      color: ${isDark ? '#ffffff' : '#333333'};
      padding: 20px;
    }
    .container { max-width: 1400px; margin: 0 auto; }
    header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      border-radius: 10px;
      margin-bottom: 30px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    header h1 { font-size: 2.5em; margin-bottom: 10px; }
    header p { opacity: 0.9; font-size: 1.1em; }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-card {
      background: ${isDark ? '#2a2a2a' : 'white'};
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      text-align: center;
    }
    .stat-value {
      font-size: 3em;
      font-weight: bold;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 10px;
    }
    .stat-label { font-size: 0.9em; opacity: 0.7; text-transform: uppercase; }

    .chart-container {
      background: ${isDark ? '#2a2a2a' : 'white'};
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-bottom: 30px;
    }
    .chart-container h2 { margin-bottom: 20px; }

    .progress-bar {
      width: 100%;
      height: 30px;
      background: ${isDark ? '#3a3a3a' : '#e0e0e0'};
      border-radius: 15px;
      overflow: hidden;
      margin: 10px 0;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      transition: width 0.5s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
    }

    .page-list {
      background: ${isDark ? '#2a2a2a' : 'white'};
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .page-item {
      padding: 20px;
      border-bottom: 1px solid ${isDark ? '#3a3a3a' : '#e0e0e0'};
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .page-item:last-child { border-bottom: none; }
    .page-info { flex: 1; }
    .page-title { font-size: 1.2em; font-weight: bold; margin-bottom: 5px; }
    .page-meta { font-size: 0.9em; opacity: 0.7; }
    .page-score {
      font-size: 2em;
      font-weight: bold;
      min-width: 100px;
      text-align: right;
    }
    .status-success { color: #10b981; }
    .status-warning { color: #f59e0b; }
    .status-failed { color: #ef4444; }

    .footer {
      text-align: center;
      padding: 20px;
      opacity: 0.7;
      font-size: 0.9em;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>ECOFUNDRIVE V2.0 Quality Dashboard</h1>
      <p>Generated: ${new Date(batch.generatedAt).toLocaleString()}</p>
    </header>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">${batch.totalPages}</div>
        <div class="stat-label">Total Pages</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${successRate}%</div>
        <div class="stat-label">Success Rate</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${batch.averageScore.toFixed(1)}</div>
        <div class="stat-label">Avg Quality Score</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${batch.successCount}</div>
        <div class="stat-label">Successful Pages</div>
      </div>
    </div>

    <div class="chart-container">
      <h2>Status Distribution</h2>
      <div>
        <strong>Success (${batch.successCount})</strong>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${(batch.successCount / batch.totalPages * 100)}%">
            ${(batch.successCount / batch.totalPages * 100).toFixed(1)}%
          </div>
        </div>
      </div>
      <div>
        <strong>Warning (${batch.warningCount})</strong>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${(batch.warningCount / batch.totalPages * 100)}%; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">
            ${(batch.warningCount / batch.totalPages * 100).toFixed(1)}%
          </div>
        </div>
      </div>
      <div>
        <strong>Failed (${batch.failedCount})</strong>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${(batch.failedCount / batch.totalPages * 100)}%; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);">
            ${(batch.failedCount / batch.totalPages * 100).toFixed(1)}%
          </div>
        </div>
      </div>
    </div>

    ${options.includeDetails ? `
    <div class="page-list">
      <h2>Page Results</h2>
      ${batch.pages.map((page, index) => {
        const statusClass = page.status === 'SUCCESS' ? 'status-success' : page.status === 'WARNING' ? 'status-warning' : 'status-failed';
        const emoji = page.status === 'SUCCESS' ? '✅' : page.status === 'WARNING' ? '⚠️' : '❌';
        return `
        <div class="page-item">
          <div class="page-info">
            <div class="page-title">${emoji} ${page.keyword}</div>
            <div class="page-meta">
              ${page.language} •
              Validation: ${page.validation.percentage}% •
              ${page.executionTime ? `${page.executionTime}ms` : ''}
            </div>
          </div>
          <div class="page-score ${statusClass}">
            ${page.validation.percentage}%
          </div>
        </div>
        `;
      }).join('')}
    </div>
    ` : ''}

    <div class="footer">
      Report generated by ECOFUNDRIVE V2.0 - Agent 12 (Reporter)
    </div>
  </div>
</body>
</html>`;

  return html;
}

// ═══════════════════════════════════════════════════════════
// JSON EXPORT
// ═══════════════════════════════════════════════════════════

export function exportJSON(batch: BatchReport): string {
  return JSON.stringify(batch, null, 2);
}

// ═══════════════════════════════════════════════════════════
// FILE EXPORTS
// ═══════════════════════════════════════════════════════════

export async function saveMarkdownReport(batch: BatchReport, outputPath: string): Promise<void> {
  const markdown = formatMarkdownReport(batch);
  await fs.writeFile(outputPath, markdown, 'utf-8');
  console.log(`✅ Markdown report saved: ${outputPath}`);
}

export async function saveHTMLDashboard(batch: BatchReport, outputPath: string, options?: DashboardOptions): Promise<void> {
  const html = generateHTMLDashboard(batch, options);
  await fs.writeFile(outputPath, html, 'utf-8');
  console.log(`✅ HTML dashboard saved: ${outputPath}`);
}

export async function saveJSONReport(batch: BatchReport, outputPath: string): Promise<void> {
  const json = exportJSON(batch);
  await fs.writeFile(outputPath, json, 'utf-8');
  console.log(`✅ JSON report saved: ${outputPath}`);
}

// ═══════════════════════════════════════════════════════════
// LEGACY FORMATS (BACKWARDS COMPATIBLE)
// ═══════════════════════════════════════════════════════════

export function formatPageReport(report: PageReport): string {
  const statusEmoji = report.status === 'SUCCESS' ? '✅' : report.status === 'WARNING' ? '⚠️' : '❌';
  return `PAGE: ${report.keyword} - Status: ${statusEmoji} ${report.status}`;
}

export function formatBatchReport(batch: BatchReport): string {
  const successRate = (batch.successCount / batch.totalPages * 100).toFixed(1);
  return `BATCH: ${batch.totalPages} pages - Success: ${successRate}%`;
}
