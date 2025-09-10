import { FC, ComponentProps, ReactNode } from "react";
import styles from "./style.module.css";

type CommonButtonProps = ComponentProps<"button"> & {
  children: ReactNode;
};

export const CommonButton: FC<CommonButtonProps> = ({ 
  children, 
  type,
  onClick, 
}) => (
  <button className={styles.button} type={type} onClick={onClick}>
    {children}
  </button>
);