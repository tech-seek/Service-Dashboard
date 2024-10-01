import { useState } from "react";

export const useFormField = (initialValue: string) => {
    const [value, setValue] = useState<string>(initialValue);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value);
    return { value, onChange: handleChange };
};

