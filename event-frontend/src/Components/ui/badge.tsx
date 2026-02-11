import * as React from "react";
import classNames from "classnames";
import { Slot } from "@radix-ui/react-slot";

type BadgeElement = React.ElementRef<"span">;

type BadgeColor = "gray" | "blue" | "green" | "orange" | "red";
type BadgeRadius = "full" | "md" | "lg";

type BadgeProps = React.ComponentPropsWithoutRef<"span"> & {
    asChild?: boolean;
    color?: BadgeColor;
    radius?: BadgeRadius;
};

const Badge = React.forwardRef<BadgeElement, BadgeProps>(
    ({ asChild, className, color = "gray", radius = "full", ...props }, forwardedRef) => {
        const Comp = asChild ? Slot : "span";

        return (
            <Comp
                data-accent-color={color}
                data-radius={radius}
                ref={forwardedRef}
                className={classNames("rt-reset", "rt-Badge", className)}
                {...props}
            />
        );
    }
);

Badge.displayName = "Badge";

export { Badge };
export type { BadgeProps };
