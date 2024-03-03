import { createLazyFileRoute } from "@tanstack/react-router";

export const Router = createLazyFileRoute("/restaurant/$slug/manage/tables")({
  component: TablesView
});

function TablesView() {
  return (<>

  </>);
}
