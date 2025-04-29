import { useForm, FormProvider } from "react-hook-form";
import { useState } from "react";
import { FormSection } from "../types/formType";
import Section from "./Section";

interface Props {
  form: {
    formTitle: string;
    formId: string;
    version: string;
    sections: FormSection[];
  };
}

// 👇 Add this to define dynamic form structure
type DynamicFormValues = {
  [key: string]: any;
};

export default function DynamicForm({ form }: Props) {
  const methods = useForm<DynamicFormValues>({ mode: "onTouched" }); // 👈 Add type
  const [currentSection, setCurrentSection] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const section = form.sections[currentSection];
  const isLast = currentSection === form.sections.length - 1;

  const handleNext = async () => {
    const result = await methods.trigger(section.fields.map((f) => f.fieldId));
    if (result) setCurrentSection((prev) => prev + 1);
  };

  const handlePrev = () => setCurrentSection((prev) => prev - 1);

  const onSubmit = (data: DynamicFormValues) => {
    setSubmitted(true);
    console.log("✅ Form Submitted:", data);
    alert("Form submitted! Check console for output.");
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <h2 style={{ marginBottom: "10px" }}>{form.formTitle}</h2>
        <p className="step-indicator">
          Section {currentSection + 1} of {form.sections.length}
        </p>

        <Section section={section} />

        <div className="section-nav">
          {currentSection > 0 && (
            <button type="button" onClick={handlePrev}>
              Prev
            </button>
          )}

          {!isLast && (
            <button type="button" onClick={handleNext}>
              Next
            </button>
          )}

          {isLast && <button type="submit">Submit</button>}
        </div>

        {submitted && (
          <p style={{ marginTop: "15px", color: "green" }}>
            Submitted! Check console.
          </p>
        )}
      </form>
    </FormProvider>
  );
}
