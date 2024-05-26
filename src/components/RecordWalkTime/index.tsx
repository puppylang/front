export function FormattedRecordWalkTime({
  value,
  label,
  alwaysVisible = false,
  labelStyle = '',
}: {
  value: number;
  label: string;
  alwaysVisible?: boolean;
  labelStyle?: string;
}) {
  if (alwaysVisible) {
    return (
      <>
        {value}
        <span className={`text-xs ${labelStyle}`}>{label}</span>
      </>
    );
  }

  return (
    value > 0 && (
      <>
        {value}
        <span className={`text-xs ${labelStyle}`}>{label}</span>
      </>
    )
  );
}
