import { useState } from "react";
import LoginForm from "./components/Login";
import DynamicForm from "./components/Form";
import { FormResponse } from "./types/formType";

function App() {
  const [formData, setFormData] = useState<FormResponse["form"] | null>(null);

  return (
    <div>
      {!formData ? (
        <LoginForm onSuccess={setFormData} />
      ) : (
        <DynamicForm form={formData} />
      )}
    </div>
  );
}

export default App;
