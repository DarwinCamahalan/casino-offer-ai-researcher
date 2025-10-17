/**
 * API Route: /api/scheduler/config
 * Configure and manage scheduled research
 * Next.js 14 App Router format
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  startScheduledResearch,
  stopScheduledResearch,
  isScheduledResearchRunning,
  ScheduleConfig,
} from '@/lib/services/schedulerService'

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      is_running: isScheduledResearchRunning(),
      message: isScheduledResearchRunning()
        ? 'Scheduled research is active'
        : 'Scheduled research is not running',
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const config: ScheduleConfig = await request.json()

    if (!config.cron_expression) {
      return NextResponse.json(
        {
          success: false,
          error: {
            error: 'Invalid Configuration',
            message: 'cron_expression is required',
          },
        },
        { status: 400 }
      )
    }

    startScheduledResearch(config)

    return NextResponse.json({
      success: true,
      data: {
        message: 'Scheduled research started',
        config,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          error: 'Configuration Error',
          message: error instanceof Error ? error.message : 'Failed to start scheduler',
        },
      },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  stopScheduledResearch()
  return NextResponse.json({
    success: true,
    data: {
      message: 'Scheduled research stopped',
    },
  })
}
