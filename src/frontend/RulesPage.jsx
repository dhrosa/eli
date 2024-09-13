import ModelTable from "./ModelTable";

import * as Api from "./Api";

export default function () {
  return (
    <ModelTable
      model={Api.Rule}
      fields={[
        { name: "name", label: "Name", widget: "text" },
        { name: "text", label: "Prompt", widget: "textarea" },
      ]}
    />
  );
}
