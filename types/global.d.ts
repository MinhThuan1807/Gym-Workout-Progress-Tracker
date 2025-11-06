declare global {
    type SignInFormData = {
        email: string;
        password: string;
    };
    type SignUpFormData = {
        email: string;
        password: string;
        confirmPassword: string;
    }

    type FormInputProps = {
        name: string;
        label: string;
        placeholder: string;
        type?: string;
        register: UseFormRegister<SignUpFormData>;
        error?: FieldError;
        validation?: RegisterOptions;
        disabled?: boolean;
        value?: string;
    }   
    type FormCheckoutInputProps = {
        name: keyof CheckoutFormData;
        label: string;
        placeholder: string;
        type?: string;
        register: UseFormRegister<CheckoutFormData>;
        error?: FieldError;
        validation?: RegisterOptions;
        disabled?: boolean;
        value?: string;
    }   
    type FooterLinkProps = {
        text: string;
        linkText: string;
        href: string;
    }

    interface User {
        _id: string;
        email: string;
        displayName?: string;
        role: string;
        gender?: string;
        dob?: Date;
        heightCm?: number;
        weightKg?: number;
        avatar?: string;
        verifyToken: string | null;
        token: string;
        createAt: Date;
        updateAt: Date;
    }

    interface AuthUser {
        _id: string;
        email: string;
        displayName?: string;
        role: string;
        avatar?: string;
    }
}
export {};