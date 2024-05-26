import { ChangeEvent, ReactNode } from 'react';

interface FormInputsContainerProps {
  label: string;
  isRequired?: boolean;
  children: ReactNode;
}

function FormInputsContainer({ label, isRequired, children }: FormInputsContainerProps) {
  return (
    <dl>
      <dt className='text-text-3 text-xs font-normal mb-2'>
        {label}
        {isRequired && <span>*</span>}
      </dt>
      <dd className='relative'>{children}</dd>
    </dl>
  );
}

interface TextInputProps {
  placeholder?: string;
  value: string;
  maxLength?: number;
  onChange?: (value: string) => void;
}

function TextInput({ placeholder, value, maxLength, onChange }: TextInputProps) {
  const isError = Boolean(value && maxLength && value.length > maxLength);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.currentTarget.value);
    }
  };

  return (
    <>
      <input
        type='text'
        placeholder={placeholder || ''}
        value={value}
        className={`w-full h-10 text-sm text-text-1 px-4 pt-2 pb-[10px] border-[1px] border-gray-3 rounded-[5px] 
          ${
            isError
              ? 'border-red-1 focus:border-1 focus:border-red-1 focus:outline-0 shadow-[0_0_0_1px_rgb(229,62,62)]'
              : 'border-gray-3 focus:border-1 focus:border-gray-3 focus:outline-0'
          } ${maxLength && 'pr-[74px]'}`}
        onChange={handleOnChange}
      />
      {maxLength && (
        <p className={`absolute bottom-[10px] right-4 text-xs ${isError ? 'text-red-1' : 'text-text-1'}`}>
          ({`${value.length} / ${maxLength}`})
        </p>
      )}
    </>
  );
}

interface NumericInputProps {
  placeholder?: string;
  value: number;
  maxNum?: number;
  onChange?: (value: number) => void;
  children?: ReactNode;
}

function NumericInput({ placeholder, value, maxNum, onChange, children }: NumericInputProps) {
  const isError = Boolean(maxNum && value > maxNum);

  const addComma = (price: number) => {
    const returnString = price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return returnString;
  };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    const formatValue = value.replace(/^[0]|[^0-9,]/g, '').replaceAll(',', '');

    if (onChange) {
      onChange(Number(formatValue));
    }
  };

  return (
    <>
      <input
        type='text'
        placeholder={placeholder || ''}
        value={addComma(value) || ''}
        onChange={handleOnChange}
        className={`w-full h-10 text-sm text-text-1 ${
          children ? 'pl-8' : 'pl-4'
        } pr-4 pt-2 pb-[10px] border-[1px] border-gray-3 rounded-[5px] 
        ${
          isError
            ? 'border-red-1 focus:border-1 focus:border-red-1 focus:outline-0 shadow-[0_0_0_1px_rgb(229,62,62)]'
            : 'border-gray-3 focus:border-1 focus:border-gray-3 focus:outline-0'
        }`}
      />
      {children}
      {maxNum && (
        <p className={`absolute bottom-[10px] right-4 text-xs ${isError ? 'text-red-1' : 'text-text-1'}`}>
          ({`${value.toLocaleString()} / ${maxNum.toLocaleString()}`})
        </p>
      )}
    </>
  );
}

interface TextAreaProps {
  placeholder?: string;
  value: string;
  maxLength: number;
  onChange?: (value: string) => void;
}

function TextArea({ placeholder, value, maxLength, onChange }: TextAreaProps) {
  const isError = Boolean(value && maxLength && value.length > maxLength);

  const handleOnChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e.currentTarget.value);
    }
  };

  return (
    <>
      <textarea
        className={`w-full h-[250px] text-sm px-4 pt-2 text-sm text-text-1  border-[1px]  rounded-[5px] resize-none duration-300 ${
          isError
            ? 'border-red-1 focus:border-1 focus:border-red-1 focus:outline-0 shadow-[0_0_0_1px_rgb(229,62,62)]'
            : 'border-gray-3 focus:border-1 focus:border-gray-3 focus:outline-0'
        }`}
        placeholder={placeholder || ''}
        value={value}
        onChange={handleOnChange}
      />
      {maxLength && (
        <p className={`absolute bottom-4 right-4 text-xs ${isError ? 'text-red-1' : 'text-text-1'}`}>
          ({`${value.length} / ${maxLength}`})
        </p>
      )}
    </>
  );
}

export const FormInputsWithLabel = {
  Container: FormInputsContainer,
  TextInput,
  NumericInput,
  TextArea,
};
