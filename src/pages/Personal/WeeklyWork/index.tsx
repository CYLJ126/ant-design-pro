import Steps from './steps';
import DayRecords from './dayRecords';

function getSteps() {
  return [
    { key: 0, uuid: 0, content: '完成雇主责任险了解；' },
    { key: 1, uuid: 1, content: '完成对公险种了解；' },
    { key: 2, uuid: 2, content: '完成相关保司资料整理；' },
    { key: 3, uuid: 3, content: '完成PPT场景修改；' },
    { key: 4, uuid: 4, content: '完成结算负责人培训；' },
    { key: 5, uuid: 5, content: '完成培训跟进；' },
  ];
}

function getData() {
  return [
    {
      fatherId: 1,
      dayOfTarget: 0,
      dayOfMonth: 9,
      plannedProgress: 20,
      actualProgress: 15,
      score: 8,
    },
    {
      fatherId: 1,
      dayOfTarget: 1,
      dayOfMonth: 10,
      plannedProgress: 40,
      actualProgress: 40,
      score: 7,
    },
    {
      fatherId: 1,
      dayOfTarget: 2,
      dayOfMonth: 11,
      plannedProgress: 50,
      actualProgress: 50,
      score: 7,
    },
    {
      fatherId: 1,
      dayOfTarget: 3,
      dayOfMonth: 12,
      plannedProgress: 60,
      actualProgress: 65,
      score: 8,
    },
    {
      fatherId: 1,
      dayOfTarget: 4,
      dayOfMonth: 13,
      plannedProgress: 75,
      actualProgress: 80,
      score: 9,
    },
    {
      fatherId: 1,
      dayOfTarget: 5,
      dayOfMonth: 14,
      plannedProgress: 100,
      actualProgress: 100,
      score: 9,
    },
    {
      fatherId: 1,
      dayOfTarget: 6,
      dayOfMonth: 15,
      plannedProgress: 100,
      actualProgress: 100,
      score: null,
    },
  ];
}

export default function WeeklyWork() {
  return (
    <div>
      <h1>WeeklyWork</h1>
      <Steps stepContents={getSteps()} />
      <DayRecords dayRecords={getData()} />
    </div>
  );
}
