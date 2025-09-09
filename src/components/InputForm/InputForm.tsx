import { FC, ComponentProps } from "react";
import style from "./style.module.css";

type InputFormProps = ComponentProps<"input">

export const InputForm: FC<InputFormProps> =({
  disabled,
  value,
  placeholder,
  onChange,
  onKeyDown,
}) => (
  <input 
    disabled={disabled}
    className={style.input}
    type="text"
    value={value}
    placeholder={placeholder}
    onChange={onChange}
    onKeyDown={onKeyDown}
  />
);