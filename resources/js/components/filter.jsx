import { Label } from "./ui/label";

const Filter = ({ label, children }) => {
    return (
        <div>
            <Label>{label}</Label>
            {children}
        </div>
    );
};

export default Filter;
