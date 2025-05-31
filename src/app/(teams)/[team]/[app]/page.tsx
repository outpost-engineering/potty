interface Params {
  team: string;
  app: string;
}

interface Props {
  params: Promise<Params>;
}

export default async function App(props: Props) {
  const params = await props.params;

  return <main>App: {JSON.stringify(params)}</main>;
}
