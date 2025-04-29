import { useFormContext } from "react-hook-form";
import { FormField } from "../types/formType";

interface Props {
  field: FormField;
}

export default function FieldRenderer({ field }: Props) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const rules: Record<string, any> = {};
  const label = field.label || field.fieldId;

  if (field.required) {
    rules.required = field.validation?.message || `${label} is required.`;
  }
  if (field.minLength) {
    rules.minLength = {
      value: field.minLength,
      message: `Minimum length is ${field.minLength}`,
    };
  }
  if (field.maxLength) {
    rules.maxLength = {
      value: field.maxLength,
      message: `Maximum length is ${field.maxLength}`,
    };
  }

  if (field.type === "email") {
    rules.pattern = {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Invalid email address",
    };
  }

  if (field.type === "tel") {
    rules.pattern = {
      value: /^[0-9]{6,15}$/,
      message: "Invalid phone number (must be 6-15 digits)",
    };
  }

  const error = errors[field.fieldId]?.message as string;

  const commonProps = {
    ...register(field.fieldId, rules),
    placeholder: field.placeholder || "",
    "data-testid": field.dataTestId || undefined,
  };

  const renderField = () => {
    switch (field.type) {
      case "text":
      case "tel":
      case "email":
      case "date":
        return <input type={field.type} {...commonProps} />;
      case "textarea":
        return <textarea {...commonProps} rows={4} />;
      case "dropdown":
        return (
          <select {...commonProps}>
            <option value="">-- Select --</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      case "radio":
        return (
          <div>
            {field.options?.map((opt) => (
              <label
                key={opt.value}
                style={{ display: "block", marginBottom: 4 }}
              >
                <input
                  type="radio"
                  value={opt.value}
                  {...register(field.fieldId, rules)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        );
      case "checkbox":
        return (
          <div>
            {field.options?.map((opt) => (
              <label
                key={opt.value}
                style={{ display: "block", marginBottom: 4 }}
              >
                <input
                  type="checkbox"
                  value={opt.value}
                  {...register(field.fieldId)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        );
      default:
        return <input type="text" {...commonProps} />;
    }
  };

  return (
    <div style={{ marginBottom: "15px" }}>
      <label>
        {field.label}
        {field.required && <span style={{ color: "red" }}> *</span>}
      </label>
      {renderField()}
      {error && (
        <p className="error" style={{ color: "red" }}>
          {error}
        </p>
      )}
    </div>
  );
}
