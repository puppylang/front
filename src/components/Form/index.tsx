import { ChangeEvent, InputHTMLAttributes, KeyboardEvent, ReactNode, useRef, useState } from 'react';

interface FormProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'type' | 'onChange'> {
  onChange: (value: string) => void;
  value?: string;
  title: string;
  divClassName?: string;
  isRequired?: boolean;
  errorText?: string;
}

function FormString({
  title,
  value,
  onChange,
  divClassName,
  errorText,
  isRequired,
  maxLength,
  minLength,
  ...props
}: FormProps) {
  const [isError, setIsError] = useState(false);

  const isErrorState = isError && minLength && maxLength && isRequired;

  return (
    <div className={`mb-6 ${divClassName || ''}`}>
      <div className='flex text-text-3 text-[12px] mb-1 items-center relative'>
        {isRequired && <p className='mr-[1px]'>*</p>}
        <p>{title}</p>
        {maxLength && (
          <p className='absolute right-0'>
            {value ? value.length : 0} / {maxLength}
          </p>
        )}
      </div>
      <input
        className={`px-[14px] py-[10px] rounded-[15px] block border border-gray-3 w-full text-[14px] ${
          isErrorState && 'border-red-500'
        }`}
        type='text'
        value={value}
        onKeyUp={({ currentTarget }) => (currentTarget.value.length < 2 ? setIsError(true) : setIsError(false))}
        onBlur={({ currentTarget }) => (currentTarget.value.length < 2 ? setIsError(true) : setIsError(false))}
        maxLength={maxLength}
        onChange={({ currentTarget }) => onChange(currentTarget.value)}
        {...props}
      />
      {isErrorState && (
        <p className='text-[12px] text-red-500'>
          {errorText || `${title}은 ${minLength}~${maxLength}자로 입력해주세요.`}
        </p>
      )}
    </div>
  );
}

function FormNumber({
  title,
  value,
  onChange,
  divClassName,
  isRequired,
  minLength,
  maxLength,
  errorText,
  ...props
}: Omit<FormProps, 'onChange'> & { onChange: (event: ChangeEvent<HTMLInputElement>) => void }) {
  const [isError, setIsError] = useState(false);

  const isErrorState = isError && minLength && maxLength && isRequired;

  return (
    <div className={`mb-6 ${divClassName || ''}`}>
      <div className='flex text-text-3 text-[12px] mb-1 items-center'>
        {isRequired && <p className='mr-[1px]'>*</p>}
        <p>{title}</p>
      </div>
      <input
        className={`px-[14px] py-[10px] rounded-[15px] block border border-gray-3 w-full text-[14px] ${
          isErrorState && 'border-red-500'
        }`}
        inputMode='numeric'
        onKeyUp={({ currentTarget }) =>
          minLength && currentTarget.value.length < minLength ? setIsError(true) : setIsError(false)
        }
        onBlur={({ currentTarget }) =>
          minLength && currentTarget.value.length < minLength ? setIsError(true) : setIsError(false)
        }
        value={value !== undefined ? value : ''}
        maxLength={maxLength}
        minLength={minLength}
        onChange={onChange}
        {...props}
      />
      {isErrorState && (
        <p className='text-[12px] text-red-500'>
          {errorText || `${title}은 ${minLength}~${maxLength}자로 입력해주세요.`}
        </p>
      )}
    </div>
  );
}

interface FormRadioProps extends Omit<FormProps, 'value'> {
  activedValue: string | null;
  firstInput: {
    value: string;
    id: string;
    title: string;
  };
  secondInput: {
    value: string;
    id: string;
    title: string;
  };
}

