interface StepsProps {
  stepData: { stepName: string; onClick?: any; active?: boolean }[];
}

function renderTab(stepName: string, onClick?: any, active?: boolean) {
  if (active) {
    return (
      <a onClick={onClick} className="p-4 text-lg font-bold -mb-px border-b-2 border-current text-primary cursor-pointer">
        {stepName}
      </a>
    );
  }
  return (
    <a onClick={onClick} className="p-4 text-lg font-bold -mb-px border-b border-transparent hover:text-primary cursor-pointer">
      {stepName}
    </a>
  );
}

function Steps({ stepData }: StepsProps) {
  return (
    <nav className="w-11/12 px-4 sm:px-6 lg:px-8 flex text-sm font-medium border-b border-gray-100">
      {stepData.map((step) => renderTab(step.stepName, step.onClick, step.active))}
    </nav>
  );
}

export default Steps;
