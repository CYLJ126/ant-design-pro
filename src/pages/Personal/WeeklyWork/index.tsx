import Steps from './steps';

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

export default function WeeklyWork() {
  return (
    <div>
      <h1>WeeklyWork</h1>
      <Steps stepContents={getSteps()} />
    </div>
  );
}