function FormRadio({
  title,
  firstInput,
  secondInput,
  activedValue,
  isRequired,
  onChange,
  divClassName,
}: FormRadioProps) {
  return (
    <div className={`mb-6 ${divClassName || ''}`}>
      <div className='flex text-text-3 text-[12px] mb-1 items-center'>
        {isRequired && <p className='mr-[1px]'>*</p>}
        <p>{title}</p>
      </div>
      <div className='grid grid-cols-2 gap-5'>
        <input
          value={firstInput.value}
          onChange={({ currentTarget }) => onChange(currentTarget.value)}
          type='radio'
          id={firstInput.id}
          name={title}
          className='hidden'
        />
        <label
          htmlFor={firstInput.id}
          className={`${
            activedValue === firstInput.value ? 'bg-main-2 text-white-1' : 'bg-gray-3 text-text-2'
          } block text-center text-[14px] py-4 rounded-3xl`}
        >
          {firstInput.title}
        </label>
        <input
          id={secondInput.id}
          value={secondInput.value}
          onChange={({ currentTarget }) => onChange(currentTarget.value)}
          name={title}
          type='radio'
          className='hidden'
        />
        <label
          htmlFor={secondInput.id}
          className={`${
            activedValue === secondInput.value ? 'bg-main-2 text-white-1' : 'bg-gray-3 text-text-2'
          } text-center text-[14px] py-4 rounded-3xl`}
        >
          {secondInput.title}
        </label>
      </div>
    </div>
  );
}

interface FormTextarea extends Omit<InputHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange' | 'onKeyUp'> {
  onChange: (value: string) => void;
  value?: string;
  title: string;
  divClassName?: string;
  isRequired?: boolean;
  errorText?: string;
}

function FormTextarea({
  title,
  minLength,
  value,
  onChange,
  divClassName,
  children,
  isRequired,
  errorText,
  ...props
}: FormTextarea) {
  const defaultTextareaHeight = useRef(78);

  const [isError, setIsError] = useState(false);
  const [currentHeight, setCurrentHeight] = useState(defaultTextareaHeight.current);

  const isErrorState = isError && minLength && isRequired;

  const onKeyUpTextarea = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    const { currentTarget } = event;
    if (!currentTarget) return;
    if (minLength && currentTarget.value.length < minLength) {
      setIsError(true);
    } else {
      setIsError(false);
    }

    const { scrollHeight } = currentTarget;

    if (scrollHeight >= defaultTextareaHeight.current && scrollHeight - currentHeight > 2) {
      currentTarget.style.height = `${scrollHeight}px`;
      setCurrentHeight(scrollHeight);
      return;
    }

    if (currentHeight - scrollHeight >= 2 && currentHeight > defaultTextareaHeight.current) {
      const calcuratedGood = currentHeight - 20 < 78 ? 78 : currentHeight - 20;
      currentTarget.style.height = `${calcuratedGood}px`;
      setCurrentHeight(scrollHeight);
    }
  };

  return (
    <div className={`mb-6 ${divClassName || ''}`}>
      <div className='flex text-text-3 text-[12px] mb-1 items-center'>
        {isRequired && <p className='mr-[1px]'>*</p>}
        <p>{title}</p>
      </div>
      {children}
      <textarea
        id='character'
        onBlur={({ currentTarget }) =>
          minLength && currentTarget.value.length < minLength ? setIsError(true) : setIsError(false)
        }
        onKeyUp={onKeyUpTextarea}
        value={value}
        onChange={({ currentTarget }) => onChange(currentTarget.value)}
        className={`resize-none overflow-hidden w-full border border-gray-3 rounded-[15px] px-[14px] py-[10px] text-[14px] h-[80px] outline-none focus:outline-none ${
          isErrorState && 'border-red-500'
        }`}
        {...props}
      />
      {isErrorState && (
        <p className='text-[12px] text-red-500'>{errorText || `${title}은 ${minLength}자 이상 입력해주세요.`}</p>
      )}
    </div>
  );
}

interface FormTitleProps {
  divClassName?: string;
  title: string;
  children: ReactNode;
  isRequired?: boolean;
}

function FormTitle({ divClassName = '', title, children, isRequired }: FormTitleProps) {
  return (
    <div className={`mb-6 ${divClassName || ''}`}>
      <div className='flex text-text-3 text-[12px] mb-1 items-center'>
        {isRequired && <p className='mr-[1px]'>*</p>}
        <p>{title}</p>
      </div>
      {children}
    </div>
  );
}

export const Form = {
  String: FormString,
  Number: FormNumber,
  Radio: FormRadio,
  Textarea: FormTextarea,
  Title: FormTitle,
};
