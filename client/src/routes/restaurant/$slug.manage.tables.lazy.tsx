import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/restaurant/$slug/manage/tables")({
  component: TablesView
});

function TablesView() {
  return (<>

  </>);
}
