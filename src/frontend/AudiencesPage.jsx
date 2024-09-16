import ModelTable from "./ModelTable";

import * as Api from "./Api";

export default function AudiencesPage() {
  return (
    <ModelTable
      model={Api.Audience}
      fields={[
        { name: "name", label: "Name", widget: "text" },
        { name: "prompt", label: "Prompt", widget: "textarea" },
      ]}
    />
  );
}
