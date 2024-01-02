import { CheckboxProps, useCheckbox } from "@nextui-org/checkbox";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { Check } from "react-feather";
import { tv } from "tailwind-variants";

const checkbox = tv({
  slots: {
    base: "cursor-pointer border-default hover:bg-primary-100 hover:text-primary w-full flex justify-center items-center rounded-lg bg-background-100 bg-default-200 py-2 gap-2",
  },
  variants: {
    isSelected: {
      true: {
        base: "border-primary bg-primary-100 hover:bg-primary-200 text-primary",
      },
    },
    isFocusVisible: {
      true: {
        base: "outline-none ring-2 ring-focus ring-offset-2 ring-offset-background",
      },
    },
  },
});

export const CustomCheckbox = (props: CheckboxProps) => {
  const { children, isSelected, isFocusVisible, getBaseProps, getInputProps } =
    useCheckbox({
      ...props,
    });

  const styles = checkbox({ isSelected, isFocusVisible });

  return (
    <label {...getBaseProps()} className="w-full">
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <div className={styles.base()}>
        {isSelected && <Check size={18} />}
        {children ? children : isSelected ? "Enabled" : "Disabled"}
      </div>
    </label>
  );
};
