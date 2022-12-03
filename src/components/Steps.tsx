interface StepsProps {
  stepData: { stepName: string; stepDetails: string; image: any; active?: boolean }[];
}

function renderStep(stepName: string, stepDetails: string, image: any, index: number, stepDataLength: number, active?: boolean) {
  let tabMode = "p-4 flex text-lg font-bold -mb-px border-b border-transparent w-full";
  if (active) {
    tabMode = "p-4 flex text-lg font-bold -mb-px border-b-2 border-current text-primary w-full";
  }
  return (
    <a className={tabMode}>
      {image}
      <p className="leading-none">
        <strong className="block font-medium"> {stepName} </strong>
        <small className="mt-1">{stepDetails}</small>
      </p>
    </a>
  );
}

function Steps({ stepData }: StepsProps) {
  return (
    <nav className="w-11/12 px-4 sm:px-6 lg:px-8 flex text-sm font-medium border-b border-gray-100">
      {stepData.map((step, index) => renderStep(step.stepName, step.stepDetails, step.image, index, stepData.length, step.active))}
    </nav>
  );
}

export default Steps;
