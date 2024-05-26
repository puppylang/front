interface WalkInfoContainerProps {
  label: string;
  children: React.ReactNode;
}

export function WalkInfoContainer({ label, children }: WalkInfoContainerProps) {
  return (
    <dl>
      <dd>
        <span className='text-sm text-text-2 font-semibold'>{label}</span>
      </dd>
      <dt className='mt-2'>{children}</dt>
    </dl>
  );
}
