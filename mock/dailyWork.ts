import { Request, Response } from 'express';
import dayjs from 'dayjs';

export default {
  'POST /dw/weeklyDays/listWeekDaysHeader': (req: Request, res: Response) => {
    res.send({
      success: true,
      code: 10000,
      data: [
        { dayOfWeek: '周一', dayOfDate: '02/17' },
        { dayOfWeek: '周二', dayOfDate: '02/18' },
        { dayOfWeek: '周三', dayOfDate: '02/19' },
        { dayOfWeek: '周四', dayOfDate: '02/20' },
        { dayOfWeek: '周五', dayOfDate: '02/21' },
        { dayOfWeek: '周六', dayOfDate: '02/22' },
        { dayOfWeek: '周日', dayOfDate: '02/23' },
      ],
    });
  },
  'POST /dw/weeklyWork/statistics': (req: Request, res: Response) => {
    res.send({
      success: true,
      code: 10000,
      data: {
        weekId: 49,
        score: 8.5,
        completed: 35,
        overdue: 87,
        todo: 98,
      },
    });
  },
  'POST /dw/weeklyWork/listTargets': (req: Request, res: Response) => {
    res.send({
      success: true,
      code: 10000,
      data: [
        {
          id: 1,
          themeId: 1,
          workId: 8,
          target: '完成产品场景整理完成产品场景整理',
          score: 8.5,
          proportion: 65,
          startTime: '2025/01/24',
          endTime: '2025/02/24',
        },
        {
          id: 2,
          themeId: 1,
          workId: 8,
          target: '完成产品场景整理',
          score: 8.5,
          proportion: 65,
          startTime: '2025/01/24',
          endTime: '2025/02/24',
        },
        {
          id: 3,
          themeId: 1,
          workId: 8,
          target: '完成产品场景整理',
          score: 8.5,
          proportion: 65,
          startTime: '2025/01/24',
          endTime: '2025/02/24',
        },
        {
          id: 4,
          themeId: 1,
          workId: 8,
          target: '完成产品场景整理',
          score: 8.5,
          proportion: 65,
          startTime: '2025/01/24',
          endTime: '2025/02/24',
        },
        {
          id: 5,
          themeId: 1,
          workId: 8,
          target: '完成产品场景整理',
          score: 8.5,
          proportion: 65,
          startTime: '2025/01/24',
          endTime: '2025/02/24',
        },
        {
          id: 6,
          themeId: 1,
          workId: 8,
          target: '完成产品场景整理',
          score: 8.5,
          proportion: 65,
          startTime: '2025/01/24',
          endTime: '2025/02/24',
        },
        {
          id: 7,
          themeId: 1,
          workId: 8,
          target: '完成产品场景整理',
          score: 8.5,
          proportion: 65,
          startTime: '2025/01/24',
          endTime: '2025/02/24',
        },
      ],
    });
  },
  'POST /dw/weeklyWork/listCurrentTargets': (req: Request, res: Response) => {
    res.send({
      success: true,
      code: 10000,
      data: [
        {
          id: 1,
          themeId: 1,
          workId: 8,
          target: '完成产品场景整理完成产品场景整理',
          score: 8.5,
          proportion: 65,
          startTime: '2025/01/24',
          endTime: '2025/02/24',
        },
        {
          id: 2,
          themeId: 1,
          workId: 8,
          target: '完成产品场景整理',
          score: 8.5,
          proportion: 65,
          startTime: '2025/01/24',
          endTime: '2025/02/24',
        },
        {
          id: 3,
          themeId: 1,
          workId: 8,
          target: '完成产品场景整理',
          score: 8.5,
          proportion: 65,
          startTime: '2025/01/24',
          endTime: '2025/02/24',
        },
        {
          id: 4,
          themeId: 1,
          workId: 8,
          target: '完成产品场景整理',
          score: 8.5,
          proportion: 65,
          startTime: '2025/01/24',
          endTime: '2025/02/24',
        },
        {
          id: 5,
          themeId: 1,
          workId: 8,
          target: '完成产品场景整理',
          score: 8.5,
          proportion: 65,
          startTime: '2025/01/24',
          endTime: '2025/02/24',
        },
        {
          id: 6,
          themeId: 1,
          workId: 8,
          target: '完成产品场景整理',
          score: 8.5,
          proportion: 65,
          startTime: '2025/01/24',
          endTime: '2025/02/24',
        },
        {
          id: 7,
          themeId: 1,
          workId: 8,
          target: '完成产品场景整理',
          score: 8.5,
          proportion: 65,
          startTime: '2025/01/24',
          endTime: '2025/02/24',
        },
      ],
    });
  },
  'POST /dw/weeklyDays/listWeekDays': (req: Request, res: Response) => {
    res.send({
      success: true,
      code: 10000,
      data: [
        {
          id: 1,
          targetId: 1,
          dayOfTarget: 0,
          dayOfMonth: 9,
          plannedProgress: 20,
          actualProgress: 15,
          score: 8,
        },
        {
          id: 2,
          targetId: 1,
          dayOfTarget: 1,
          dayOfMonth: 10,
          plannedProgress: 40,
          actualProgress: 40,
          score: 7,
        },
        {
          id: 3,
          targetId: 1,
          dayOfTarget: 2,
          dayOfMonth: 11,
          plannedProgress: 50,
          actualProgress: 50,
          score: 7,
        },
        {
          id: 4,
          targetId: 1,
          dayOfTarget: 3,
          dayOfMonth: 12,
          plannedProgress: 60,
          actualProgress: 65,
          score: 8,
        },
        {
          id: 5,
          targetId: 1,
          dayOfTarget: 4,
          dayOfMonth: 13,
          plannedProgress: 75,
          actualProgress: 80,
          score: 9,
        },
        {
          id: 6,
          targetId: 1,
          dayOfTarget: 5,
          dayOfMonth: 14,
          plannedProgress: 100,
          actualProgress: 100,
          score: 9,
        },
        {
          id: 7,
          targetId: 1,
          dayOfTarget: 6,
          dayOfMonth: 15,
          plannedProgress: 100,
          actualProgress: 100,
          score: 0,
        },
      ],
    });
  },
  'POST /dw/steps/listSteps': (req: Request, res: Response) => {
    res.send({
      success: true,
      code: 10000,
      data: [
        { id: 0, content: '完成雇主责任险了解；' },
        { id: 1, content: '完成对公险种了解；' },
        { id: 2, content: '完成相关保司资料整理；' },
        { id: 3, content: '完成PPT场景修改；' },
        { id: 4, content: '完成结算负责人培训；' },
        { id: 5, content: '完成培训跟进；' },
      ],
    });
  },
  'POST /dw/steps/saveSteps': (req: Request, res: Response) => {
    res.send({
      success: true,
      code: 10000,
      data: true,
    });
  },
  'POST /dw/weeklyWork/addTarget': (req: Request, res: Response) => {
    res.send({
      success: true,
      code: 10000,
      data: {
        id: dayjs().unix(),
        themeId: 1,
        workId: 8,
        target: '',
        score: 0,
        proportion: 0,
        startTime: '2025/01/24',
        endTime: '2025/02/24',
      },
    });
  },
  'POST /dw/weeklyWork/deleteTarget': (req: Request, res: Response) => {
    res.send({
      success: true,
      code: 10000,
      data: true,
    });
  },
};
