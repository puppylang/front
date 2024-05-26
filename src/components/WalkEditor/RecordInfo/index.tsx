import { ReactNode } from 'react';

interface RecordInfoProps {
  label: string;
  value: string | ReactNode;
  containerStyle?: string;
  valueStyle?: string;
  labelStyle?: string;
}

function RecordInfo({
  containerStyle,
  value,
  label,
  valueStyle = 'text-sm ',
  labelStyle = 'text-[10px] text-text-2 ',
}: RecordInfoProps) {
  return (
    <div className={`text-center flex-1  mt-2 ${containerStyle}`}>
      <dl>
        <dt>
          <p className={valueStyle}>{value}</p>
        </dt>
        <dd className='leading-3'>
          <span className={labelStyle}>{label}</span>
        </dd>
      </dl>
    </div>
  );
}

export default RecordInfo;
