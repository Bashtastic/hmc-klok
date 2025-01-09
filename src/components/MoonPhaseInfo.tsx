interface MoonPhaseInfoProps {
  moonPhase: string;
  moonDescription: string;
}

const MoonPhaseInfo = ({ moonPhase, moonDescription }: MoonPhaseInfoProps) => {
  return (
    <div className="flex items-center justify-center mb-8 space-x-4">
      <span className="text-foreground text-4xl">{moonPhase}</span>
      <span className="text-foreground text-3xl">{moonDescription}</span>
    </div>
  );
};

export default MoonPhaseInfo;